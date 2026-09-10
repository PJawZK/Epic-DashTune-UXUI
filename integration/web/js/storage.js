(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.EpicDashStorage = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const STORAGE_KEY = 'epicdash.integration.storage.v1';
  const MAX_BACKUP_BYTES = 256 * 1024;
  const ALLOWED_TOP_LEVEL = new Set(['schemaVersion', 'page', 'settings', 'favorites']);
  const ALLOWED_PAGES = new Set(['dashboard','tuning','tables','logging','diagnostics','settings']);

  function validate(candidate) {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return 'backup_not_object';
    for (const key of Object.keys(candidate)) if (!ALLOWED_TOP_LEVEL.has(key)) return `unsupported_key:${key}`;
    if (candidate.schemaVersion !== 1) return 'unsupported_schema_version';
    if (candidate.page !== undefined && !ALLOWED_PAGES.has(candidate.page)) return 'invalid_page';
    if (candidate.settings !== undefined && (!candidate.settings || typeof candidate.settings !== 'object' || Array.isArray(candidate.settings))) return 'invalid_settings';
    if (candidate.favorites !== undefined && !Array.isArray(candidate.favorites)) return 'invalid_favorites';
    return null;
  }

  function migrate(candidate) {
    // v1 is the first integration schema. Future migrations happen here before commit.
    return {
      schemaVersion: 1,
      page: candidate.page || 'dashboard',
      settings: { ...(candidate.settings || {}) },
      favorites: Array.isArray(candidate.favorites) ? candidate.favorites.slice(0, 256).map(String) : []
    };
  }

  function parseAndValidate(text) {
    if (typeof text !== 'string') return { ok: false, reason: 'backup_not_text' };
    if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) return { ok: false, reason: 'backup_too_large' };
    let parsed;
    try { parsed = JSON.parse(text); } catch (_) { return { ok: false, reason: 'invalid_json' }; }
    const reason = validate(parsed);
    if (reason) return { ok: false, reason };
    return { ok: true, value: migrate(parsed) };
  }

  function restore(storage, text) {
    if (!storage?.setItem) throw new TypeError('storage adapter is required');
    const parsed = parseAndValidate(text);
    if (!parsed.ok) return parsed;
    // A single namespaced write is the transaction boundary: no per-key partial restore.
    storage.setItem(STORAGE_KEY, JSON.stringify(parsed.value));
    return { ok: true, value: parsed.value };
  }

  function load(storage) {
    if (!storage?.getItem) throw new TypeError('storage adapter is required');
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { schemaVersion: 1, page: 'dashboard', settings: {}, favorites: [] };
    const parsed = parseAndValidate(raw);
    return parsed.ok ? parsed.value : { schemaVersion: 1, page: 'dashboard', settings: {}, favorites: [] };
  }

  function serialize(value) {
    const candidate = { schemaVersion: 1, ...(value || {}) };
    const reason = validate(candidate);
    if (reason) throw new Error(reason);
    return JSON.stringify(migrate(candidate), null, 2);
  }

  return Object.freeze({ STORAGE_KEY, MAX_BACKUP_BYTES, validate, parseAndValidate, restore, load, serialize });
});
