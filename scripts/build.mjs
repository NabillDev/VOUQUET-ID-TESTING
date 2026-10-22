import { execSync } from "child_process";

// Ensure required environment variables have safe fallbacks during CI/Vercel builds
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}
if (!process.env.ADMIN_PASSWORD) {
  process.env.ADMIN_PASSWORD = "adminpassword123";
}
if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = "vouquet_session_secret_change_me_in_production_1234567890";
}

console.log("[Build] 1. Generating Prisma Client...");
execSync("npx prisma generate", { stdio: "inherit", env: process.env });

console.log("[Build] 2. Ensuring database schema is synced...");
try {
  execSync("npx prisma db push --skip-generate", { stdio: "inherit", env: process.env });
} catch (e) {
  console.warn("[Build] prisma db push note:", e.message);
}

console.log("[Build] 3. Running database seed...");
try {
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env: process.env });
} catch (e) {
  console.warn("[Build] seed note:", e.message);
}

console.log("[Build] 4. Building Next.js production bundle...");
execSync("next build", { stdio: "inherit", env: process.env });
