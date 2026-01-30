# PostHog Post-Wizard Report

The wizard has completed a deep integration of your Next.js App Router project. This project already had a solid PostHog foundation with client-side initialization via `instrumentation-client.ts`, server-side tracking via `posthog-server.ts`, and reverse proxy configuration in `next.config.ts`. The wizard added additional event tracking for user engagement, check-ins, and dashboard interactions to provide more comprehensive analytics coverage.

## Events Summary

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `quick_checkin_submitted` | Tracks when a user successfully submits a daily check-in with mood, anxiety, focus, and other ratings | `src/components/QuickCheckIn.tsx` |
| `quick_checkin_failed` | Tracks when a quick check-in submission fails | `src/components/QuickCheckIn.tsx` |
| `dashboard_viewed` | Tracks when an authenticated user views their dashboard | `src/app/dashboard/page.tsx` |
| `cognitive_test_selected` | Tracks when a user clicks to start a specific cognitive test from the dashboard | `src/app/dashboard/page.tsx` |
| `user_logged_out` | Tracks when a user explicitly logs out (with PostHog reset) | `src/components/auth/AuthNav.tsx` |
| `terms_accepted` | Tracks when a user accepts the terms of service | `src/app/terms/accept/page.tsx` |

### Pre-existing Events (Already Implemented)

The project already had comprehensive tracking for:
- `signup_started`, `signup_completed`, `signup_failed` - User registration flow
- `login_started`, `login_completed`, `login_failed` - User authentication
- `user_logged_in`, `user_logged_out` - Session tracking
- `cognitive_test_started`, `cognitive_test_completed` - Test lifecycle
- `test_result_saved` - Server-side test result persistence
- `demographics_submitted` - User profile completion
- `contact_form_submitted`, `contact_form_failed` - Contact form tracking
- Server-side events for signup, marketing subscriptions, and terms acceptance

## Next Steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- **Analytics basics**: [https://us.posthog.com/project/301674/dashboard/1170731](https://us.posthog.com/project/301674/dashboard/1170731)

### Insights
- **Signup to Test Completion Funnel**: [https://us.posthog.com/project/301674/insights/A2tWnHCA](https://us.posthog.com/project/301674/insights/A2tWnHCA)
- **Daily Active Users (Login + Dashboard)**: [https://us.posthog.com/project/301674/insights/0MoXk7qI](https://us.posthog.com/project/301674/insights/0MoXk7qI)
- **Cognitive Tests by Type**: [https://us.posthog.com/project/301674/insights/sH2FBEhm](https://us.posthog.com/project/301674/insights/sH2FBEhm)
- **Daily Check-ins**: [https://us.posthog.com/project/301674/insights/6EUA0rSJ](https://us.posthog.com/project/301674/insights/6EUA0rSJ)
- **User Retention (Login Activity)**: [https://us.posthog.com/project/301674/insights/YFZl9Oe2](https://us.posthog.com/project/301674/insights/YFZl9Oe2)

### Agent Skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog with Next.js App Router applications.

## Configuration Details

- **PostHog API Key**: Set via `NEXT_PUBLIC_POSTHOG_KEY` environment variable
- **PostHog Host**: Set via `NEXT_PUBLIC_POSTHOG_HOST` environment variable
- **Reverse Proxy**: Configured in `next.config.ts` to route `/ingest/*` to PostHog servers
- **Error Tracking**: Enabled via `capture_exceptions: true` in client initialization
