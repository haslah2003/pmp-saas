/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

// Only engage the Sentry build plugin when a DSN is configured, so builds stay
// clean and plugin-free until Sentry is actually set up in the environment.
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  const { withSentryConfig } = require("@sentry/nextjs");
  module.exports = withSentryConfig(nextConfig, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: true,
    widenClientFileUpload: true,
    disableLogger: true,
    // Upload readable source maps only when an auth token is provided.
    sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
    // Route Sentry events through our own domain to dodge ad-blockers.
    tunnelRoute: "/monitoring",
    // Trim client bundle — we don't use Replay, and strip debug code.
    bundleSizeOptimizations: {
      excludeReplayShadowDom: true,
      excludeReplayIframe: true,
      excludeReplayWorker: true,
      excludeDebugStatements: true,
    },
  });
} else {
  module.exports = nextConfig;
}
