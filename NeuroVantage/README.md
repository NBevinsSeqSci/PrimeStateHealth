# Prime State Health

Prime State Health is a full‑stack TypeScript/Vite application with an Express + Drizzle backend and a React/Tailwind client that renders clinician‑facing metabolomics reports, pathway views, and diet heuristics.

## Repo structure

- `server/` – Express API, auth, storage, and Vite dev server bridge.
- `client/` – React + Tailwind UI (metabolomics report, pathways, diet evidence, etc.).
- `shared/` – Shared schema/types.
- `scripts/` – Node helper scripts (build, analyte enrichment + validation).
- `client/src/data/analytes.json` – Canonical analyte metadata (see below).

## Analyte metadata workflow

Analyte detail panels now read from a single source of truth defined in `client/src/data/analytes.json` and loaded via `client/src/lib/analytes/metadata.ts`. Each record contains identifiers, pathway IDs, and chemistry fields (CAS, PubChem CID, SMILES/InChIKey, formula, masses, plus an optional `/structures/<id>.png` image).

### Enrichment

1. Ensure you have Node 18+.
2. Run `npm run analytes:enrich` to resolve missing metadata from PubChem. The script:
   - Looks up each analyte name + synonyms via PubChem PUG REST.
   - Caches responses under `scripts/.cache/pubchem`.
   - Downloads structure images to `client/public/structures`.
   - Updates `client/src/data/analytes.json` with CAS, formula, weights, and identifiers.
   - Prints summary logs for unresolved CID/CAS/structure entries.
3. Pass `--refresh` to the script to ignore caches: `npm run analytes:enrich -- --refresh`.

### Validation

Run `npm run analytes:validate` to ensure:

- ids are unique and non-empty,
- every analyte has a display name,
- synonyms + pathways arrays are present,
- pathways are populated for all analytes.

CI or local checks should fail if metadata is incomplete.

### Manual fixes

If PubChem cannot resolve a compound (for example panel composites such as “Omega‑3 index”), leave CAS/structure fields null. The enrichment logs list unresolved IDs for manual review or future curation.

## Running locally

1. Install deps: `npm install`.
2. Start dev server: `npm run dev` (spins up Express + Vite client on the sandbox port).
3. Visit `http://127.0.0.1:<PORT>` from the previous step.

## Testing

- Type-check: `npm run typecheck`
- Lint client code: `npm run lint`

## Deploy on Replit

1. Create a new Replit project and import this repo.
2. Set environment variables in the Replit Secrets panel using `.env.example` as a guide.
3. Provision a Postgres instance and set `DATABASE_URL`.
4. Run install: `npm install`
5. Build: `npm run build`
6. Start (production): `npm run start`

Notes:
- Replit uses `PORT` from the environment; the server already binds to `0.0.0.0`.
- If `DATABASE_URL` is missing in production, the server will throw an error to prevent in-memory usage.
- Mailer is optional. Use `MAILER_MODE=disabled` to skip email sending, `MAILER_MODE=console` to log email payloads in dev, or `MAILER_MODE=smtp` with `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and optional `SMTP_FROM` to enable SMTP.
