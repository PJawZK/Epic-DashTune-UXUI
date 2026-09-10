# r29 theme, gauge, Logging and fullscreen 3D implementation

## Scope

This pass preserves package `com.buttonbox.ble.ul`, the retained r8+ signing identity, side-by-side installation with `com.buttonbox.ble.jz`, and the strictly read-only ECU boundary.

## Logging workspace

- The marker card reserves enough height for all four actions and scrolls only when a smaller viewport genuinely requires it.
- Left and right panel controls use the same fold-handle language as the bottom panel control.
- Each handle is aligned with the panel it controls and triggers the same grid reflow/redraw path.
- Phone profiles keep all content exposed and suppress the redundant fold handles.

## Themes

The established theme storage and selection path remains authoritative. Five selectable colour treatments are provided:

- Default (`dark`)
- OLED (`oled`)
- Steel (`darker`, retaining the prior identifier)
- Arctic (`arctic`)
- Amber (`amber`)

Theme changes now cover page surfaces, cards, panels, borders, controls, inputs, modals and secondary text rather than altering only a small accent subset. Structure, behavior and telemetry remain unchanged.

## Dashboard gauges and formatting

- RPM shows every major thousand-rpm label from 0 through 9.
- All radial, secondary and compact Dashboard gauges participate in the long-press display-options system.
- The gauge-specific popup supports canonical minimum/maximum limits and an optional 0–3 decimal precision override.
- Leaving precision at **Use global** follows the app-wide Precision preference.
- Global unit/format choices propagate to relevant radial and non-radial values and scale labels for temperature, pressure, vehicle speed and mixture display.
- The former voltage-only precision preference is retained for migration but presented as a general Precision preference.
- Gauge text selection, dragging and browser context menus remain suppressed.

## Fullscreen Tables interaction

- The fullscreen 3D modal owns its pointer stream before global page navigation can react.
- Tapping or dragging inside the modal no longer causes app chrome/page-navigation behavior.
- The View Cube no longer depends on hit-testing transformed 3D faces. It provides stable Front, Back, Left, Right, Top and Bottom controls.
- Direct drag on the cube adjusts pitch/yaw while preserving the main 3D surface gesture path.

## Validation boundary

Self-contained Chromium tests cover tablet landscape and phone portrait, including unit propagation, per-gauge precision isolation, marker fit, panel reflow, five distinct themes, RPM labels, modal ownership and View Cube presets. Physical Android WebView touch timing and system-bar behavior remain the final validation gate.
