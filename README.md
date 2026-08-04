# Epic DashTune UX/UI

> [!IMPORTANT]
> **This repository contains an experimental UX/UI test application. It is not the full EpicDash application and must not be treated as a production release.**
>
> Everything shown here is exploratory. A screen, control, workflow, feature, layout, data channel, or interaction appearing in this test app is **not permanent**, is **not a promise**, and does **not guarantee that it will or can be implemented in the full application**. Features may be changed, replaced, reduced, or removed as testing continues.

## Purpose

Epic DashTune UX/UI is a standalone layout and interaction laboratory used to explore possible user-interface directions for an EpicEFI-oriented dashboard and tuning companion.

The project is intended for:

- phone and tablet layout experiments;
- touch, swipe, zoom, table-selection, and panel-reflow testing;
- dashboard gauge and theme experiments;
- read-only tuning, table, logging, and diagnostics workflow prototypes;
- evaluating ideas before deciding whether they belong in another application.

It is not intended to define the final feature set or architecture of EpicDash.

## Current experimental baseline

- App label: `EpicDash UX`
- Application ID: `com.buttonbox.ble.ul`
- Current accepted test baseline: `0.12.29-ux-state-31`
- Version code: `1229`
- Official EpicDash JZ package remains separate: `com.buttonbox.ble.jz`

The two package identities are intentionally separate so the UX experiment can be installed alongside the official application.

## Safety boundary

The UX experiment is designed around a strict read-only ECU boundary. It must not provide:

- tune or table writes;
- burn commands;
- output control;
- virtual-input writes;
- fault clearing;
- ECU configuration changes.

Only one application should own the ECU USB connection at a time.

## Source provenance

The first working UX test APK was produced as an APK-level experiment rather than from a preserved dedicated native source repository. The recovered project therefore contains:

- an editable Android wrapper;
- the continuously developed HTML, CSS, and JavaScript UI;
- generated TunerStudio/INI/MSQ-derived catalogs;
- revision notes, validation evidence, and reference material.

The clean wrapper does **not** claim to reproduce the repackaged test APK's complete native USB, BLE, MSL, or diagnostics implementation exactly. Native bridge behavior that has not been reconstructed remains stubbed or read-only.

## Repository policy

- This repository tracks the experimental UX/UI source and its documented test state.
- Private signing keys and passwords must never be committed.
- Signed APKs are test artifacts, not production releases.
- A feature being present here does not imply acceptance into any other EpicDash project.
- Compatibility, completeness, and long-term support are not guaranteed.

## Status

The repository is being initialized from the accepted r31 UX/UI test state. Detailed implementation history, source, validation notes, and build instructions will be imported in the baseline source pull request.
