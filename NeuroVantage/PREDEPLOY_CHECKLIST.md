# Prime State Health Pre-Push Checklist

Run these commands locally before pushing to GitHub or pulling into Replit:

1. `npm run lint`
2. `npm run typecheck`
3. `npm run build`

_(Add `npm test` once unit tests are configured; see TESTING.md for TODOs.)_

Manual QA checklist:

- [ ] Screener: can load `/screener`, complete intro, details form, questionnaire, and at least one cognitive test, then see the report without errors.
- [ ] Full Test or Clinic Demo: can start, progress through all sections, and see the final report.
- [ ] JSON/PDF: “Print or Save PDF” and “Download JSON (debug)” buttons on the screener report do not throw errors in the console.
- [ ] Top navigation: “How it Works”, “Blood Testing”, “Clinic Demo”, “About”, and “Clinic Login” links all route correctly.
- [ ] Terms of Use: `/terms` (or TermsOfUse page) loads, and the consent checkbox on the screener points to it.
- [ ] Layout: no obvious breaks at ~1280px desktop width and at a narrow mobile-sized viewport.
