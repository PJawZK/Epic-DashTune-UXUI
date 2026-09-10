(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.EpicDashRuntimeSnapshot = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const PATCH_VERSION = 1;

  function createPublisher(options = {}) {
    const identityStableKeys = new Set(options.identityStableKeys || []);
    const previousValues = new Map();
    const previousJson = new Map();
    let initialized = false;

    function encode(snapshot) {
      const complete = !initialized;
      const sections = {};
      for (const [key, value] of Object.entries(snapshot || {})) {
        if (initialized && identityStableKeys.has(key) && previousValues.get(key) === value) {
          continue;
        }

        const serialized = JSON.stringify(value);
        if (!initialized || previousJson.get(key) !== serialized) sections[key] = value;
        previousValues.set(key, value);
        previousJson.set(key, serialized);
      }
      initialized = true;
      return JSON.stringify({ runtimePatchVersion: PATCH_VERSION, complete, sections });
    }

    function reset() {
      previousValues.clear();
      previousJson.clear();
      initialized = false;
    }

    return { encode, reset };
  }

  function applyPatch(current, payload) {
    if (!payload || payload.runtimePatchVersion !== PATCH_VERSION || !payload.sections) {
      return { ...(payload || {}) };
    }
    const next = payload.complete ? {} : { ...(current || {}) };
    for (const [key, value] of Object.entries(payload.sections)) next[key] = value;
    return next;
  }

  return { PATCH_VERSION, createPublisher, applyPatch };
});
