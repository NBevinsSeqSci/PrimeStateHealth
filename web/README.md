# Prime State Health (Next.js)

## Local setup
1. Copy `.env.example` to `.env.local` and fill in values.
2. Install deps: `npm install`
3. Generate Prisma client: `npm run prisma:generate`
4. Start dev server: `npm run dev`

## Database (Neon + Prisma)
- Use `DATABASE_URL` for runtime queries and `DIRECT_URL` for migrations.
- Run migrations locally: `npm run prisma:migrate`
- In production, run `prisma migrate deploy` during the build or via Vercel post-deploy.

## Authentication (NextAuth)
- Email magic links via Brevo SMTP (`EMAIL_SERVER`, `EMAIL_FROM`).
- Session data stored in Neon via Prisma adapter.

## Deployment (Vercel)
1. Set project root to `web/`.
2. Add the environment variables from `.env.example` in both Preview and Production.
   - `DATABASE_URL` and `DIRECT_URL` are required because migrations run during build.
   - Set `NEXTAUTH_URL` and `APP_URL` to the deployed domain.
3. Build command: `npm run vercel-build` (runs `prisma migrate deploy` then `next build`).
4. Output: `Next.js` (default).

## Monitoring + background jobs
- **UptimeRobot**: monitor `https://<domain>/api/health` for a JSON OK response.
- **Inngest**: point the Inngest app to `https://<domain>/api/inngest`.
- **Sentry**: set `SENTRY_DSN` to enable error monitoring.
