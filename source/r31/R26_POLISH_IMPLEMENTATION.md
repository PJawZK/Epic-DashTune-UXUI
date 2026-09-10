# EpicDash UX r26 — navigation, phone workflow and table polish

Version: `0.12.24-ux-polish26` (`1224`)

## Scope

This revision starts from the accepted corrected r25 native APK and keeps package `com.buttonbox.ble.ul`, the retained r8+ experimental signing identity, all six native DEX files and the strict read-only ECU boundary unchanged.

## Navigation and swipe ownership

- Panel workspaces are retained after first construction instead of being destroyed and rebuilt on every page change.
- Inactive workspaces are not refreshed at runtime telemetry frequency; only the currently displayed page receives its page-specific refresh.
- Page shells are pre-created during browser idle time to reduce first-navigation parsing work.
- Supported Android WebViews use same-document View Transition snapshots for the committed page change, avoiding repainting an entire table or graph DOM during the animation.
- Gesture ownership is based on intent rather than broad dead zones:
  - vertical movement belongs to page/content scrolling;
  - controls keep taps and local manipulation;
  - a horizontally scrollable child consumes motion only while it can scroll in that direction;
  - slow direct manipulation stays with graphs, table surfaces and editors;
  - a deliberate, fast, horizontally dominant flick changes page, including over direct-manipulation surfaces.

## Phone workflow

- Hide, reveal, focus and lower-panel fold controls are removed in both phone profiles.
- Phone workspaces normalize all panels to visible and ignore retained tablet hide/focus state.
- Settings uses natural document flow on phone so every category and row available on tablet remains reachable.
- Diagnostics and Settings navigation symbols have phone-specific envelopes and scale.
- The long `FAULT CODES & DISPLAY CONDITIONS` title wraps within a taller phone header instead of overflowing.

## Tuning order

`tunerstudio_order.js` is generated from the bundled Mega144H7 `mainController.ini` Menu/UserDefined structure. The Tuning page now presents mapped settings in TunerStudio menu, dialog and field order. Unmapped firmware constants remain available after the mapped structure under `Other / Unmapped` / firmware fallback groups.

The bundled authority maps 4,288 of the 5,960 catalog settings. A different active TunerStudio project may contain project-specific menu overrides; those can be incorporated from additional project files later.

## Tables

- `MAP INFORMATION`, table operations and lower-card title chrome remain fixed while their bodies scroll.
- `BASELINE ↔ LOCAL DRAFT COMPARISON` is generated from the selected table’s `CurrentTune.msq` baseline and current local-draft array.
- A local edit updates changed-cell count, minimum/maximum delta, average absolute delta, maximum absolute delta and the baseline/draft chart immediately.
- Default 3D orientation reverses both pitch and yaw relative to r25.
- `Reverse default X rotation` and `Reverse default Y rotation` are independent Settings controls. They affect initial/reset orientation only; table data and named view presets are unchanged.

## Validation

Automated browser regression covered tablet landscape, tablet portrait, phone portrait and phone landscape. It verified page construction without JavaScript errors, complete phone Settings categories, hidden phone panel controls, fixed table title chrome, live comparison after a cell edit, phone symbol sizing and responsive diagnostics title treatment.

Focused interaction checks verified that a fast horizontal flick over the 3D direct-manipulation surface changes page, while independent X/Y Settings toggles produce all four default-orientation combinations.
