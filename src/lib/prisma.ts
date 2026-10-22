import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function setupDatabase(): string {
  // If user provided a cloud database URL (e.g. Postgres, Turso, Supabase), use it directly
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) {
    return process.env.DATABASE_URL;
  }

  // Detect serverless environment (Vercel / AWS Lambda)
  const isServerless = Boolean(
    process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
  );

  if (isServerless) {
    const tmpDbPath = path.join("/tmp", "dev.db");

    // In serverless, /var/task is read-only. We copy the template database to writable /tmp
    if (!fs.existsSync(tmpDbPath)) {
      const candidateTemplates = [
        path.join(process.cwd(), "prisma", "seed.sqlite"),
        path.join("/var/task", "prisma", "seed.sqlite"),
        path.join(process.cwd(), "prisma", "dev.db"),
        path.join("/var/task", "prisma", "dev.db"),
      ];

      for (const tpl of candidateTemplates) {
        if (fs.existsSync(tpl)) {
          try {
            fs.copyFileSync(tpl, tmpDbPath);
            break;
          } catch (err) {
            console.warn("Could not copy sqlite template from", tpl, err);
          }
        }
      }
    }

    return `file:${tmpDbPath}`;
  }

  // Local development: use standard local SQLite path
  const localDb = path.join(process.cwd(), "prisma", "dev.db");
  return process.env.DATABASE_URL || `file:${localDb}`;
}

const dbUrl = setupDatabase();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
