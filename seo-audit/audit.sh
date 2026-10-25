#!/usr/bin/env bash
# Audits the built site (dist/) with OpenSEO's site-audit engine. Free: the audit needs no
# DataForSEO key. Fails on any critical or warning issue. Run after `npm run build`:
#   bash seo-audit/audit.sh
set -euo pipefail

# Bump deliberately: newer OpenSEO releases may add checks.
OPENSEO_SHA=0ca244b0dffef46820faa3fdcac21d7f9f76c088
SITE=https://vikaspal.is-a.dev
PORT=4173
HERE="$(cd "$(dirname "$0")" && pwd)"
WORK="${RUNNER_TEMP:-${TMPDIR:-/tmp}}/openseo-audit"
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0

rm -rf "$WORK" && mkdir -p "$WORK"

# Point the build's canonical, sitemap and robots URLs at the local server, then serve it.
cp -r "$HERE/../dist" "$WORK/site"
grep -rlI "$SITE" "$WORK/site" | xargs sed -i "s#$SITE#http://localhost:$PORT#g"
node "$HERE/pages-server.mjs" "$WORK/site" "$PORT" &
SERVER=$!
trap 'kill $SERVER' EXIT

git -c advice.detachedHead=false clone --quiet --filter=blob:none --no-checkout https://github.com/every-app/open-seo "$WORK/open-seo"
git -C "$WORK/open-seo" checkout --quiet "$OPENSEO_SHA"
(cd "$WORK/open-seo" && corepack enable && pnpm install --frozen-lockfile --ignore-scripts --silent)
cp "$HERE/run.ts" "$WORK/open-seo/scripts/vikas-audit.ts"
(cd "$WORK/open-seo" && pnpm exec tsx scripts/vikas-audit.ts "http://localhost:$PORT")
