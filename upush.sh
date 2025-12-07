#!/usr/bin/env bash
# Automates git staging/commit/pull and optionally restarts pm2 html-expresses.
set -e

if [ "$#" -lt 1 ]; then
  printf 'Usage: %s "commit message"\n' "$0" >&2
  exit 1
fi

msg=$1

printf 'Staging changes...\n'
git add -A

printf 'Committing with message: %s\n' "$msg"
git commit -m "$msg"

printf 'Pulling latest changes...\n'
git pull

printf 'Pushing branch to remote...\n'
git push

printf 'Restart pm2 process html-expresses? [y/N] (auto-skip in 5s): '
if read -r -t 5 answer; then
  case "$answer" in
    [yY]|[yY][eE][sS])
      pm2 start -f html-expresses
      ;;
    *)
      printf 'Skipping restart.\n'
      ;;
  esac
else
  printf '\nNo response in time. Skipping restart.\n'
fi
