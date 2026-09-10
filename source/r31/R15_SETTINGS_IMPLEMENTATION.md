# EpicDash UX r15 — Settings workspace

## Scope

- Standalone experimental package: `com.buttonbox.ble.ul`
- Official EpicDash-JZ package/repository untouched
- No ECU tune writes, burns, fault clearing, output controls or virtual-input writes

## Implemented

- Replaced the static Settings mockup with a functional local settings workspace.
- Nine searchable categories with persistent controls.
- Theme, accent, brightness, density, keep-awake, reduced motion and swipe settings.
- USB poll/reconnect preferences and read-only bridge tests.
- Dashboard/demo and warning-popup behavior.
- Units/presentation preferences with AFR Gas Scale as default.
- Tables defaults for trace, axes, zoom and workspace reset.
- Logging sample-rate, graph-window, marker/export and buffer preferences.
- Display-only warning thresholds used by the global acknowledgment popup.
- Diagnostics trigger-view and contextual-panel defaults.
- JSON settings export, complete EpicDash UX local backup/restore, storage report and bounded reset tools.
- Long-press selection suppression on interactive settings controls while preserving text editing.

## Trigger correction

The crank 60−2 visualization now renders a moving train of individual bipolar tooth pulses with the two-tooth gap, rather than square blocks separated by space. Cam remains a Hall-style pulse and Combo remains available.
