import "./mocks";
import { describe, it, expect, beforeEach } from "vitest";
import { prismaMock, sendEventNotificationEmailMock } from "./mocks";
import { trackEventHandler } from "../routes/events";

const createMockRes = () => {
  return {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
};

describe("POST /api/events/track", () => {
  beforeEach(() => {
    prismaMock.appEvent.create.mockReset();
    sendEventNotificationEmailMock.mockClear();
  });

  it("stores event and sends email", async () => {
    prismaMock.appEvent.create.mockResolvedValue({
      id: "evt-1",
      type: "REPORT_DOWNLOADED",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      clinicPublicId: "demo-clinic",
      submissionId: null,
      reportId: "rpt-123",
      userEmail: "a@b.com",
      userName: "Test User",
      ip: "127.0.0.1",
      userAgent: "ua",
      referer: "ref",
      path: "/report",
      metaJson: { reportKind: "cognitive" },
    });

    const req = {
      body: {
        type: "REPORT_DOWNLOADED",
        clinicPublicId: "demo-clinic",
        reportId: "rpt-123",
        userEmail: "a@b.com",
        userName: "Test User",
        path: "/report",
        meta: { reportKind: "cognitive" },
      },
      ip: "127.0.0.1",
      path: "/api/events/track",
      get: (header: string) => {
        if (header.toLowerCase() === "user-agent") return "ua";
        if (header.toLowerCase() === "referer") return "ref";
        return undefined;
      },
    };
    const res = createMockRes();

    await trackEventHandler(req as any, res as any);

    expect(res.statusCode).toBe(200);
    expect((res.body as { ok?: boolean }).ok).toBe(true);
    expect(prismaMock.appEvent.create).toHaveBeenCalledTimes(1);
    expect(sendEventNotificationEmailMock).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid event type", async () => {
    const req = {
      body: { type: "NOT_A_REAL_EVENT" },
      ip: "127.0.0.1",
      path: "/api/events/track",
      get: () => undefined,
    };
    const res = createMockRes();

    await trackEventHandler(req as any, res as any);

    expect(res.statusCode).toBe(400);
  });
});
