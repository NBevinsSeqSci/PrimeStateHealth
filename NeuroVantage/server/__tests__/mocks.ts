import { vi } from "vitest";

export const prismaMock = {
  appEvent: {
    create: vi.fn(),
  },
};

vi.mock("../db/prisma", () => {
  return { prisma: prismaMock };
});

export const sendEventNotificationEmailMock = vi.fn().mockResolvedValue(undefined);

vi.mock("../lib/mailer", () => {
  return { sendEventNotificationEmail: sendEventNotificationEmailMock };
});
