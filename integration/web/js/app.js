(function(root){
'use strict';
const State=root.EpicDashStateStore,Client=root.EpicDashBridgeClient,Mock=root.EpicDashBridgeMock,Coordinator=root.EpicDashRenderCoordinator,pages=root.EpicDashPages;
if(!State||!Client||!Mock||!Coordinator||!pages)throw new Error('EpicDash integration dependencies missing');
const store=State.createStore();
const metrics=root.__EpicDashIntegrationMetrics=root.__EpicDashIntegrationMetrics||{pageRenders:{},acceptedSnapshots:0};
let client=null,mock=null;const coordinator=Coordinator.create(pages,'dashboard');

function sourceBadge(s){const n=document.getElementById('sourceState');if(!n)return;n.className='pill'+(s.source==='LIVE'?' good':s.source==='OFFLINE'?'':' good');const b=n.querySelector('b');if(b)b.textContent=s.source;}
function showPage(page){if(!pages[page])return;document.querySelectorAll('[data-page]').forEach(n=>n.classList.toggle('active',n.dataset.page===page));const dash=document.getElementById('dashboard'),panel=document.getElementById('panelPage');if(dash)dash.classList.toggle('hidden',page!=='dashboard');if(panel)panel.classList.toggle('active',page!=='dashboard');coordinator.setActivePage(page,store.getState());}
function accepted(s){metrics.acceptedSnapshots=(metrics.acceptedSnapshots||0)+1;sourceBadge(s);coordinator.onSnapshot(s);}
store.subscribe(accepted);

function attachNavigation(){document.addEventListener('click',e=>{const tab=e.target.closest?.('[data-page]');if(tab){showPage(tab.dataset.page);return}const src=e.target.closest?.('[data-mock-source]');if(src&&mock){src.dataset.mockSource==='OFFLINE'?mock.disconnect():mock.activate(src.dataset.mockSource);return}const action=e.target.closest?.('[data-mock-action]');if(action?.dataset.mockAction==='stale'&&mock)mock.emitStale();});const demo=document.getElementById('demoBtn');if(demo)demo.addEventListener('click',()=>{if(!mock)return;store.getState().source==='DEMO'?mock.disconnect():mock.activate('DEMO')});}
function selectBridge(){if(root.EpicDashBridge?.subscribe){client=Client.create({store,bridge:root.EpicDashBridge});client.start();return}mock=Mock.create();client=Client.create({store,bridge:mock});client.start();mock.activate('DEMO');mock.start(100);}
function stop(){mock?.stop?.();client?.stop?.();}

root.EpicDashApp={store,get activePage(){return coordinator.getActivePage()},get mock(){return mock},showPage,stop};
attachNavigation();try{root.UXResponsive?.apply?.(true);root.ConceptRadialGauge?.initAll?.()}catch(_){}selectBridge();showPage('dashboard');
})(typeof globalThis!=='undefined'?globalThis:this);
