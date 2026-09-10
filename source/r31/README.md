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


## r21 optimized concept-art primary gauges

The six primary dashboard gauges retain the r20 concept-art layout, symbols, live bindings, status strips and responsive profiles, but their runtime work is substantially reduced:

- `concept_radial_gauges.js` keeps one reusable SVG component for RPM, Boost, AFR Gas Scale, Coolant, Oil Pressure and Fuel Level;
- 224 individually animated zone segments are replaced by 20 static gauge-zone paths;
- the secondary moving inner active arc is removed;
- runtime updates move only one pointer group per gauge, and unchanged pointer angles do not write to the DOM;
- SVG blur, glow, drop-shadow, transition and decorative gauge-gradient effects are removed;
- six dedicated `p-*` concept symbols, numeric ranges, zone boundaries, the dashboard grid and all non-Dashboard pages remain unchanged.

See `R21_RADIAL_PERFORMANCE_OPTIMIZATION.md`.

## r26 navigation, phone and Tables polish

The r26 pass retains page workspaces, limits live refresh to the active page, uses compositor-backed transitions where available, classifies swipe intent instead of relying on broad exclusion zones, removes phone-only panel hide/focus controls, restores complete phone Settings content, applies bundled TunerStudio menu ordering, makes table comparison live, fixes title chrome, and adds independent reversed 3D X/Y defaults. See `R26_POLISH_IMPLEMENTATION.md`.




## r31 persistent formats and table rendering corrections

The r31 pass keeps the selected temperature, pressure, speed, mixture and precision presentation active while live data is unavailable, raises sticky RPM/MAP table headers above the live-cell trail, and prevents non-default themes from replacing the 2D table heat map. See `R31_TABLE_STATE_IMPLEMENTATION.md`.

## r30 signal-state, Tables controls and gauge balance

The r30 pass adds dedicated left/right Tables fold controls, keeps 2D pinch zoom centred beneath the users fingers, preserves the DEMO-active visual state in every theme, and introduces an explicit no-signal state. When neither DEMO nor current ECU/MSL data is available, stale values clear to a dash, radial pointers return to minimum, and crank/cam animation pauses. It also reduces the middle values in the five small radial gauges and enlarges the RPM gauges IAC/TPS metadata. See `R30_SIGNAL_TABLE_GAUGE_IMPLEMENTATION.md`.

## r29 themes, gauge formatting, Logging and fullscreen 3D controls

The r29 pass expands the existing theme mechanism into five broad colour treatments while preserving the same layout and theme-selection flow. It restores every major RPM label through 9, propagates temperature, pressure, speed, mixture and precision preferences through radial and non-radial displays, and adds gauge-specific min/max and precision controls to every Dashboard gauge. Logging receives matching left/right/bottom fold handles and a complete marker workspace. Fullscreen Tables input is isolated from app navigation, and the View Cube uses stable six-face controls plus direct drag rotation. See `R29_THEME_GAUGE_LOGGING_3D_IMPLEMENTATION.md`.

## r28 touch, gauge and preset corrections

The r28 pass separates one-finger table range selection from two-finger pinch zoom, restores adaptive gauge scale labels, and replaces gauge long-press text selection with a gauge-specific local limit editor. Logging custom presets now use the same opaque button geometry as defaults; tap loads a preset and long-press opens its editable name/channel dialog. See `R28_TOUCH_GAUGE_PRESET_IMPLEMENTATION.md`.

## r27 interaction, layout and fault-display pass

The r27 pass fixes clipped Tables cards, adds touch-first cell/range selection with Android haptic feedback, contains fullscreen 3D modal hit testing, removes the obsolete lower-footer allocation, and makes every tablet panel state reflow correctly. Logging now restores graph-limit feedback and provides three default plus three editable custom presets. Dashboard gauge limits are locally adjustable and gauges suppress context menus. Ignition and injection status displays follow the configured 1–12 cylinder count and render global or per-cylinder fault data without inventing unsupported cylinder attribution. See `R27_INTERACTION_LAYOUT_IMPLEMENTATION.md`.

## Current page set

The compact top header provides Dashboard, Tuning, Tables, Logging, Diagnostics, Settings, Demo, and More. The former Map Editor page remains removed because its useful functions belong in Tables.

## Tables workspace

The Tables workspace uses the conventional default orientation with low Y/MAP values at the bottom and high values at the top, with independent X/Y display reversal. The editable 2D table is the only surface with a bounded live trace. The right-side 3D preview opens the expanded CAD-style view but does not duplicate trace rendering. The central 3D tab/view has been removed.

The whole lower workspace panel now has a centered hide handle and a dedicated reveal rail that does not overlap table-edit controls. The small 3D header describes its adjacent fold control, while the viewport itself remains the expand target.

## Logging workspace

The Logging page provides a functional local/read-only logging base with twenty runtime channels, eight visible graphs, presets, shared cursor, drag selection, markers, recording controls and collapsible panels. Playback now follows real sample timestamps and updates the shared cursor through jump, step, play/pause, seek and speed controls.

MSL-style and CSV exports include numeric `MarkerCode` and `MarkerIndex` channels. `MarkerCode` uses `0=None`, `1=Note`, `2=Event`, and `3=Checkpoint`. This preserves marker locations as graphable fields without requiring proprietary marker metadata.

## r16 Settings and digital-trigger pass

- Crank and cam now render as animated digital square waves with explicit low/high states.
- The 60−2 crank visualization contains the two-tooth low-state gap and updates continuously in Crank, Cam, and Combo views.
- All editable Settings controls now apply their intended local/app-side behavior immediately and persist across launches.
- Functional settings include connection/reconnect requests, display/navigation, Dashboard/Demo behavior, unit conversion, Tables defaults, Logging limits/export behavior, warning thresholds, Diagnostics presentation, backup/restore, and resets.
- ECU-writing settings and commands remain intentionally unavailable.
- Settings backups use bounded rolling local snapshots.

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


## r17 responsive profiles

See `R17_RESPONSIVE_IMPLEMENTATION.md` for the isolated tablet-portrait and phone portrait/landscape implementation. Tablet landscape remains unchanged.

## r18 unified radial gauges

See `R18_RADIAL_GAUGE_IMPLEMENTATION.md`. The primary dashboard now uses one upper-half SVG radial-gauge family for RPM, Boost, AFR Gas Scale, Coolant, Oil Pressure, and Fuel Level. Arc endpoints align horizontally, each gauge keeps its own numeric range and tick spacing, and RPM is the larger hero variant.
