import "./mocks";
import { describe, it, expect, beforeEach } from "vitest";
import { prismaMock, sendEventNotificationEmailMock } from "./mocks";
import { handlePatientAssessment } from "../routes";

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

const basePayload = {
  clinicId: "demo-clinic",
  demographics: {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    visitType: "screener-questionnaire",
  },
  medicalHistory: {},
  screenerScores: {
    report: {
      scores: {
        depression: 2,
        attention: 1,
        reaction: 0.4,
        memory: 3,
        executive: 4,
      },
    },
  },
  cognitiveScores: {},
  recommendations: [],
  status: "Review",
};

describe("POST /api/patient/assessment", () => {
  beforeEach(() => {
    prismaMock.appEvent.create.mockReset();
    sendEventNotificationEmailMock.mockClear();
  });

  it("logs screener completion and sends email", async () => {
    prismaMock.appEvent.create.mockResolvedValue({
      id: "evt-1",
      type: "SCREENER_COMPLETED",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      clinicPublicId: "demo-clinic",
      submissionId: "sub-1",
      reportId: null,
      userEmail: "test@example.com",
      userName: "Test User",
      ip: "127.0.0.1",
      userAgent: "ua",
      referer: "ref",
      path: "/api/patient/assessment",
      metaJson: {},
    });

    const req = {
      body: basePayload,
      ip: "127.0.0.1",
      path: "/api/patient/assessment",
      get: () => undefined,
    };
    const res = createMockRes();

    await handlePatientAssessment(req as any, res as any);

    expect(res.statusCode).toBe(200);
    expect((res.body as { success?: boolean }).success).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(prismaMock.appEvent.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.appEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: "SCREENER_COMPLETED",
        }),
      })
    );
    expect(sendEventNotificationEmailMock).toHaveBeenCalledTimes(1);
  });

  it("logs full assessment completion and sends email", async () => {
    prismaMock.appEvent.create.mockResolvedValue({
      id: "evt-2",
      type: "FULL_TEST_COMPLETED",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      clinicPublicId: "demo-clinic",
      submissionId: "sub-2",
      reportId: null,
      userEmail: "test@example.com",
      userName: "Test User",
      ip: "127.0.0.1",
      userAgent: "ua",
      referer: "ref",
      path: "/api/patient/assessment",
      metaJson: {},
    });

    const req = {
      body: {
        ...basePayload,
        demographics: {
          ...basePayload.demographics,
          visitType: "full-assessment",
        },
      },
      ip: "127.0.0.1",
      path: "/api/patient/assessment",
      get: () => undefined,
    };
    const res = createMockRes();

    await handlePatientAssessment(req as any, res as any);

    expect(res.statusCode).toBe(200);
    expect((res.body as { success?: boolean }).success).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(prismaMock.appEvent.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.appEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: "FULL_TEST_COMPLETED",
        }),
      })
    );
    expect(sendEventNotificationEmailMock).toHaveBeenCalledTimes(1);
  });
});
