# EpicDash UX r30 — signal, Tables and gauge implementation

## Tables

- Dedicated left and right boundary controls mirror the existing bottom fold control.
- Pinch zoom records the logical content coordinate beneath the initial two-finger midpoint and adjusts scrolling after every scale change, keeping that coordinate beneath the moving midpoint.
- Existing phone behavior remains unchanged: all panels stay visible and redundant fold controls remain hidden.

## DEMO and live signal state

- The active DEMO button receives an explicit theme-independent green rule.
- Live state is valid only while DEMO is active or a finite native/MSL sample has arrived within 1.6 seconds.
- Leaving DEMO clears demo-generated telemetry immediately. A live callback then repopulates real channels.
- Disconnect or stale callback timeout clears runtime values to `NaN`; presentation renders `—` and radial pointers return to their minimum position.
- Cylinder count is retained so the configured 1–12 cylinder bank geometry does not jump when signal is absent; its state is labelled `NO SIGNAL`.
- Diagnostics trend sampling and trigger-wave rendering pause when neither DEMO nor live signal is available.

## Gauge typography

- The five small radial readouts use a smaller central digital value while RPM retains its existing hero value.
- IAC Duty and TPS metadata beneath the RPM gauge are enlarged across responsive profiles.

## Boundary

No ECU write, burn, output-control, virtual-input or fault-clearing path was added.
