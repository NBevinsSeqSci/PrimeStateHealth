# Testing TODO

Automated unit or end-to-end tests are not yet configured for this project.

## Desired smoke tests

- Render the homepage and ensure the hero heading shows (“Integrate Cognitive Testing into Your Wellness Clinic”).
- Render the screener and verify the “Comprehensive Cognitive Screener” intro appears.
- Render the About page and verify the “About Prime State Health” heading.
- End-to-end tests that navigate through `/`, `/screener`, and `/about` to confirm routing still works after dependency or layout changes.

Set up Jest + React Testing Library (or Playwright/Cypress) to cover the scenarios above and wire it into `npm test` so it can run inside `npm run predeploy`.
