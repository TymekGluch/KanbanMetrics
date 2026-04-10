#!/usr/bin/env bash

set -euo pipefail

if [[ -z "${POSTMAN_API_KEY:-}" ]]; then
  echo "postman-sync: POSTMAN_API_KEY not set, skipping"
  exit 0
fi

if [[ -z "${POSTMAN_COLLECTION_UID:-}" ]]; then
  echo "postman-sync: POSTMAN_COLLECTION_UID not set, skipping"
  exit 0
fi

if [[ ! "${POSTMAN_COLLECTION_UID}" =~ ^[a-zA-Z0-9_-]+-[a-zA-Z0-9_-]+$ ]]; then
  echo "postman-sync: invalid POSTMAN_COLLECTION_UID format"
  exit 1
fi

COLLECTION_FILE="${POSTMAN_COLLECTION_FILE:-postman/kanbanmetrics.postman_collection.json}"

if [[ ! -f "$COLLECTION_FILE" ]]; then
  echo "postman-sync: collection file not found: $COLLECTION_FILE"
  exit 1
fi

echo "postman-sync: uploading to Postman (uid: ${POSTMAN_COLLECTION_UID})..."

TMPFILE=$(mktemp --suffix=.json)
trap 'rm -f "$TMPFILE"' EXIT

printf '{"collection":' > "$TMPFILE"
cat "$COLLECTION_FILE" >> "$TMPFILE"
printf '}' >> "$TMPFILE"

RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X PUT \
  "https://api.getpostman.com/collections/${POSTMAN_COLLECTION_UID}" \
  -H "x-api-key: ${POSTMAN_API_KEY}" \
  -H "Content-Type: application/json" \
  --data-binary "@${TMPFILE}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [[ "$HTTP_CODE" != "200" ]]; then
  echo "postman-sync: failed (HTTP $HTTP_CODE): $BODY"
  exit 1
fi

echo "postman-sync: done"
