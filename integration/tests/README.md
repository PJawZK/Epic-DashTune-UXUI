# Stage A regression tests

The Node tests have no package dependencies. `browser-regression.html` uses the same `state-store.js`, `bridge-client.js` and `bridge-mock.js` files as the integration shell.

Coverage:

- explicit source switching;
- increasing revision acceptance;
- stale active-session revision rejection;
- retired-session rejection after source switch;
- disconnect/no-signal -> `OFFLINE` with empty runtime values;
- transactional storage restore rejection without partial commit;
- active-page-only render dispatch.

The full visual shell is intentionally not a production recorder or Android connection owner in Stage A.
