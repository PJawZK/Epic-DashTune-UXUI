(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.EpicDashStateStore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SOURCES = Object.freeze({
    OFFLINE: 'OFFLINE',
    LIVE: 'LIVE',
    DEMO: 'DEMO',
    MSL: 'MSL',
    CSV: 'CSV',
    SELF_TEST: 'SELF_TEST'
  });
  const SOURCE_SET = new Set(Object.values(SOURCES));

  function freezeState(state) {
    const values = Object.freeze({ ...(state.values || {}) });
    return Object.freeze({ ...state, values });
  }

  function validateSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) return 'snapshot_not_object';
    if (!SOURCE_SET.has(snapshot.source)) return 'invalid_source';
    if (typeof snapshot.session !== 'string' || !snapshot.session.trim()) return 'invalid_session';
    if (!Number.isSafeInteger(snapshot.revision) || snapshot.revision < 0) return 'invalid_revision';
    if (!snapshot.values || typeof snapshot.values !== 'object' || Array.isArray(snapshot.values)) return 'invalid_values';
    if (typeof snapshot.connected !== 'boolean') return 'invalid_connected';
    if (snapshot.source === SOURCES.OFFLINE && snapshot.connected) return 'offline_connected';
    if (snapshot.source === SOURCES.LIVE && !snapshot.connected) return 'live_disconnected';
    return null;
  }

  function createStore() {
    let state = freezeState({
      source: SOURCES.OFFLINE,
      connected: false,
      session: null,
      revision: -1,
      values: {},
      acceptedAtMs: 0
    });
    const listeners = new Set();
    const retiredSessions = new Set();
    const stats = {
      accepted: 0,
      rejected: 0,
      rejectedByReason: Object.create(null),
      sourceSwitches: 0
    };

    function reject(reason) {
      stats.rejected += 1;
      stats.rejectedByReason[reason] = (stats.rejectedByReason[reason] || 0) + 1;
      return { accepted: false, reason, state };
    }

    function acceptAuthoritativeSnapshot(snapshot) {
      const invalid = validateSnapshot(snapshot);
      if (invalid) return reject(invalid);

      const sameSession = state.session === snapshot.session;
      if (retiredSessions.has(snapshot.session)) return reject('retired_session');
      if (sameSession && snapshot.source !== state.source) return reject('source_changed_without_new_session');
      if (sameSession && snapshot.revision <= state.revision) return reject('stale_revision');

      if (!sameSession && state.session !== null) {
        retiredSessions.add(state.session);
        stats.sourceSwitches += 1;
      }

      state = freezeState({
        source: snapshot.source,
        connected: snapshot.connected,
        session: snapshot.session,
        revision: snapshot.revision,
        values: snapshot.values,
        acceptedAtMs: Date.now()
      });
      stats.accepted += 1;
      for (const listener of [...listeners]) {
        try { listener(state); } catch (_) { }
      }
      return { accepted: true, reason: 'accepted', state };
    }

    function subscribe(listener, options) {
      if (typeof listener !== 'function') throw new TypeError('listener must be a function');
      listeners.add(listener);
      if (options?.emitCurrent) listener(state);
      return function unsubscribe() { listeners.delete(listener); };
    }

    function getState() { return state; }
    function getStats() {
      return Object.freeze({
        accepted: stats.accepted,
        rejected: stats.rejected,
        sourceSwitches: stats.sourceSwitches,
        rejectedByReason: Object.freeze({ ...stats.rejectedByReason }),
        activeListeners: listeners.size
      });
    }

    return Object.freeze({ SOURCES, acceptAuthoritativeSnapshot, subscribe, getState, getStats });
  }

  return Object.freeze({ SOURCES, validateSnapshot, createStore });
});
