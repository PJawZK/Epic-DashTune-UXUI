# EpicDash UX r12 — Logging page implementation

## Runtime data and graph workspace

The page consumes the same read-only runtime state used by Dashboard and Tables. It exposes twenty graphable channels across Engine, Fuel, Ignition, Boost, Throttle, Sensors and Vehicle groups. AFR is labelled and displayed on AFR Gas Scale.

- Up to eight graph rows can be visible at once.
- Channel search and Default, Engine, Pull and Fuel presets are available.
- All visible channels share one time axis and cursor.
- Pointer drag creates a bounded time selection.
- Window length can be set to 10, 20, 30, 60 or 120 seconds.
- Demo scenarios feed the graphs through the normal runtime-state path.

## Markers

Note, Event and Checkpoint markers are timestamped annotations. They appear on the graphs and overview, can be selected, jumped to and deleted, and never alter ECU data.

Export encodes them as ordinary numeric channels:

- `MarkerCode`: `0=None`, `1=Note`, `2=Event`, `3=Checkpoint`;
- `MarkerIndex`: sequential marker number, otherwise `0`.

This lets external log viewers display marker positions as normal graphable fields even when they do not understand app-specific marker metadata.

## Playback

Playback controls are timestamp-aware:

- jump to start;
- step one sample backward;
- play/pause;
- step one sample forward;
- jump to end;
- seek slider;
- 0.25×–4× speed.

Playback updates the same shared cursor used by current values, graph crosshair and marker navigation.

## Export and import

- `COPY MSL` creates an MSL-style tab-delimited text log containing all channels plus marker channels.
- `COPY CSV` exports the same data as CSV.
- Local CSV import remains available for workflow testing.
- Native long-session file writing and full production MSL metadata remain future native-layer work.

## Bounds and safety

The current UX base keeps at most 3,600 samples in memory. It is intended for layout and workflow evaluation, not yet as a production logger. It reads and stores local runtime values only and contains no ECU write path.
