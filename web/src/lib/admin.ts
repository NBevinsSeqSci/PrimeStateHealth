export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;

  const allowlist = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return allowlist.includes(email.toLowerCase());
}
