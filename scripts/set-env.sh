#!/usr/bin/env bash
# Push PostHog env vars to Vercel for all environments
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$SCRIPT_DIR/../app"
ENV_FILE="$APP_DIR/.env.local"

echo "==> PostHog Testbed — Sync env vars to Vercel"
echo ""

if ! command -v vercel &>/dev/null; then
  echo "ERROR: vercel CLI not found. Install with: npm i -g vercel"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found. Copy .env.local.example and fill in values."
  exit 1
fi

cd "$APP_DIR"

push_var() {
  local key="$1"
  local value="$2"
  echo "  Pushing $key..."
  # Push to production, preview, and development
  printf '%s' "$value" | vercel env add "$key" production --force 2>/dev/null || true
  printf '%s' "$value" | vercel env add "$key" preview --force 2>/dev/null || true
  printf '%s' "$value" | vercel env add "$key" development --force 2>/dev/null || true
}

# Read .env.local and push each var
while IFS='=' read -r key value; do
  # Skip comments and empty lines
  [[ -z "$key" || "$key" == \#* ]] && continue
  push_var "$key" "$value"
done < <(grep -v '^#' "$ENV_FILE" | grep -v '^$')

echo ""
echo "Done. Run 'vercel env ls' to verify."
