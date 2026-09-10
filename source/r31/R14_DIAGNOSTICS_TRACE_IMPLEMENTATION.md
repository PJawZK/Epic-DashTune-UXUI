# EpicDash UX r14 diagnostics and trace implementation

## Tables

- The 2D live trace now uses direct outline/filter styling on table input elements rather than pseudo-elements, which Android WebView does not reliably draw on replaced form controls.
- The current live cell pulses visibly; recent cells retain a bounded green trail.
- Trace remains 2D-only and follows Demo or live runtime values.

## Shared bottom-panel controls

- Tables retains its centered whole-panel hide handle and dedicated reveal rail.
- Logging now uses the same centered hide/reveal language for its complete lower workspace.
- Diagnostics uses the same control for its contextual lower panel.

## Diagnostics

- Trigger/Sync now provides Crank, Cam, and Combo views.
- Trigger waveforms animate from current RPM and sync state and show a moving scan line and timestamp.
- The visualization is explicitly identified as an RPM/sync-derived display, not a raw tooth-logger capture.
- Event history, trends, and test results are contextual rather than permanently displayed:
  - Faults: diagnostic event history.
  - Sensors: sensor trends.
  - Trigger/Sync: RPM, sync-error, and tooth-error trends.
  - Communications/CAN: communication event history.
  - Power & Grounds: display-check results.
  - ECU Info and Actuator Tests: no lower panel.

## Safety

All ECU interaction remains read-only. No tune writes, burns, fault clearing, actuator tests, output commands, or virtual-input writes are exposed.
