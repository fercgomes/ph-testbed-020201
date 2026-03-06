#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$SCRIPT_DIR/../app"

echo "==> PostHog Testbed — Deploy to Vercel"
echo ""

# Check vercel CLI
if ! command -v vercel &>/dev/null; then
  echo "ERROR: vercel CLI not found. Install with: npm i -g vercel"
  exit 1
fi

# Parse args
PROD=false
for arg in "$@"; do
  case $arg in
    --prod|-p) PROD=true ;;
    *) ;;
  esac
done

cd "$APP_DIR"

echo "==> Building..."
npm run build

echo ""
if [ "$PROD" = true ]; then
  echo "==> Deploying to PRODUCTION..."
  vercel --prod
else
  echo "==> Deploying preview (pass --prod for production)..."
  vercel
fi
