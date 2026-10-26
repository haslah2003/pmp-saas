#!/bin/sh
# Build used by Vercel (`npm run ci`): apply database migrations, then build.
# Preview deployments share the production database, so they never migrate it.
set -e
if [ "$VERCEL_ENV" != "preview" ]; then
  npx payload migrate
fi
npx next build
