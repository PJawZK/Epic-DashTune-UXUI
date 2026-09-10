# Epic-DashTune r31 -> EpicDash-JZ integration package

## Status

Stage A establishes the production-transfer boundary. `source/r31/` remains immutable accepted evidence and is not modified by this package.

The active implementation under `integration/` deliberately does not reuse the standalone r31 connection-ownership path. The r31 visual assets are copied/referenced for porting, while runtime authority is replaced by a central store and a minimal bridge contract.

## Authority chain

```text
EpicDash-JZ native authority (future Stage B)
  -> authorized runtime snapshot
  -> EpicDashBridge.subscribe(...)
  -> bridge-client.js
  -> state-store.js
  -> active-page render coordinator
  -> Dashboard / Tables / Logging / Diagnostics / Settings / Tuning
```

The browser build uses `bridge-mock.js` in place of the native host. The mock has no ECU access.

## Source ownership

Exactly one application source is authoritative at a time:

`OFFLINE`, `LIVE`, `DEMO`, `MSL`, `CSV`, or `SELF_TEST`.

Pages do not infer source from data arrival and do not independently choose Demo/Live/playback state. They receive the same accepted store snapshot.

## Session and revision rules

1. Every source authority epoch has a non-empty `session` ID.
2. `revision` starts at zero or greater and strictly increases within that session.
3. A source change requires a new session.
4. When a new session is accepted, the previous session becomes retired.
5. Delayed frames from a retired session are rejected.
6. Equal or lower revisions in the active session are rejected.
7. `OFFLINE` must have `connected=false`; `LIVE` must have `connected=true`.
8. Native USB generation validation remains outside this layer. The bridge receives already-authorized state.

## Rendering boundary

`render-coordinator.js` invokes `onSnapshot(state)` only for the active page. Switching page performs one `onActivate(state)` call for the newly active page.

The Dashboard port creates cylinder DOM only when the configured cylinder count changes (1-12). Telemetry frames update classes/values instead of recreating the bank.

The copied r31 page implementations are kept as porting references and are not loaded by `integration/web/index.html` until each page is refactored behind the central store contract. This prevents their legacy global runtime loops and Android calls from becoming application authority.

## Tuning metadata

`integration/demo-data/` contains exact r31 catalog fixtures for browser/development use. They are intentionally absent from normal startup. Production Tables/Tuning metadata will come from an imported INI / active JZ profile and a read-only TuneSnapshot/descriptors bridge.

## Logging ownership

Stage A does not turn the JavaScript logger into the production recorder. Production acquisition, append-only MSL writing, recovery and long-session storage remain native-JZ responsibilities. The UX layer will own channel selection, graphing, cursor/markers and playback interaction after the native contract is defined.

## Diagnostics ownership

The r31 Diagnostics presentation remains a visual reference. Production diagnostic authority will be EpicDash-JZ DiagnosticStore / diagnostics JSON. Actuator tests and write-like actions remain blocked.

## Storage

`storage.js` uses one namespaced JSON object as the commit boundary. Restore order is: read -> size check -> parse temporary representation -> schema/key validation -> version check -> migration -> one atomic `setItem`. Invalid input does not partially update stored state.

## Safety boundary

This package exposes no tune writes, table writes, burn commands, output controls, actuator tests, virtual-input writes, fault clearing or ECU configuration changes.

## Browser / local tests

Run the dependency-free contract tests with Node:

```sh
node integration/tests/state-store.test.js
node integration/tests/storage.test.js
node integration/tests/render-boundary.test.js
```

Open `integration/tests/browser-regression.html` in a browser to exercise source switching, increasing revisions, stale-revision rejection, retired-session rejection and disconnect/OFFLINE behavior through the mock bridge.

## Stage B gate

Do not change EpicDash-JZ yet. Stage B starts only after this package is reviewed as the transfer authority, then integrates shell + Dashboard behind a LAB entry while native JZ remains authoritative for USB/session/revision state.
