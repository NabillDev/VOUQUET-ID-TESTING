"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { verifyOrderPhoneAction } from "@/app/actions/order";

interface OrderVerificationFormProps {
  orderCode: string;
}

export function OrderVerificationForm({
  orderCode,
}: OrderVerificationFormProps) {
  const router = useRouter();
  const [last4, setLast4] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (last4.length !== 4) {
      setError("Masukkan tepat 4 digit angka terakhir nomor telepon Anda.");
      return;
    }

    startTransition(async () => {
      const res = await verifyOrderPhoneAction(orderCode, last4);
      if (res.success && res.token) {
        // Navigate to the verified view with access token
        router.push(`/order/${orderCode}?token=${res.token}`);
      } else {
        setError(res.error || "Gagal memverifikasi nomor telepon.");
      }
    });
  };

  return (
    <div className="bg-surface border border-border rounded-theme p-5 sm:p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-surfaceStrong border border-border flex items-center justify-center text-primary shrink-0">
          <Lock className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display font-bold text-base text-ink flex items-center gap-2">
            <span>Privasi Data Terlindungi</span>
            <span className="text-[10px] font-sans px-2 py-0.5 bg-surfaceStrong border border-border rounded-full text-primary font-semibold">
              Sensor Aktif
            </span>
          </h2>
          <p className="text-xs text-inkMuted leading-relaxed">
            Nomor telepon, alamat lengkap, dan isi kartu ucapan disamarkan untuk
            keamanan privasi pemesan. Masukkan 4 digit terakhir nomor WhatsApp
            pemesan untuk membuka rincian lengkap.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-surfaceStrong border border-primary/30 rounded-theme flex items-center gap-2 text-xs text-ink">
          <AlertCircle className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      <form
        onSubmit={handleVerify}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
      >
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            required
            aria-label="4 digit terakhir nomor WhatsApp"
            placeholder="Contoh: 7890"
            value={last4}
            onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
            className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink placeholder:text-inkMuted focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] font-mono tracking-wider"
          />
        </div>

        <button
          type="submit"
          disabled={isPending || last4.length !== 4}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-onPrimary font-semibold text-xs rounded-theme hover:bg-primaryHover transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
        >
          {isPending ? (
            <span>Memverifikasi...</span>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Buka Rincian Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}