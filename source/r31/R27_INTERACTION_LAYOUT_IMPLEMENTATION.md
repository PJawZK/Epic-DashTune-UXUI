# EpicDash UX r27 interaction and layout implementation

## Identity and safety

- Package: `com.buttonbox.ble.ul`
- Version: `0.12.25-ux-polish27` (`1225`)
- Official `com.buttonbox.ble.jz` package remains separate and untouched.
- ECU-facing behavior remains strictly read-only.

## Tables

- Rebuilt the Table Operations and Live Data @ Selection card bodies as independently scrollable regions so their complete content remains reachable.
- Added touch-first selection: tap selects, long-press then drag selects a rectangular range, and double-tap focuses editing. Mouse drag remains available.
- Added app-side haptic calls for cell and range selection with a browser/device vibration fallback. Android system haptic settings can still suppress feedback globally.
- Contained fullscreen 3D modal pointer events and added a close guard so the X button cannot activate the More button beneath the modal.
- Retained live baseline/local-draft comparison and independent X/Y default orientation preferences.

## Layout and panel reflow

- Removed the stale third application-grid row left behind by the deleted lower live-data footer.
- Tables, Logging and Diagnostics now redraw/reflow after panel-state changes.
- Added authoritative tablet-portrait hidden-panel grid states so responsive rules no longer override panel collapse.
- Phone layouts continue to expose all content and do not offer redundant hide/focus controls.

## Diagnostics

- Increased crank waveform sample detail and reduced crank/cam stroke thickness while preserving square-wave edges and the 60−2 gap.

## Logging

- Restored a visible graph-limit prompt when an additional channel would exceed the configured simultaneous-graph limit.
- Added three fixed presets and three local custom presets. Custom preset names and channel sets are editable and persisted locally.

## Dashboard

- Added local settings for primary gauge scale limits and rebuilds gauges after limit changes.
- Suppressed the browser/WebView context menu on dashboard gauges.
- Replaced decorative firing/active indicators with ignition and injection health banks following the configured cylinder count, clamped to the EpicEFI-supported 1–12 range.
- The supplied firmware exposes global `ignitionFault` and `injectorFault` channels. A global fault therefore marks the complete bank red and explicitly reports that the cylinder was not identified. Optional future per-cylinder masks are supported; wasted-spark masks expand to the paired cylinder. No cylinder assignment is fabricated from a global bit.

## Validation

A self-contained Chromium regression completed 70/70 checks across tablet landscape, tablet portrait, phone portrait and phone landscape. Checks cover card reachability, modal isolation, haptic invocation, panel reflow, presets, graph-limit feedback, thin/detailed trigger traces, gauge settings, context-menu suppression, and 12-cylinder rendering. Physical Android interaction remains the final validation gate.
