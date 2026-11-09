// Admin seed (npm run db:seed:admin): creates the one admin account without prompts, from
//
//   ADMIN_EMAIL     the admin's sign-in email
//   ADMIN_NAME      display name
//   ADMIN_PASSWORD  PASSWORD_MIN_LENGTH–PASSWORD_MAX_LENGTH characters (lib/auth/password-rules.js)
//
// read from the environment or .env, against DATABASE_URL. Useful for a fresh database
// (local, or a new host after a migration). For changing the email or password of an
// existing admin, use the interactive `npm run admin` instead.
//
// Safe to run more than once: if any user account already exists, nothing is changed (the
// project allows exactly one admin, and an existing password is never overwritten).
// The password is stored only as Better Auth's scrypt hash and is never printed. Remove
// ADMIN_PASSWORD from .env (or the host's environment) once the admin has been created.
// A database that isn't on this machine must be reached over TLS (sslmode=require or stricter).
import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client.ts";
import { adminAccountSchema, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../lib/validations/auth.js";

function fail(message) {
  console.error(`[admin seed] ✖ ${message}`);
  process.exit(1);
}

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1", "[::1]"];
const SECURE_SSL_MODES = ["require", "verify-ca", "verify-full"];

// Errors never include the URL itself (it contains the database password)
const connectionString = process.env.DATABASE_URL;
if (!connectionString) fail("DATABASE_URL is not set. Copy .env.example to .env first.");
let url;
try {
  url = new URL(connectionString);
} catch {
  fail("DATABASE_URL is not a valid connection URL.");
}
if (url.protocol !== "postgresql:" && url.protocol !== "postgres:") fail("DATABASE_URL must start with postgresql://");
const isLocal = LOCAL_HOSTS.includes(url.hostname);
if (!isLocal && !SECURE_SSL_MODES.includes(url.searchParams.get("sslmode")?.toLowerCase())) {
  fail("A remote DATABASE_URL must require TLS (add ?sslmode=require). Nothing was changed.");
}

const parsed = adminAccountSchema.safeParse({
  email: process.env.ADMIN_EMAIL ?? "",
  name: process.env.ADMIN_NAME ?? "",
  password: process.env.ADMIN_PASSWORD ?? "",
});
if (!parsed.success) {
  fail(
    "Set ADMIN_EMAIL, ADMIN_NAME and ADMIN_PASSWORD " +
      `(${PASSWORD_MIN_LENGTH}–${PASSWORD_MAX_LENGTH} characters) in .env. Nothing was changed:\n` +
      parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n"),
  );
}
const { email, name, password } = parsed.data;

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

// Same database and password hashing as the app (lib/auth/auth.js) and scripts/manage-admin.mjs
const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, minPasswordLength: PASSWORD_MIN_LENGTH, maxPasswordLength: PASSWORD_MAX_LENGTH },
  telemetry: { enabled: false },
  logger: { level: "error" },
});

const target = `${url.hostname}/${decodeURIComponent(url.pathname.replace(/^\//, ""))}`;

try {
  const existing = await prisma.user.findFirst({ select: { email: true } });
  if (existing) {
    console.log(`[admin seed] An admin account already exists (${existing.email}) on ${target}. Nothing was changed.`);
  } else {
    const ctx = await auth.$context;
    const passwordHash = await ctx.password.hash(password);
    // User and its password login are created together, so a failure never leaves a user
    // without a password
    await prisma.$transaction(async (tx) => {
      const now = new Date();
      const id = ctx.generateId({ model: "user" });
      await tx.user.create({ data: { id, email, name, emailVerified: true, createdAt: now, updatedAt: now } });
      await tx.account.create({
        data: {
          id: ctx.generateId({ model: "account" }),
          userId: id,
          accountId: id,
          providerId: "credential",
          password: passwordHash,
          createdAt: now,
          updatedAt: now,
        },
      });
    });
    console.log(`[admin seed] ✔ Admin account created for ${email} on ${target}. Sign in at /admin/login`);
    console.log("[admin seed] Remove ADMIN_PASSWORD from .env / the environment now that it has been used.");
  }
} catch (error) {
  console.error("[admin seed] ✖ Failed:", error?.message ?? error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
