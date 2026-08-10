// Sentry — edge runtime (middleware). Inert unless NEXT_PUBLIC_SENTRY_DSN is set.
import * as Sentry from '@sentry/nextjs';

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: process.env.VERCEL_ENV || 'development',
    tracesSampleRate: 0.1,
    enabled: process.env.NODE_ENV === 'production',
  });
}
