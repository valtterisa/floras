#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/../.env"

if [ $# -ne 1 ]; then
  echo "Usage: $0 <new-site-name>" >&2 ; exit 1
fi
NAME="$1"

curl -X POST \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects" \
  --data @- <<EOF
{
  "name": "${NAME}",
  "production_branch": "main",
  "build_config": {
    "build_command": "npm run build && npm run export",
    "destination_dir": "out"
  },
  "source": {
    "type": "gitlab",
    "config": {
      "owner": "${GROUP}",
      "repo_name": "${NAME}",
      "deployments_enabled": true
    }
  }
}
EOF
