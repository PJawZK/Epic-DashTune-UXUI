(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.EpicDashBridgeMock = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const DEFAULT_VALUES = Object.freeze({
    rpm: 821, map: 52, baro: 100, afr: 13.8, clt: 82, iat: 24, oilTemp: 96,
    fuelPressure: 320, fuelDelta: 300, batt: 13.9, ign: 16, oilPressure: 4.5,
    tps: 1.5, idleDuty: 24, boostDuty: 16, auxDuty: 0, vehicleSpeed: 0,
    displaySpeed: 0, gear: 0, knockRetard: 0, engineLoad: 28, injMs: 2.4,
    injectorDuty: 2.8, ethanol: 2.8, fuelLevel: 24, fanOutput: 1,
    fuelPumpOutput: 1, syncOk: 1, errorCount: 0, cylindersCount: 4,
    maxCylindersCount: 12, ignitionFault: 0, injectorFault: 0,
    ignitionFaultMask: 0, injectorFaultMask: 0
  });

  function create() {
    const listeners = new Set();
    let source = 'OFFLINE';
    let connected = false;
    let sessionCounter = 0;
    let session = 'offline-0';
    let revision = -1;
    let values = {};
    let tick = 0;
    let timer = null;

    function snapshot(rev = revision) {
      return { source, connected, session, revision: rev, values: { ...values } };
    }
    function publish(snap = snapshot()) {
      for (const listener of [...listeners]) listener(snap);
      return snap;
    }
    function subscribe(listener) {
      if (typeof listener !== 'function') throw new TypeError('listener must be a function');
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
    function activate(nextSource, initialValues) {
      if (!['OFFLINE','LIVE','DEMO','MSL','CSV','SELF_TEST'].includes(nextSource)) throw new Error('unsupported mock source');
      source = nextSource;
      connected = nextSource === 'LIVE';
      sessionCounter += 1;
      session = `${nextSource.toLowerCase()}-${sessionCounter}`;
      revision = 0;
      tick = 0;
      values = nextSource === 'OFFLINE' ? {} : { ...DEFAULT_VALUES, ...(initialValues || {}) };
      return publish();
    }
    function emit(patch) {
      revision += 1;
      values = { ...values, ...(patch || {}) };
      return publish();
    }
    function step() {
      if (source === 'OFFLINE') return publish();
      tick += 1;
      const s = tick / 10;
      return emit({
        rpm: Math.round(821 + Math.sin(s * 1.9) * 34),
        map: 52 + Math.sin(s * 1.3) * 2.8,
        afr: 13.8 + Math.sin(s * 1.7) * 0.12,
        clt: 82 + Math.sin(s * 0.08) * 0.7,
        batt: 13.9 + Math.sin(s * 0.6) * 0.08,
        ign: 16 + Math.sin(s * 1.1) * 1.2,
        tps: 1.5 + Math.max(0, Math.sin(s * 0.9)) * 1.1
      });
    }
    function emitStale() {
      return publish(snapshot(Math.max(0, revision - 1)));
    }
    function replayRetired(snap) { return publish(snap); }
    function disconnect() { return activate('OFFLINE'); }
    function start(intervalMs) {
      stop();
      timer = setInterval(step, Math.max(25, Number(intervalMs) || 100));
    }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    function getCurrentSnapshot() { return snapshot(); }

    return Object.freeze({ subscribe, activate, emit, step, emitStale, replayRetired, disconnect, start, stop, getCurrentSnapshot });
  }

  return Object.freeze({ DEFAULT_VALUES, create });
});
