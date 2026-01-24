type TurnstileResult = {
  success: boolean;
  skipped?: boolean;
  error?: string;
};

export const verifyTurnstile = async (
  token: string | null,
  ip?: string | null
): Promise<TurnstileResult> => {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { success: true, skipped: true };
  }

  if (!token) {
    return { success: false, error: "Missing Turnstile token." };
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip) {
    formData.append("remoteip", ip);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = (await response.json()) as { success?: boolean };
  return { success: !!data.success };
};
