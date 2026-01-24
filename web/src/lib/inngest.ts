import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "prime-state-health",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
