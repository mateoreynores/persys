const TRUTHY = ["1", "true", "yes", "on"];

export function envFlag(value: string | undefined) {
  return value ? TRUTHY.includes(value.toLowerCase()) : false;
}

function splitCsv(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function isClerkConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
  );
}

export function getClerkAdminUserIds() {
  return splitCsv(process.env.CLERK_ADMIN_USER_IDS);
}

export function getClerkAdminEmails() {
  return splitCsv(process.env.CLERK_ADMIN_EMAILS).map((email) => email.toLowerCase());
}

export function hasClerkAdminRestrictions() {
  return getClerkAdminUserIds().length > 0 || getClerkAdminEmails().length > 0;
}

export function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ??
    process.env.NEON_DATABASE_URL ??
    process.env.NEON_POSTGRES_URL ??
    null
  );
}

export function isDatabaseConfigured() {
  return Boolean(getDatabaseUrl());
}

export function getBusinessWhatsAppNumber() {
  return (process.env.BUSINESS_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
}

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBaseUrl: string;
};

export function getR2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
    return null;
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicBaseUrl: publicBaseUrl.replace(/\/+$/, ""),
  };
}

export function isR2Configured() {
  return getR2Config() !== null;
}
