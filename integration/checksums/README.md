# Checksum and provenance manifests

These manifests keep Stage A provenance separate from the immutable `source/r31/` evidence tree.

- `historical-full-source-manifest.sha256` is an exact retained alias/copy of the historical `source/r31/SOURCE_FILE_SHA256SUMS.txt`; the original remains untouched.
- `r31-apk-assets.sha256` records the accepted r31 APK identity and SHA-256 values for r31 assets copied into the integration package.
- `integration-source.sha256` records Stage A authored-file SHA-256 values. Exact r31 blob copies are listed separately in `r31-copy-provenance.json` so they can be verified against their source paths and Git blob IDs without pretending the historical manifest describes only the lean imported tree.

`r31-source-archive.sha256` is intentionally not emitted in this commit because this Stage A verification path did not read the binary archive bytes. Do not substitute the Git blob ID for a SHA-256 checksum. The preserved archive remains at `source/r31/EpicDash-UX-Source-r31-lean.tar.xz` and its Git blob identity remains unchanged.
