# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 16 application. The integration includes client-side event tracking via the `instrumentation-client.ts` file (the recommended approach for Next.js 15.3+), server-side tracking using `posthog-node`, user identification on signup/login, exception capture for error tracking, and a reverse proxy configuration for improved tracking reliability.

## Events Implemented

| Event Name | Description | File(s) |
|------------|-------------|---------|
| `signup_started` | User starts the signup process | `web/src/components/site/SignUpForm.tsx` |
| `signup_completed` | User successfully creates an account | `web/src/components/site/SignUpForm.tsx`, `web/src/app/api/auth/signup/route.ts` |
| `signup_failed` | Signup attempt failed | `web/src/components/site/SignUpForm.tsx`, `web/src/app/api/auth/signup/route.ts` |
| `login_started` | User initiates the login process | `web/src/components/site/LoginForm.tsx` |
| `login_completed` | User successfully logs in | `web/src/components/site/LoginForm.tsx` |
| `login_failed` | Login attempt failed | `web/src/components/site/LoginForm.tsx` |
| `contact_form_submitted` | User submits the contact form | `web/src/app/contact/ContactForm.tsx` |
| `contact_form_failed` | Contact form submission failed | `web/src/app/contact/ContactForm.tsx` |
| `newsletter_subscribed` | User subscribes to the newsletter | `web/src/app/api/marketing/subscribe/route.ts` |
| `cognitive_test_started` | User starts a cognitive test | `web/src/components/tests/TestScaffold.tsx` |
| `cognitive_test_completed` | User completes a cognitive test | `web/src/components/tests/TestScaffold.tsx` |
| `test_result_saved` | Test result saved to database | `web/src/app/api/test-results/route.ts` |
| `demographics_submitted` | User completes onboarding demographics | `web/src/app/onboarding/demographics/page.tsx` |
| `terms_accepted` | User accepts terms of service | `web/src/app/api/auth/accept-terms/route.ts` |
| `result_viewed` | User views a test result page | `web/src/app/results/[id]/page.tsx` |

## Files Created/Modified

### New Files
- `web/instrumentation-client.ts` - Client-side PostHog initialization
- `web/src/lib/posthog-server.ts` - Server-side PostHog client

### Modified Files
- `web/.env.local` - Added PostHog environment variables
- `web/next.config.ts` - Added reverse proxy rewrites for PostHog
- `web/src/components/analytics/Analytics.tsx` - Removed duplicate initialization
- `web/src/components/site/SignUpForm.tsx` - Added signup tracking & user identification
- `web/src/components/site/LoginForm.tsx` - Added login tracking & user identification
- `web/src/app/contact/ContactForm.tsx` - Added contact form tracking
- `web/src/app/api/auth/signup/route.ts` - Added server-side signup tracking
- `web/src/app/api/auth/accept-terms/route.ts` - Added terms acceptance tracking
- `web/src/app/api/test-results/route.ts` - Added test result saved tracking
- `web/src/app/api/marketing/subscribe/route.ts` - Added newsletter subscription tracking
- `web/src/components/tests/TestScaffold.tsx` - Added cognitive test tracking
- `web/src/app/onboarding/demographics/page.tsx` - Added demographics tracking
- `web/src/app/results/[id]/page.tsx` - Added result view tracking

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- **Analytics basics**: [https://us.posthog.com/project/301674/dashboard/1170237](https://us.posthog.com/project/301674/dashboard/1170237)

### Insights
- **Signup to Test Completion Funnel**: [https://us.posthog.com/project/301674/insights/lDgHrhah](https://us.posthog.com/project/301674/insights/lDgHrhah)
- **Daily Active Users (Tests)**: [https://us.posthog.com/project/301674/insights/1cm0bqsv](https://us.posthog.com/project/301674/insights/1cm0bqsv)
- **Signup Methods Distribution**: [https://us.posthog.com/project/301674/insights/Ob3J6krj](https://us.posthog.com/project/301674/insights/Ob3J6krj)
- **Test Performance by Type**: [https://us.posthog.com/project/301674/insights/BkDyzTOw](https://us.posthog.com/project/301674/insights/BkDyzTOw)
- **Key Events Overview**: [https://us.posthog.com/project/301674/insights/g9W8kv8o](https://us.posthog.com/project/301674/insights/g9W8kv8o)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Configuration Details

### Environment Variables
The following environment variables have been added to `.env.local`:
```
NEXT_PUBLIC_POSTHOG_KEY=phc_O7r5mkTJX0DT1cGkOs6STYans1rPMrz0Sdp1hErEIfZ
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Reverse Proxy
A reverse proxy has been configured in `next.config.ts` to route PostHog requests through your domain, improving tracking reliability and reducing ad-blocker interference.
