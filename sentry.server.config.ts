// Sentry — server runtime (Node). Inert unless NEXT_PUBLIC_SENTRY_DSN is set.
import * as Sentry from '@sentry/nextjs';

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: process.env.VERCEL_ENV || 'development',
    // Errors only for now; raise for performance tracing later.
    tracesSampleRate: 0.1,
    // Only send events from real production builds.
    enabled: process.env.NODE_ENV === 'production',
  });
}
