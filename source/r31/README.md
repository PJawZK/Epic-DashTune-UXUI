# EpicDash UX — standalone exploratory source r31

This is the editable standalone source reconstruction for the unofficial EpicDash UX layout experiment.

## Identity and separation

- Application ID: `com.buttonbox.ble.ul`
- App label: `EpicDash UX`
- Candidate version: `0.12.29-ux-state-31` (`1229`)
- Official EpicDash JZ package: `com.buttonbox.ble.jz`
- No GitHub repository is accessed or modified by this experiment.
- App data remains separate from the official package.
- ECU interaction remains read-only.

## Source provenance

The first working UX APK was produced as an APK-level experiment rather than from a preserved dedicated Kotlin source tree. This archive therefore contains an honest clean Android wrapper plus the continuously developed HTML, CSS, JavaScript, INI/MSQ-derived catalogs, and project references. It does not claim to reconstruct the original native USB/BLE implementation exactly.

The principal editable UI assets are:

- `app/src/main/assets/dashboard_lab.html`
- `app/src/main/assets/tables_page.js`
- `app/src/main/assets/tables_page.css`
- `app/src/main/assets/logging_page.js`
- `app/src/main/assets/logging_page.css`
- `app/src/main/assets/diagnostics_page.js`
- `app/src/main/assets/diagnostics_page.css`
- `app/src/main/assets/settings_page.js`
- `app/src/main/assets/settings_page.css`
- `app/src/main/assets/tune_catalog.js`
- `app/src/main/assets/table_catalog.js`
- `app/src/main/assets/dashboard_runtime_snapshot.js`
- `app/src/main/assets/variables.json`

## r31 persistent formats and table rendering corrections

The r31 pass keeps the selected temperature, pressure, speed, mixture and precision presentation active while live data is unavailable, raises sticky RPM/MAP table headers above the live-cell trail, and prevents non-default themes from replacing the 2D table heat map. See `R31_TABLE_STATE_IMPLEMENTATION.md`.

## Current page set

The compact top header provides Dashboard, Tuning, Tables, Logging, Diagnostics, Settings, Demo, and More. The former Map Editor page remains removed because its useful functions belong in Tables.

## Existing functional tuning/table scope

The supplied Mega144H7 `mainController.ini` and `CurrentTune.msq` populate 5,960 tune settings and 123 table definitions. Local editing supports numeric, enum, boolean, text and array settings plus table selection, arithmetic, smoothing, interpolation, zoom, CSV text import/export, copy/paste, undo/redo, favorites and local comparison.

All changes remain in the EpicDash UX local draft. There are no tune writes, table writes, burn commands, output controls, or virtual-input writes.

## Clean source build

Requirements:

- Android SDK platform 34;
- Android build-tools 34.x;
- JDK 17;
- Gradle or Android Studio able to resolve Android Gradle Plugin 8.2.2 and Kotlin 1.8.20.

Open the folder in Android Studio and build the `app` module, or run:

```bash
./scripts/build.sh
```

The clean wrapper supplies the layout WebView, file selection, clipboard and diagnostic bridge stubs. It does not yet reproduce the repackaged APK native base's complete USB, BLE, MSL and diagnostic implementation.

## Installation and signing

A build can update an installed `com.buttonbox.ble.ul` only when both APKs use the same signing certificate. r16 continues the retained r8+ experimental certificate. Never uninstall, clear, or modify `com.buttonbox.ble.jz` while working on this experiment.
