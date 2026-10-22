import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const prismaDir = path.join(process.cwd(), "prisma");
const devDb = path.join(prismaDir, "dev.db");
const seedDb = path.join(prismaDir, "seed.sqlite");

// 1. If dev.db does not exist, copy from seed.sqlite
if (!fs.existsSync(devDb) && fs.existsSync(seedDb)) {
  fs.copyFileSync(seedDb, devDb);
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${devDb}`;
}
if (!process.env.ADMIN_PASSWORD) {
  process.env.ADMIN_PASSWORD = "adminpassword123";
}
if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET =
    "vouquet_session_secret_change_me_in_production_1234567890";
}

console.log("[Build] 1. Generating Prisma Client...");
execSync("npx prisma generate", { stdio: "inherit", env: process.env });

console.log("[Build] 2. Ensuring database schema is synced...");
try {
  execSync("npx prisma db push --skip-generate", {
    stdio: "inherit",
    env: process.env,
  });
} catch (e) {
  console.warn("[Build] prisma db push note:", e.message);
}

// 3. Keep seed.sqlite updated from dev.db
try {
  if (fs.existsSync(devDb)) {
    fs.copyFileSync(devDb, seedDb);
  }
} catch (e) {
  // ignore
}

console.log("[Build] 3. Building Next.js production bundle...");
execSync("next build", { stdio: "inherit", env: process.env });
