# EpicDash UX r13 — Diagnostics implementation

## Scope

This revision establishes a functional read-only Diagnostics base and fixes the Tables live-trace toggle.

## Diagnostics tools

- Fault Codes / display-derived conditions
- Sensor Health with bounded trends and plausibility states
- Trigger / Sync waveform views for crank and cam
- Communications and native bridge diagnostic inspection
- Power & Grounds display checks
- CAN / Serial read-only status
- ECU and application identity
- Actuator Tests policy-lock explanation

## Bottom workspace

- Local diagnostic event history
- Battery, sync-error and tooth-error trends
- Display-only test results

## Safety

No fault-clear, output-test, relay-cycle, tune-write, table-write, burn, virtual-input or ECU configuration commands are implemented. Reports and local event clearing affect only EpicDash UX application data.

## Tables correction

The 2D trace control now shows its actual state, persists locally, and updates without rerendering or resetting the table scroll viewport.
