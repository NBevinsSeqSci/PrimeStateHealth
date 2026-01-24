# Prime State Health Architecture Audit

## Executive summary
- Frontend is a Vite + React SPA using Wouter for routing, React Query for data, and Tailwind UI components.
- Backend is Express with Drizzle ORM, zod validation for DB inserts, and a small REST API.
- Auth was client-only; now session-backed with HTTP-only cookies, a `/api/clinician/me` bootstrap, and rate-limited login to improve security and user flow.
- Data contracts are partially centralized (DB schemas in `shared/schema.ts`), but JSON payloads for reports/screeners lack canonical zod schemas.
- Metabolomics analyte metadata is centralized in `client/src/data/analytes.json` with validation scripts; internal catalog completeness vs the PDF reference is not automated.

## Phase 0 — Repo discovery
**Frameworks & entrypoints**
- Frontend: Vite + React (`client/src/main.tsx`, `client/src/App.tsx`)
- Router: Wouter (`client/src/App.tsx`)
- Data fetching: React Query + custom `apiClient` (`client/src/lib/apiClient.ts`)
- Backend: Express (`server/app.ts`, `server/routes.ts`)
- ORM: Drizzle (`shared/schema.ts`, `server/storage.ts`)
- Validation: zod via `drizzle-zod` for DB inserts (`shared/schema.ts`)
- Styling: Tailwind + Radix UI

### Route map
**Public / marketing**
- `/`
- `/how-it-works`
- `/for-patients`
- `/solutions/cognitive-testing`
- `/solutions/clinic-integration`
- `/blood-testing`
- `/blood-testing/metabolomics`
- `/blood-testing/metabolomics/example`
- `/blood-testing/waitlist`
- `/clinic-demo`
- `/sample-report`
- `/screener`
- `/full-assessment`
- `/about`
- `/terms-of-use`
- `/contact`

**Auth**
- `/clinic/login`

**App / protected**
- `/dashboard`
- `/dashboard/report/:id`

### Layouts & shells
- Public shell: `Navbar` + `CookieConsent` + `DisclaimerBar` in `client/src/App.tsx`
- App shell: bespoke dashboard layout in `client/src/pages/Dashboard.tsx`
- Report view: standalone full-screen layout in `client/src/pages/ClinicReport.tsx`

### API endpoints & consumers
- `POST /api/clinician/login` → `client/src/pages/ClinicLogin.tsx`
- `POST /api/clinician/logout` → `client/src/context/AuthContext.tsx`
- `GET /api/clinician/me` → `client/src/context/AuthContext.tsx`
- `POST /api/clinician/register` (seed-only)
- `POST /api/patient/assessment` → `client/src/pages/Screener.tsx`, `client/src/pages/FullAssessment.tsx`
- `GET /api/clinic/:clinicId/reports` → `client/src/pages/Dashboard.tsx`
- `GET /api/patient/report/:id` → `client/src/pages/ClinicReport.tsx`
- `GET /api/health`
- `POST /api/events/*` → `client/src/lib/events.ts`

### Core data models/types (source of truth)
- `Clinician`, `PatientReport`: `shared/schema.ts`
- `ScreenerSession`, `ScreenerScores`, `ScoreRecord`: `client/src/lib/cognitiveScoring.ts`
- `FullAssessmentReportData`: `client/src/components/report/FullAssessmentReportView.tsx`
- `AnalyteMetadata`: `client/src/types/analyte.ts`
- `PathwayDefinition`, `MetaboliteResult`: `client/src/lib/pathways/types`
- Analyte catalog: `client/src/data/analytes.json` + `client/src/lib/analytes/metadata.ts`

## Phase 1 — Page structure & navigation audit
### Route taxonomy & UX flow
- Naming is consistent (kebab-case, no camelCase routes). Wouter routing keeps a flat route table in `client/src/App.tsx`.
- Happy-path flows exist, but several pages lack explicit error/empty handling or auth-aware navigation (see table below).

### Layout consistency
- Public pages share `Navbar` and `DisclaimerBar` (hidden on dashboard + clinic login + sample report + example metabolomics report).
- Dashboard/report pages are standalone and do not share a central app layout component; header/sidebar is embedded in `Dashboard.tsx`.

### States & usability (top 10 pages)
| Page | Issue | Recommended fix |
| --- | --- | --- |
| `/dashboard` | No error state when API fails (now added). | Keep explicit error state on report fetches. |
| `/dashboard/report/:id` | Invalid IDs previously produced blank screen (now fixed). | Validate IDs + show error card. |
| `/clinic/login` | Demo login allowed without demo mode (now gated). | Require demo mode to use blank login. |
| `/screener` | Network failures from submission have limited recovery. | Add retry button + inline error copy for submission. |
| `/full-assessment` | Auth/login tab does not create real app session. | Align with clinician auth or separate patient account flow. |
| `/blood-testing/metabolomics/example` | Long, complex report is entirely client-rendered. | Add loading skeleton for heavy visual sections. |
| `/sample-report` | No clear CTA back into app flow. | Add explicit “Start screener” or “Book demo” CTA. |
| `/blood-testing` | No explicit empty state for waitlist integration. | Add confirmation or next-step CTA if waitlist submission exists. |
| `/clinic-demo` | CTA routes to login rather than scheduling system. | Align with actual demo workflow or external link. |
| `/contact` | No success/error states documented for submissions. | Add confirmation/error UI if form exists. |

## Phase 2 — Authentication audit
### Auth flow diagram
```
[Clinic Login Page]
   | POST /api/clinician/login
   v
[Express Session -> nv_session cookie]
   | GET /api/clinician/me (bootstrap)
   v
[RequireAuth guard]
   | GET /api/clinic/:clinicId/reports
   | GET /api/patient/report/:id
```

### Findings
- Auth is now session-based with HTTP-only cookies, rate-limited login, and a `/api/clinician/me` bootstrap.
- Session store uses `memorystore`; production should move to a persistent store.
- Session does not enforce clinic scoping on `/api/clinic/:clinicId/reports` (any logged-in clinician can request any clinic ID).
- `/api/clinician/register` is open and should be restricted or removed in production.

## Phase 3 — Data structures & consistency audit
### Canonical schemas & contract map
- DB schemas in `shared/schema.ts` are the single source of truth for clinician and report persistence.
- The JSON blobs (`demographics`, `medicalHistory`, `screenerScores`, `cognitiveScores`, `recommendations`, `metabolomics`, `metaboliteResults`) do not have shared zod schemas, which leads to implicit contracts between UI, API, and report rendering.

### Contract inconsistencies
- `PatientReport` JSON fields are typed as `any` or `Record<string, any>` in UI code.
- `visitType` values are inferred ad-hoc in UI; no shared enum/schema.
- Metabolomics analyte metadata is centralized, but cross-check against the canonical PDF reference is manual.

### Metabolomics analyte integrity checks
- Canonical list: `client/src/data/analytes.json`.
- Validation script: `scripts/validate-analytes.mjs` (now also ensures context ranges carry units if defined).
- PDF reference (`Comprehensive_metabolomics.pdf`) was not found in the repo; list completeness should be verified against it outside of code.

### Data lifecycle (high-level)
- Screener/full assessment submissions → `/api/patient/assessment` → `patient_reports` table.
- Clinician dashboard/report uses `/api/clinic/:clinicId/reports` and `/api/patient/report/:id`.
- Analytics/events are logged via `/api/events/*`.

### Checklist for adding new analytes/endpoints
- Update `client/src/data/analytes.json` and run `npm run analytes:validate`.
- Ensure pathways are present in `client/src/data/pathwayRegistry`.
- Add zod schema for any new API payload, and export its TypeScript type.
- Ensure API responses follow a consistent `{ data, error }` or `{ success, ... }` shape.

## Priority list
| Priority | Issue | Effort | Impact |
| --- | --- | --- | --- |
| P0 | Session-backed auth + protected API access (implemented). | M | H |
| P0 | Auth-aware navbar + login gating (implemented). | S | M |
| P0 | Dashboard + report error states (implemented). | S | M |
| P1 | Add shared zod schemas for report JSON fields. | M | H |
| P1 | Enforce clinic scoping on report fetches. | M | H |
| P1 | Replace session store with persistent store in prod. | M | M |
| P2 | Introduce centralized app layout for `/dashboard` + `/dashboard/report/:id`. | M | M |
| P2 | Add route-level loading skeletons for heavy report pages. | S | M |
