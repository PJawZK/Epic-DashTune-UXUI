#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/.."
node tests/state-store.test.js
node tests/storage.test.js
node tests/render-boundary.test.js
find bridge web tests -name '*.js' -type f -exec node --check {} \;
echo 'integration tests: PASS'
