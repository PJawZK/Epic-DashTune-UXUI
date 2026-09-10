# EpicDash UX r17 responsive implementation

## Scope

r17 adds an isolated responsive presentation layer for portrait tablets and phones without changing the accepted tablet-landscape geometry.

## Viewport profiles

`responsive_layout.js` assigns one profile to `body[data-ux-viewport]`:

- `tablet-landscape`: default presentation; r16 layout rules remain authoritative.
- `tablet-portrait`: portrait viewports from 700 through 1150 CSS pixels wide.
- `phone-portrait`: portrait viewports no wider than 699 CSS pixels.
- `phone-landscape`: landscape viewports no taller than 620 CSS pixels.

The profile is recalculated after resize and orientation changes. Responsive behavior is isolated in `responsive_layout.css`; existing page CSS remains unchanged.

## Tablet portrait

- Two-row header with horizontally scrollable page navigation.
- Vertically scrollable dashboard with the tachometer full width and gauges arranged in two columns.
- Tuning retains the catalog beside the setting list; Quick Tuning, inspector and draft status move below.
- Tables retains the selector beside the 2D editor; right and bottom panels flow below the main editor.
- Logging retains channels beside the graphs; cursor, info, markers and playback flow below.
- Diagnostics and Settings keep a stable side navigation while their workspaces scroll naturally.
- The live-data footer scrolls horizontally instead of compressing values.

## Samsung SM-A137F-class phone profiles

Phone rules are separate from tablet rules.

### Portrait

- Compact two-row header and horizontally scrollable navigation.
- Dedicated single-column Tuning, Tables, Logging, Diagnostics and Settings workspaces.
- Dashboard uses a full-width tachometer, two-column gauges and stacked output/status sections.
- Table and array popups remain full-screen-capable.

### Landscape

- Compact one-row header.
- Dashboard uses a four-column composition with a larger tachometer span.
- Tool pages use a narrow sidebar and a main workspace, with secondary panels below where needed.

## Safety and ownership

This change affects presentation only. It does not add ECU writes, burns, table transmission, output control, fault clearing or virtual-input writes. Existing native bridge, source, Demo, local-draft and read-only behavior are retained.

## Browser validation

All six pages were rendered in each profile:

- tablet landscape: 1600×960;
- tablet portrait: 960×1600;
- phone portrait: 412×915;
- phone landscape: 915×412.

No JavaScript page errors were observed in the automated browser pass. Physical Samsung SM-T500 portrait and SM-A137F/DSN portrait/landscape testing remains required.
