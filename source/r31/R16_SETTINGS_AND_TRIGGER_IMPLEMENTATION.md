# EpicDash UX r16 — Settings and trigger implementation

## Digital trigger visualization

Crank and cam are rendered as explicit low/high square waves. The crank display uses a 60−2 pattern with the missing teeth represented by an extended low interval. Crank, Cam, and Combo views animate using RPM and synchronization state so update activity is visible in Demo and live modes. This remains a derived visualization until raw tooth-event capture is supplied by the native bridge.

## Functional Settings coverage

All editable app settings perform their documented local action:

- Connection: startup auto-connect, requested read-only poll rate, reconnect enable and delay, reconnect action.
- Display/navigation: theme, accent, brightness, density, reduced motion, keep awake, swipe enable/sensitivity, Dashboard button visibility.
- Dashboard/Demo: animation enable, demo speed, warning popup, warning vibration, scenario menu.
- Units: temperature, pressure, speed, AFR Gas Scale/Lambda, voltage precision, raw diagnostic values.
- Tables: trace default, X/Y orientation, default zoom, broad-edit confirmation, workspace reset.
- Logging: sampling target, graph window, visible graph limit, ring-buffer duration, marker channels, warning markers, preferred export actions.
- Alerts: enable and all display-warning thresholds.
- Diagnostics: default trigger mode, trend duration, bottom-panel default, detail level, report actions.
- Storage: tune-draft autosave, rolling backup retention, snapshot/restore/export/import/reset actions.

No Settings control writes to the ECU, burns a tune, clears ECU faults, operates outputs, or changes ECU configuration.
