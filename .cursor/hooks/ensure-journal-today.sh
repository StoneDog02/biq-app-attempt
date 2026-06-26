#!/bin/bash
# Creates today's Journal file if missing. Runs on sessionStart (fail open).

YEAR=$(date +%Y)
FILENAME=$(date +%m-%d-%Y).md
TITLE=$(date +%m/%d/%Y)
DIR="Journal/${YEAR}"
PATH="${DIR}/${FILENAME}"

mkdir -p "$DIR"

if [ ! -f "$PATH" ]; then
  printf '# %s\n' "$TITLE" > "$PATH"
fi

exit 0
