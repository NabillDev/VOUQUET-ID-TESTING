import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface StorageProvider {
  save(file: File): Promise<string>;
  delete(url: string): Promise<void>;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false;

  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }

  if (mimeType === "image/webp") {
    const isRiff =
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46;
    const isWebp =
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;
    return isRiff && isWebp;
  }

  return false;
}

class LocalDiskStorage implements StorageProvider {
  private uploadDir = path.join(process.cwd(), "public", "uploads");

  async save(file: File): Promise<string> {
    if (!file || file.size === 0) {
      throw new Error("Berkas foto tidak valid atau kosong.");
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error("Ukuran berkas terlalu besar. Maksimal 5 MB.");
    }

    const mime = file.type.toLowerCase();
    const ext = ALLOWED_MIME_TYPES[mime];

    if (!ext) {
      throw new Error(
        "Format berkas tidak diizinkan. Hanya format JPG, PNG, dan WebP yang diperbolehkan."
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!validateMagicBytes(buffer, mime)) {
      throw new Error(
        "Isi berkas tidak cocok dengan format gambar yang dinyatakan."
      );
    }

    await fs.mkdir(this.uploadDir, { recursive: true });

    // Generate non-guessable random UUID filename to prevent traversal and collisions
    const filename = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    const filePath = path.join(this.uploadDir, filename);

    await fs.writeFile(filePath, buffer);
    return `/uploads/${filename}`;
  }

  async delete(url: string): Promise<void> {
    if (!url.startsWith("/uploads/")) return;
    const filename = path.basename(url);
    const filePath = path.join(this.uploadDir, filename);
    try {
      await fs.unlink(filePath);
    } catch {
      // Ignore if file already removed
    }
  }
}

export const storage: StorageProvider = new LocalDiskStorage();
