// Sentry — browser client. Inert unless NEXT_PUBLIC_SENTRY_DSN is set.
import * as Sentry from '@sentry/nextjs';

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
    tracesSampleRate: 0.1,
    // Session Replay intentionally not enabled (privacy + bundle size + quota).
    enabled: process.env.NODE_ENV === 'production',
  });
}

// Instruments App Router client-side navigations.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
