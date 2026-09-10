(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.EpicDashRenderCoordinator = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function create(pages, initialPage) {
    if (!pages || typeof pages !== 'object') throw new TypeError('pages are required');
    let activePage = pages[initialPage] ? initialPage : Object.keys(pages)[0];
    function setActivePage(page, snapshot) {
      if (!pages[page]) throw new Error(`unknown_page:${page}`);
      activePage = page;
      pages[activePage].onActivate?.(snapshot);
    }
    function onSnapshot(snapshot) { pages[activePage]?.onSnapshot?.(snapshot); }
    return Object.freeze({ setActivePage, onSnapshot, getActivePage: () => activePage });
  }
  return Object.freeze({ create });
});
