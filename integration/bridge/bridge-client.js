(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.EpicDashBridgeClient = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function create(options) {
    const store = options?.store;
    const bridge = options?.bridge;
    if (!store?.acceptAuthoritativeSnapshot) throw new TypeError('store is required');
    if (!bridge?.subscribe) throw new TypeError('bridge.subscribe is required');
    let unsubscribe = null;

    function start() {
      if (unsubscribe) return;
      const maybeUnsubscribe = bridge.subscribe(function onAuthorizedSnapshot(snapshot) {
        // Native/JZ owns transport generation validity and connection authority.
        // The integration layer only enforces the published source/session/revision contract.
        store.acceptAuthoritativeSnapshot(snapshot);
      });
      unsubscribe = typeof maybeUnsubscribe === 'function' ? maybeUnsubscribe : function () {};
    }

    function stop() {
      if (!unsubscribe) return;
      const fn = unsubscribe;
      unsubscribe = null;
      fn();
    }

    return Object.freeze({ start, stop });
  }

  return Object.freeze({ create });
});
