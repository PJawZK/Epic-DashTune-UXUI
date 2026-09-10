# EpicDash UX r20 concept-art primary-gauge rebuild

## Scope

Only the six primary radial gauges are changed: RPM, Boost, AFR Gas Scale, Coolant, Oil Pressure and Fuel Level.

## Replaced implementation

- Added `app/src/main/assets/concept_radial_gauges.js`.
- Removed the six legacy static primary-gauge SVG path stacks from `dashboard_lab.html`.
- Replaced the former radial update/init functions with calls into the shared r20 renderer.
- Replaced r19 primary-gauge CSS with the segmented concept-art component styling.
- Added six newly drawn primary symbols: `p-engine`, `p-turbo`, `p-lambda`, `p-coolant`, `p-oil`, and `p-fuel`.

## Preserved behavior

- Package `com.buttonbox.ble.ul` and app name EpicDash UX.
- One RPM hero gauge plus five smaller gauges.
- Existing dashboard grid, lower cards, output/status blocks and live-data strip.
- Demo and live value bindings.
- Exact display ranges: RPM 0–8000, Boost −1.0–2.0 bar, AFR 9.0–20.0, Coolant 40–120 °C, Oil Pressure 0–10 bar, Fuel Level 0–100%.
- Separate tablet landscape, tablet portrait, phone portrait and phone landscape profiles.
- Strictly read-only ECU boundary.

## Visual construction

The shared SVG renderer creates 224 segmented zone elements across the six gauges. Each gauge has a layered bezel, gauge-specific colored zones, dim unfilled segments, active inner illumination, major/minor tick hierarchy, scale labels and a value needle. The numeric display remains the unaltered application value; only the visual indicator is bounded to the configured scale.
