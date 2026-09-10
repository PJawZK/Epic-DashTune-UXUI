# Epic-DashTune UX/UI

> [!IMPORTANT]
> **This repository contains an experimental UX/UI test application. It is not the full Epic-DashTune application and must not be treated as a production application.**
>
> Everything shown here is exploratory. A screen, control, workflow, feature, layout, data channel, or interaction appearing in this test app is **not permanent**, is **not a promise**, and does **not guarantee that it will or can be implemented in the full application**. Features may be changed, replaced, reduced, or removed as testing continues.

## Purpose

Epic-DashTune UX/UI is a standalone layout and interaction laboratory used to explore possible user-interface directions for an EpicEFI-oriented dashboard and tuning companion.

The project is intended for:

- phone and tablet layout experiments;
- touch, swipe, zoom, table-selection, and panel-reflow testing;
- dashboard gauge and theme experiments;
- read-only tuning, table, logging, and diagnostics workflow prototypes;
- evaluating ideas before deciding whether they belong in another application.

It is not intended to define the final feature set or architecture of Epic-DashTune.

## Accepted test release

The sole accepted APK baseline is **r31, unchanged**:

- Original APK filename: `EpicDash-UX-Layout-Lab-unofficial-r31.apk`
- On-device app label: `EpicDash UX`
- Application ID: `com.buttonbox.ble.ul`
- Version: `0.12.29-ux-state-31`
- Version code: `1229`
- APK SHA-256: `78d64936d21124b375914d14777c59d9be1e2cab4616fb82996aa363b715bd56`
- Signer certificate SHA-256: `cc09e34e407d8ff8416fbdf48f208bb5c58483af8fcd427201a6b59f588c6142`

The r31 APK is intentionally used **as built and tested**. Its internal app label, packaged assets, native code, signing identity and version metadata must not be renamed, patched, rebuilt or replaced for publication.

The separate full application package remains `com.buttonbox.ble.jz`. Do not uninstall or modify it when testing this UX application.

## About the discarded r32 attempt

`r32` was an internal failed branding/rebuild experiment created after r31. It was rejected because it changed the validated APK instead of preserving the accepted r31 native package. It is **not an accepted release, not a successor baseline, and should not be installed or distributed**.

Future work starts from accepted r31.

## GitHub release policy

Accepted test APKs are published as normal GitHub Releases, not as GitHub prereleases. The application is already clearly identified here and in the release notes as experimental UX/UI test software.

Using a normal release keeps the download visible on the repository front page and makes the accepted APK easy for testers to find. This does not change the experimental status, scope limitations, or lack of production guarantees.

## Source

The preserved r31 source tree is now imported under:

`source/r31/`

Direct browser link:

https://github.com/PJawZK/Epic-DashTune-UXUI/tree/main/source/r31

The repository also contains the compact preserved source archive:

`source/r31/EpicDash-UX-Source-r31-lean.tar.xz`

The imported tree was checked against the preserved r31 source at Git blob level: **70/70 files match exactly, with zero missing files and zero byte differences**.

### Important source provenance

The editable HTML/CSS/JavaScript and related packaged UX assets are the developed r31 source assets and were verified against the released APK where recorded by the r31 verification process.

However, the original working UX APK was produced through APK-level development using an already compiled native base. A complete original Kotlin/native source tree for that native layer was never preserved.

Therefore the Android project under `source/r31/` is an **honest clean source reconstruction/wrapper**, not a claim that rebuilding it will reproduce the released r31 APK byte-for-byte or reproduce all native behavior.

In particular, the clean wrapper does not fully reproduce the released APK's native USB, BLE, MSL and diagnostics bridge implementation. The unchanged released r31 APK remains authoritative for native behavior and public testing.

## Safety boundary

The UX experiment is designed around a strict read-only ECU boundary. It must not provide:

- tune or table writes;
- burn commands;
- output control;
- virtual-input writes;
- fault clearing;
- ECU configuration changes.

Only one application should own the ECU USB connection at a time.

## Repository policy

- `main` is the sole authoritative branch.
- This repository tracks experimental UX/UI work and its documented test state.
- Private signing keys, signing bundles and passwords must never be committed.
- A feature being present here does not imply acceptance into another Epic-DashTune project.
- Compatibility, completeness and long-term support are not guaranteed.
- Future APK revisions must begin from the accepted r31 native package and require device validation before replacing it.

## Installation

The accepted r31 APK retains the same signer used by the prior experimental revisions. Install it over an earlier compatible `com.buttonbox.ble.ul` build with Android's normal update installation.

Do not uninstall or modify `com.buttonbox.ble.jz`.
