#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(pwd)"
SOURCE_ARCHIVE="/tmp/Epic-DashTune-UX-Source-r32.tar.xz"
SOURCE_DIR="/tmp/Epic-DashTune-r32-source"
TAG="v0.12.30-ux-brand-32-preview"
APK_NAME="Epic-DashTune-UX-preview-r32.apk"
SOURCE_NAME="Epic-DashTune-UX-Source-r32.tar.xz"

cat bootstrap/r32-source.b64.part-* > /tmp/r32-source.b64
base64 --decode /tmp/r32-source.b64 > "$SOURCE_ARCHIVE"
echo "8a5a1bc7f23604e4cc8d9d1d91789b6cfef724c8b5bcd4c119fefdc28071db6e  $SOURCE_ARCHIVE" | sha256sum --check --strict

rm -rf "$SOURCE_DIR"
mkdir -p "$SOURCE_DIR"
tar -xJf "$SOURCE_ARCHIVE" -C "$SOURCE_DIR"
test -f "$SOURCE_DIR/app/build.gradle.kts"
test -f "$SOURCE_DIR/app/src/main/assets/dashboard_lab.html"
test -f "$SOURCE_DIR/app/src/main/assets/tune_catalog.js"
test -f "$SOURCE_DIR/app/src/main/assets/table_catalog.js"

cp README.md /tmp/Epic-DashTune-public-README.md
cp -a "$SOURCE_DIR"/. "$REPO_ROOT"/
cp /tmp/Epic-DashTune-public-README.md README.md

cat > R32_BRANDING_AND_PUBLIC_PREVIEW.md <<'EOF'
# r32 branding and public preview

Epic-DashTune is the public-facing project and application name.

This repository and APK are a standalone UX/UI test application. They are not the full Epic-DashTune application, not a production release, and not a promise that every experiment will or can be implemented. Features, layouts, themes, interactions, diagnostics, and workflows may be changed, replaced, reduced, or removed.

- Package: `com.buttonbox.ble.ul`
- Version: `0.12.30-ux-brand-32`
- Version code: `1230`
- ECU boundary: read-only
EOF

mkdir -p .github/workflows
cat > .github/workflows/build-preview.yml <<'EOF'
name: Build Epic-DashTune UX preview
on:
  pull_request:
  workflow_dispatch:
permissions:
  contents: read
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '17'
      - uses: android-actions/setup-android@v3
      - run: sdkmanager "platforms;android-34" "build-tools;34.0.0"
      - uses: gradle/actions/setup-gradle@v4
        with:
          gradle-version: '8.2.1'
      - run: gradle --no-daemon :app:assembleDebug
      - uses: actions/upload-artifact@v4
        with:
          name: Epic-DashTune-UX-preview
          path: app/build/outputs/apk/debug/app-debug.apk
EOF

rm -rf bootstrap
rm -f .github/workflows/reconstruct-and-release-r32.yml
rm -f .github/workflows/publish-r32.yml
rm -f scripts/publish-r32-release.sh

if grep -RIn --exclude-dir=.git --exclude='SOURCE_FILE_SHA256SUMS.txt' --include='*.md' --include='*.html' --include='*.xml' 'EpicDash' .; then
  echo "Legacy user-facing EpicDash name remains" >&2
  exit 1
fi

gradle --no-daemon :app:assembleDebug

mkdir -p /tmp/r32-release-assets
cp app/build/outputs/apk/debug/app-debug.apk "/tmp/r32-release-assets/$APK_NAME"
cp "$SOURCE_ARCHIVE" "/tmp/r32-release-assets/$SOURCE_NAME"
sha256sum "/tmp/r32-release-assets/$APK_NAME" > "/tmp/r32-release-assets/$APK_NAME.sha256"
sha256sum "/tmp/r32-release-assets/$SOURCE_NAME" > "/tmp/r32-release-assets/$SOURCE_NAME.sha256"

cat > /tmp/r32-release-notes.md <<'EOF'
## Epic-DashTune UX/UI experimental preview

This is a **standalone UX/UI test application**. It is not the full Epic-DashTune application and it is not a production release.

Nothing demonstrated here is permanent product scope or a promise that every experiment will or can be implemented. Features, layouts, themes, interactions, diagnostics, and workflows may change, be replaced, or be removed.

### Identity

- Package: `com.buttonbox.ble.ul`
- Version: `0.12.30-ux-brand-32`
- Version code: `1230`
- ECU boundary: read-only

### Installation

This public preview is debug-signed by GitHub Actions. Android may require uninstalling only `com.buttonbox.ble.ul` before installation if another experimental build uses a different signing certificate. Never uninstall or modify the separate `com.buttonbox.ble.jz` application.

### Scope limitation

This clean wrapper is intended for layout, interaction, and workflow testing. Native USB, BLE, MSL, and diagnostic behavior that has not been reconstructed remains stubbed or read-only.
EOF

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git add -A
git commit -m "Import Epic-DashTune r32 source and prepare public preview"
git push origin HEAD:main

if gh release view "$TAG" >/dev/null 2>&1; then
  gh release delete "$TAG" --yes --cleanup-tag
fi

gh release create "$TAG" \
  "/tmp/r32-release-assets/$APK_NAME" \
  "/tmp/r32-release-assets/$APK_NAME.sha256" \
  "/tmp/r32-release-assets/$SOURCE_NAME" \
  "/tmp/r32-release-assets/$SOURCE_NAME.sha256" \
  --target "$(git rev-parse HEAD)" \
  --title "Epic-DashTune UX/UI Preview r32" \
  --notes-file /tmp/r32-release-notes.md \
  --prerelease
