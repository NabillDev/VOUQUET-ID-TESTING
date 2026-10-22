import fs from "fs/promises";
import path from "path";

export interface StorageProvider {
  save(file: File): Promise<string>;
  delete(url: string): Promise<void>;
}

class LocalDiskStorage implements StorageProvider {
  private uploadDir = path.join(process.cwd(), "public", "uploads");

  async save(file: File): Promise<string> {
    await fs.mkdir(this.uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const cleanName = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "");
    const filename = `${Date.now()}-${cleanName}${ext}`;
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
