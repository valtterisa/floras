#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/../.env"

if [ $# -ne 1 ]; then
  echo "Usage: $0 <new-site-name>" >&2 ; exit 1
fi
NAME="$1"

curl --header "PRIVATE-TOKEN:${GITLAB_TOKEN}" \
     --data   "name=${NAME}&path=${NAME}&template_project_id=${TEMPLATE_ID}" \
     "https://gitlab.com/api/v4/projects"
