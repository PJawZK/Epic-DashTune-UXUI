# EpicDash integration bride

This bridge is intentionally smaller than the standalone r31 Android wrapper.

The host application owns transport, USB generation validation, reconnect/disconnect, session creation, connection state, snapshot revision and stale native-frame rejection. The WebView receives an already-authorized runtime snapshot through one method:

```js
EpicDashBridge.subscribe(snapshot => {
  store.acceptAuthoritativeSnapshot(snapshot);
});
```

The integration layer does **not** open USB/BLE, select a transport, reconnect a device, poll the ECU, or issue ECU commands.

## Runtime snapshot contract

Required fields are defined by `../schemas/runtime-snapshot.schema.json`:

- `source`: `OFFLINE | LIVE | DEMO | MSL | CSV | SELF_TEST`
- `connected`: host-authoritative live connection state
- `session`: non-empty authority/session identifier
- `revision`: monotonically increasing integer within a session
- `values`: canonical channel object

A source change starts a new session. A previously retired session is never accepted again. Within a session, revisions must strictly increase. This catches delayed WebView deliveries without duplicating native USB-generation logic.

## Mock bridge

`bridge-mock.js` implements the same `subscribe()` surface and deterministic source/session/revision behavior for browser regression work. It is a test provider only and is never production metadata or connection authority.
