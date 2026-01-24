import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import MemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { pool } from "./db";
import { mailerStatus } from "./lib/mailer";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function createApp() {
  const app = express();
  const httpServer = createServer(app);
  const isProduction = process.env.NODE_ENV === "production";
  const sessionSecret = process.env.SESSION_SECRET || "neurovantage-dev-session-secret";

  if (isProduction) {
    app.use(helmet());
  } else {
    app.use(
      helmet({
        contentSecurityPolicy: false,
      }),
    );
  }
  app.use(cors({ origin: true, credentials: true }));

  const mailer = mailerStatus();
  console.log(
    `[config] mailer mode: ${mailer.mode} (${mailer.enabled ? "enabled" : "disabled"}${
      mailer.reason ? `; ${mailer.reason}` : ""
    })`
  );

  const SessionStore = MemoryStore(session);
  const PgSessionStore = connectPgSimple(session);
  const sessionStore =
    isProduction && pool
      ? new PgSessionStore({
          pool,
          createTableIfMissing: true,
        })
      : new SessionStore({
          checkPeriod: 1000 * 60 * 60 * 4,
        });
  app.use(
    session({
      name: "nv_session",
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
        maxAge: 1000 * 60 * 60 * 12,
      },
      store: sessionStore,
    }),
  );

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;
    const shouldLogBody = !isProduction;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      if (shouldLogBody) {
        capturedJsonResponse = bodyJson;
      }
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        log(logLine);
      }
    });

    next();
  });

  await registerRoutes(httpServer, app);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    if (process.env.NODE_ENV !== "test") {
      console.error("[error]", err);
    }
  });

  return { app, httpServer };
}
