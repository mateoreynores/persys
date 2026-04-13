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
