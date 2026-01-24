import { inngest } from "@/lib/inngest";
import { sendFollowUpEmail } from "@/lib/brevo";

export const followUpEmail = inngest.createFunction(
  { id: "follow-up-email" },
  { event: "assessment.completed" },
  async ({ event, step }) => {
    await step.run("send-follow-up-email", async () => {
      await sendFollowUpEmail({
        email: event.data.email,
        score: event.data.score,
        testId: event.data.testId,
      });
    });

    return { ok: true };
  }
);

export const inngestFunctions = [followUpEmail];
