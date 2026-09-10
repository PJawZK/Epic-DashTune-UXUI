# EpicDash UX r18 radial gauge implementation

Scope is intentionally limited to the six primary dashboard radial gauges: RPM, Boost, AFR Gas Scale, Coolant, Oil Pressure and Fuel Level.

- One SVG-based upper-half radial template.
- Common horizontally aligned arc endpoints.
- RPM uses a larger hero variant of the same component.
- Individual min/max ranges and tick intervals are encoded per gauge.
- Warning bands remain gauge-specific while geometry remains shared.
- Other dashboard cards and all non-dashboard pages are unchanged.
- ECU interaction remains strictly read-only.
