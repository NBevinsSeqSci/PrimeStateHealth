import * as brevo from "@getbrevo/brevo";

type FollowUpPayload = {
  email: string;
  score: number;
  testId: string;
};

type MagicLinkPayload = {
  email: string;
  url: string;
  host: string;
};

const getBrevoClient = () => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set.");
  }

  const apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
  return apiInstance;
};

const getBrevoSender = () => {
  const senderEmail = process.env.BREVO_FROM_EMAIL;
  const senderName = process.env.BREVO_FROM_NAME ?? "Prime State Health";

  if (!senderEmail) {
    throw new Error("BREVO_FROM_EMAIL is not set.");
  }

  return { email: senderEmail, name: senderName };
};

export const sendMagicLinkEmail = async ({
  email,
  url,
  host,
}: MagicLinkPayload) => {
  const apiInstance = getBrevoClient();
  const sender = getBrevoSender();

  const emailMessage = new brevo.SendSmtpEmail();
  emailMessage.subject = `Your sign-in link for ${host}`;
  emailMessage.sender = sender;
  emailMessage.to = [{ email }];
  emailMessage.htmlContent = `
    <div style="font-family:Arial,sans-serif;">
      <h2>Sign in to Prime State Health</h2>
      <p>Use the button below to securely access your account.</p>
      <p>
        <a href="${url}" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#165f63;color:#fff;text-decoration:none;">
          Sign in
        </a>
      </p>
      <p style="color:#6b7280;">If you did not request this email, you can safely ignore it.</p>
    </div>
  `;
  emailMessage.textContent = `Sign in to Prime State Health\n\nUse this link to sign in:\n${url}\n\nIf you did not request this email, you can ignore it.`;

  await apiInstance.sendTransacEmail(emailMessage);
  return { sent: true };
};

export const sendFollowUpEmail = async ({
  email,
  score,
  testId,
}: FollowUpPayload) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_FROM_EMAIL;
  if (!apiKey || !senderEmail) {
    return { skipped: true };
  }

  const apiInstance = getBrevoClient();
  const sender = getBrevoSender();

  const appUrl = process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? "";
  const emailMessage = new brevo.SendSmtpEmail();
  emailMessage.subject = "Your Prime State Health cognitive results";
  emailMessage.sender = sender;
  emailMessage.to = [{ email }];
  emailMessage.htmlContent = `
    <div style="font-family:Arial,sans-serif;">
      <h2>Your cognitive baseline is ready</h2>
      <p>Your score: <strong>${score}</strong></p>
      <p>Review your full report here:</p>
      <p><a href="${appUrl}/results/${testId}">View results</a></p>
    </div>
  `;

  await apiInstance.sendTransacEmail(emailMessage);
  return { sent: true };
};
