#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/../.env"

if [ $# -ne 2 ]; then
  echo "Usage: $0 <site-name> <fully-qualified-domain>" >&2 ; exit 1
fi
NAME="$1"; DOMAIN="$2"

curl -X POST \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${NAME}/domains" \
  --data '{"domain":"'"${DOMAIN}"'"}'
