"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateOrderAccessToken } from "@/lib/auth";

const verificationAttempts = new Map<string, { count: number; lastAttempt: number }>();

function checkVerificationRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  const entry = verificationAttempts.get(ip);
  if (!entry || now - entry.lastAttempt > windowMs) {
    verificationAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count += 1;
  entry.lastAttempt = now;
  return true;
}

export interface VerifyOrderPhoneResult {
  success: boolean;
  token?: string;
  error?: string;
}

export async function verifyOrderPhoneAction(
  orderCode: string,
  last4Digits: string
): Promise<VerifyOrderPhoneResult> {
  let clientIp = "127.0.0.1";
  try {
    const headerList = headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const realIp = headerList.get("x-real-ip");
    clientIp = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : realIp || "127.0.0.1";
  } catch {
    // Fallback if called outside request store
  }

  if (!checkVerificationRateLimit(clientIp)) {
    return {
      success: false,
      error:
        "Terlalu banyak percobaan verifikasi. Silakan coba kembali dalam 15 menit.",
    };
  }

  const cleanInput = last4Digits.replace(/\D/g, "").trim();
  if (cleanInput.length !== 4) {
    return {
      success: false,
      error: "Masukkan tepat 4 digit angka terakhir nomor telepon.",
    };
  }

  const order = await prisma.order.findUnique({
    where: { code: orderCode.trim() },
    select: { id: true, code: true, buyerPhone: true, recipientPhone: true },
  });

  if (!order) {
    return {
      success: false,
      error: "Pesanan dengan kode ini tidak ditemukan.",
    };
  }

  const buyerDigits = order.buyerPhone.replace(/\D/g, "");
  const recipientDigits = order.recipientPhone.replace(/\D/g, "");

  const matches =
    buyerDigits.endsWith(cleanInput) || recipientDigits.endsWith(cleanInput);

  if (!matches) {
    return {
      success: false,
      error: "4 digit nomor telepon tidak cocok dengan data pemesan.",
    };
  }

  const token = generateOrderAccessToken(order.code, order.id);
  return {
    success: true,
    token,
  };
}