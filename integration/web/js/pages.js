(function(root){
'use strict';

const metrics=root.__EpicDashIntegrationMetrics=root.__EpicDashIntegrationMetrics||{pageRenders:{},acceptedSnapshots:0};
const text=(id,value)=>{const n=document.getElementById(id);if(n)n.textContent=value};
const finite=v=>Number.isFinite(Number(v));
const fmt=(v,d=1)=>finite(v)?Number(v).toFixed(d).replace(/\.0$/,''):'—';
const setStatus=(id,label,kind)=>{const n=document.getElementById(id);if(!n)return;n.textContent=label;n.className='status'+(kind?` ${kind}`:'')};
const setBar=(id,v,min,max)=>{const n=document.getElementById(id);if(!n)return;const pct=finite(v)?Math.max(0,Math.min(100,(Number(v)-min)/(max-min)*100)):0;n.style.setProperty('--bar',pct.toFixed(1))};
const mark=id=>{metrics.pageRenders[id]=(metrics.pageRenders[id]||0)+1};

const secondaryDefs=[
 ['iat','i-airtemp','INTAKE AIR','°C',-10,80],['oilTemp','i-oiltemp','OIL TEMP','°C',40,140],['fuelPressure','i-fuelpressure','FUEL PRESSURE','bar',0,700],['fuelDelta','i-delta','FUEL ΔP','kPa',0,500],
 ['batt','i-battery','BATTERY','V',10,16],['ign','i-ignition','IGN ADV','°',-10,45],['injMs','i-injector','INJECTOR PW','ms',0,16],['knockRetard','i-knock','KNOCK RETARD','°',0,12]
];
const compactDefs=[
 ['vehicleSpeed','i-speed','SPEED','km/h',0,240],['tps','i-vss','TPS','%',0,100],['idleDuty','i-engine','IAC DUTY','%',0,100],['engineLoad','i-engine','ENGINE LOAD','%',0,100],
 ['injectorDuty','i-injector','INJ DUTY','%',0,100],['ethanol','i-ethanol','ETHANOL','%',0,100],['baro','i-airtemp','BARO','kPa',80,110],['gear','i-speed','GEAR','',0,6]
];
let dashboardBuilt=false,lastCylinderCount=0;

function buildDashboardRows(){
 if(dashboardBuilt)return;
 const secondary=document.getElementById('secondaryRow'),compact=document.getElementById('compactRow');
 if(secondary)secondary.innerHTML=secondaryDefs.map(([key,icon,label,unit])=>`<section class="card secondaryCard"><div class="secondaryHead"><svg class="icon"><use href="#${icon}"/></svg><div class="secondaryText"><div class="secondaryLabel">${label}</div><div class="secondaryValue"><span id="sec_${key}">—</span> <small>${unit}</small></div></div></div><div></div><div class="bar" id="secbar_${key}"></div><div class="miniStatus" id="secstatus_${key}">WAITING</div></section>`).join('');
 if(compact)compact.innerHTML=compactDefs.map(([key,icon,label,unit])=>`<section class="card compactCard"><div class="compactHead"><svg class="icon"><use href="#${icon}"/></svg><div><div class="compactLabel">${label}</div><div class="compactValue"><span id="cmp_${key}">—</span> <small>${unit}</small></div></div></div><div class="bar" id="cmpbar_${key}"></div><div></div></section>`).join('');
 dashboardBuilt=true;
}
function buildCylinderBanks(count){
 count=Math.max(1,Math.min(12,Number(count)||4));
 if(count===lastCylinderCount)return;
 const build=(id,icon)=>{const n=document.getElementById(id);if(!n)return;n.style.setProperty('--cylinder-cols',Math.min(count,6));n.innerHTML=Array.from({length:count},(_,i)=>`<div class="cylinderUnit" data-cylinder="${i}"><svg class="icon"><use href="#${icon}"/></svg><b>${i+1}</b></div>`).join('')};
 build('ignitionCylinders','i-coil');build('injectorCylinders','i-injector');lastCylinderCount=count;
}
function updateCylinderBank(id,labelId,count,mask,fault,label){
 const n=document.getElementById(id);if(!n)return;
 [...n.children].forEach((node,i)=>{const bad=((Number(mask)||0)&(1<<i))!==0;node.classList.toggle('fault',bad);node.classList.toggle('pulse',!bad)});
 const l=document.getElementById(labelId);if(l){l.textContent=`${label} • ${fault?'FAULT':'OK'}`;l.className=`cylinderLabel ${fault?'bad':'ok'}`}
}
function updateDashboard(snapshot){
 mark('dashboard');buildDashboardRows();const s=snapshot.values||{};
 text('rpm',finite(s.rpm)?Math.round(Number(s.rpm)):'—');text('rpmIac',`${fmt(s.idleDuty,1)} %`);text('rpmTps',`${fmt(s.tps,1)} %`);
 const boost=finite(s.map)?(Number(s.map)-Number(finite(s.baro)?s.baro:100))/100:NaN;text('boost',fmt(boost,2));text('afr',fmt(s.afr,1));text('clt',fmt(s.clt,0));text('oil',fmt(s.oilPressure,1));text('fuelLevel',fmt(s.fuelLevel,0));
 try{root.ConceptRadialGauge?.update?.('rpmDial',s.rpm);root.ConceptRadialGauge?.update?.('boostDial',boost);root.ConceptRadialGauge?.update?.('afrDial',s.afr);root.ConceptRadialGauge?.update?.('cltDial',s.clt);root.ConceptRadialGauge?.update?.('oilDial',s.oilPressure);root.ConceptRadialGauge?.update?.('fuelDial',s.fuelLevel)}catch(_){}
 setStatus('boostStatus',!finite(boost)?'NO DATA':boost>0?'BOOST':'VACUUM',!finite(boost)?'warn':'');setStatus('afrStatus',!finite(s.afr)?'NO DATA':Number(s.afr)>=10&&Number(s.afr)<=16?'IN RANGE':'CHECK',!finite(s.afr)?'warn':Number(s.afr)>=10&&Number(s.afr)<=16?'ok':'warn');setStatus('cltStatus',!finite(s.clt)?'NO DATA':Number(s.clt)>105?'HOT':Number(s.clt)>95?'CHECK':'NORMAL',!finite(s.clt)?'warn':Number(s.clt)>105?'bad':Number(s.clt)>95?'warn':'ok');setStatus('oilStatus',!finite(s.oilPressure)?'NO DATA':Number(s.oilPressure)<1?'LOW':'NORMAL',!finite(s.oilPressure)?'warn':Number(s.oilPressure)<1?'bad':'ok');setStatus('fuelStatus',!finite(s.fuelLevel)?'NO DATA':Number(s.fuelLevel)<15?'LOW':'NORMAL',!finite(s.fuelLevel)?'warn':Number(s.fuelLevel)<15?'warn':'ok');
 secondaryDefs.forEach(([key,,label,unit,min,max])=>{let v=s[key];if(key==='fuelPressure'&&finite(v))v=Number(v)/100;text(`sec_${key}`,fmt(v,unit==='bar'||unit==='V'||unit==='ms'?1:0));setBar(`secbar_${key}`,key==='fuelPressure'&&finite(s[key])?Number(s[key]):v,min,max);const ok=finite(v);const st=document.getElementById(`secstatus_${key}`);if(st){st.textContent=ok?'LIVE':'NO DATA';st.className=`miniStatus ${ok?'':'warn'}`}});
 compactDefs.forEach(([key,,,unit,min,max])=>{const v=s[key];text(`cmp_${key}`,key==='gear'&&finite(v)?(Number(v)<=0?'N':Math.round(Number(v))):fmt(v,unit==='%'?1:0));setBar(`cmpbar_${key}`,v,min,max)});
 text('fanOut',Number(s.fanOutput)>0?'ON':'OFF');text('fanTemp',fmt(s.clt,0));setBar('fanBar',s.clt,40,120);text('pumpOut',Number(s.fuelPumpOutput)>0?'ON':'OFF');text('pumpVolt',fmt(s.batt,1));setBar('pumpBar',s.batt,10,16);text('boostDutyOut',`${fmt(s.boostDuty,0)} %`);setBar('boostDutyBar',s.boostDuty,0,100);text('auxDutyOut',`${fmt(s.auxDuty,0)} %`);setBar('auxDutyBar',s.auxDuty,0,100);
 const count=Math.max(1,Math.min(12,Number(s.cylindersCount)||4));buildCylinderBanks(count);updateCylinderBank('ignitionCylinders','ignitionCylinderLabel',count,s.ignitionFaultMask,s.ignitionFault,'IGNITION');updateCylinderBank('injectorCylinders','injectorCylinderLabel',count,s.injectorFaultMask,s.injectorFault,'INJECTION');
 const faults=Number(s.errorCount)||Number(s.ignitionFault)||Number(s.injectorFault);const ok=document.getElementById('okCard');if(ok)ok.classList.toggle('bad',!!faults);text('okTitle',faults?'CHECK':'OK');text('errorText',faults?'Fault state reported':snapshot.source==='OFFLINE'?'No signal':'No Error');
}

const notes={
 tuning:'Tuning UX boundary only. Static r31 catalogs are fixtures in integration/demo-data and are not production metadata authority.',
 tables:'Tables UX boundary only. Production descriptors will come from the active JZ profile/TuneSnapshot bridge.',
 logging:'Logging UX boundary only. Production acquisition and MSL persistence remain native-JZ responsibilities.',
 diagnostics:'Diagnostics presentation boundary. Integrated data authority will be JZ DiagnosticStore/diagnostics JSON.',
 settings:'Local presentation settings only. Source ownership remains application-wide and no ECU writes are exposed.'
};
function ensurePanel(page){
 const panel=document.getElementById('panelContent');if(!panel)return null;if(panel.dataset.integrationPage===page)return panel;panel.dataset.integrationPage=page;panel.innerHTML=`<div class="expPage integrationBoundaryPage"><section class="pCard integrationBoundaryCard"><div class="pCardTitle">${page.toUpperCase()} • STAGE A TRANSFER BOUNDARY</div><div class="integrationBoundaryBody"><p>${notes[page]||''}</p><div class="integrationStateGrid"><div>SOURCE<b data-bind="source">OFFLINE</b></div><div>CONNECTED<b data-bind="connected">NO</b></div><div>SESSION<b data-bind="session">—</b></div><div>REVISION<b data-bind="revision">—</b></div><div>RPM<b data-bind="rpm">—</b></div><div>MAP<b data-bind="map">—</b></div></div><pre data-bind="values"></pre><div class="integrationMockControls" data-mock-controls hidden><button data-mock-source="DEMO">DEMO</button><button data-mock-source="MSL">MSL</button><button data-mock-source="CSV">CSV</button><button data-mock-source="SELF_TEST">SELF TEST</button><button data-mock-source="OFFLINE">OFFLINE</button><button data-mock-action="stale">EMIT STALE</button></div></div></section></div>`;return panel;
}
function updatePanel(page,snapshot){mark(page);const panel=ensurePanel(page);if(!panel)return;const v=snapshot.values||{};const bind=(name,val)=>{const n=panel.querySelector(`[data-bind="${name}"]`);if(n)n.textContent=val};bind('source',snapshot.source);bind('connected',snapshot.connected?'YES':'NO');bind('session',snapshot.session||'—');bind('revision',snapshot.revision);bind('rpm',finite(v.rpm)?Math.round(v.rpm):'—');bind('map',fmt(v.map,1));bind('values',JSON.stringify(v,null,2));if(page==='settings'){const c=panel.querySelector('[data-mock-controls]');if(c)c.hidden=!root.EpicDashApp?.mock}}

function page(name){return{onActivate:s=>name==='dashboard'?updateDashboard(s):updatePanel(name,s),onSnapshot:s=>name==='dashboard'?updateDashboard(s):updatePanel(name,s)}}
root.EpicDashPages=Object.freeze({dashboard:page('dashboard'),tuning:page('tuning'),tables:page('tables'),logging:page('logging'),diagnostics:page('diagnostics'),settings:page('settings')});
})(typeof globalThis!=='undefined'?globalThis:this);
