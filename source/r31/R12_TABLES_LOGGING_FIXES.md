# EpicDash UX r12 — Tables and Logging completion pass

Version: `0.12.10-ux-logfix` (`1210`)

## Tables workspace

- Reworded the small 3D panel header to `TAP TO HIDE PANEL` so it clearly describes the adjacent fold control.
- Kept `TAP TO EXPAND` inside the 3D viewport as the single expansion instruction.
- Removed the central `3D GRAPH` tab/view; the right preview and its expanded popup are the only 3D surfaces.
- Moved `HIDE BOTTOM PANEL` to a centered workspace-level handle above the entire lower panel.
- Added a dedicated `SHOW BOTTOM PANEL` rail below the table when the lower panel is hidden, with no overlap against `−10`, `−1`, `+1`, `+10`, value or Set controls.
- Improved runtime-axis recognition so 2D trace follows RPM/MAP and other recognized axes in both demo and connected modes.
- Live trace stays 2D-only to avoid redundant 3D redraw work.

## Logging workspace

- Corrected playback so the shared cursor and current-value panels follow playback.
- Playback uses the sample timestamps rather than advancing at an arbitrary fixed index rate.
- Added a seek bar and visible sample/time position.
- Added MSL-style ASCII export through `COPY MSL`.
- Export includes `MarkerCode` and `MarkerIndex` as ordinary numeric channels for compatibility with tools that display arbitrary log fields.
- CSV export includes the same marker channels.

## Safety

All editing remains a local draft. Logging and export operate on local read-only runtime data. No ECU-writing command was added.
