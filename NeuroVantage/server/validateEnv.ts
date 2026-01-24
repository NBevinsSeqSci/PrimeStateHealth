const REQUIRED_IN_PROD = ["DATABASE_URL"] as const;

const resolveMailerMode = () => {
  const raw = (process.env.MAILER_MODE || "").toLowerCase();
  if (raw === "smtp" || raw === "console" || raw === "disabled") {
    return raw;
  }
  return process.env.NODE_ENV === "production" ? "disabled" : "console";
};

const SMTP_ENV = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"] as const;

export function validateEnv() {
  if (process.env.NODE_ENV !== "production") return;

  const missing = REQUIRED_IN_PROD.filter((name) => !process.env[name]);
  if (missing.length === 0) return;

  console.error(`[env] Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

export function warnMailerEnv() {
  const mode = resolveMailerMode();
  if (mode !== "smtp") return;
  const missingSmtp = SMTP_ENV.filter((name) => !process.env[name]);
  if (missingSmtp.length > 0) {
    console.warn(
      `[env] MAILER_MODE=smtp but missing SMTP env vars: ${missingSmtp.join(
        ", "
      )}. Email will be disabled until configured.`
    );
  }
}
