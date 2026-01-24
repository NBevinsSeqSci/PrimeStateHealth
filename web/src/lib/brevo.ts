import * as brevo from "@getbrevo/brevo";

type FollowUpPayload = {
  email: string;
  score: number;
  testId: string;
};

export const sendFollowUpEmail = async ({
  email,
  score,
  testId,
}: FollowUpPayload) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_FROM_EMAIL;
  const senderName = process.env.BREVO_FROM_NAME ?? "Prime State Health";

  if (!apiKey || !senderEmail) {
    return { skipped: true };
  }

  const apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    apiKey
  );

  const appUrl = process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? "";
  const emailMessage = new brevo.SendSmtpEmail();
  emailMessage.subject = "Your Prime State Health cognitive results";
  emailMessage.sender = { email: senderEmail, name: senderName };
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
