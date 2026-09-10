
/* EpicDash UX r31 — unit-complete dashboard rendering with persistent no-signal formats. */
(() => {
 'use strict';
 const genericPresent=(v,d)=>({value:Number(v),text:Number.isFinite(Number(v))?Number(v).toFixed(d):'—',unit:''});
 const precisionFor=id=>{const c=window.SettingsUX?.getConfig?.()||{},v=Number(c.dashboard?.gaugePrecision?.[id]);return Number.isFinite(v)&&v>=0?Math.max(0,Math.min(3,Math.round(v))):undefined};
 const kindForKey=key=>({
   iat:'temperature',oilTemp:'temperature',fuelPressure:'pressureBar',fuelDelta:'pressureKpa',batt:'voltage',
   gpsSpeed:'speed',vehicleSpeed:'speed',displaySpeed:'speed'
 }[key]||null);
 const canonicalValue=(def,raw)=>def.key==='gear'?Number(raw):(def.display&&Number.isFinite(Number(raw))?def.display(Number(raw)):Number(raw));
 const displayed=(def,raw,id)=>{
   const d=precisionFor(id),kind=kindForKey(def.key),v=canonicalValue(def,raw);
   if(!Number.isFinite(Number(raw)))return kind?(window.SettingsUX?.present?.(kind,raw,d)||{text:'—',unit:def.unit,value:NaN}):{text:'—',unit:def.unit,value:NaN};
   if(kind)return window.SettingsUX?.present?.(kind,v,d)||genericPresent(v,d??1);
   if(def.key==='gear')return{text:v<=0?'N':String(Math.round(v)),unit:'',value:v};
   const digits=d??Number(window.SettingsUX?.getConfig?.()?.units?.precisionDigits??1);
   return{text:Number(v).toFixed(Math.max(0,Math.min(3,digits))),unit:def.unit,value:v};
 };
 const limitsFor=(id,def)=>{const g=window.SettingsUX?.getConfig?.()?.dashboard?.gaugeLimits?.[id]||{};const min=Number.isFinite(Number(g.min))?Number(g.min):def.min,max=Number.isFinite(Number(g.max))?Number(g.max):def.max;return max>min?[min,max]:[def.min,def.max]};
 const scaleText=(kind,v,d)=>kind?(window.SettingsUX?.present?.(kind,v,d)?.text??String(v)):Number(v).toFixed(d??0);

 secondaryDefs.forEach(def=>{
   const id=`secGauge_${def.key}`,kind=kindForKey(def.key);
   GAUGE_QUICK[id]={label:def.label,unit:def.unit,kind,step:(kind==='temperature'||kind==='speed')?1:.1,minPath:`dashboard.gaugeLimits.${id}.min`,maxPath:`dashboard.gaugeLimits.${id}.max`,precisionPath:`dashboard.gaugePrecision.${id}`,defaults:[def.min,def.max]};
 });
 compactDefs.forEach(def=>{
   const id=`cmpGauge_${def.key}`,kind=kindForKey(def.key);
   GAUGE_QUICK[id]={label:def.label,unit:def.unit,kind,step:kind==='speed'?1:.1,minPath:`dashboard.gaugeLimits.${id}.min`,maxPath:`dashboard.gaugeLimits.${id}.max`,precisionPath:`dashboard.gaugePrecision.${id}`,defaults:[def.min,def.max]};
 });
 Object.assign(GAUGE_QUICK.rpmDial,{kind:null,precisionPath:'dashboard.gaugePrecision.rpmDial'});
 Object.assign(GAUGE_QUICK.boostDial,{kind:'pressureBar',precisionPath:'dashboard.gaugePrecision.boostDial'});
 Object.assign(GAUGE_QUICK.afrDial,{kind:'afr',precisionPath:'dashboard.gaugePrecision.afrDial'});
 Object.assign(GAUGE_QUICK.cltDial,{kind:'temperature',precisionPath:'dashboard.gaugePrecision.cltDial'});
 Object.assign(GAUGE_QUICK.oilDial,{kind:'pressureBar',precisionPath:'dashboard.gaugePrecision.oilDial'});
 Object.assign(GAUGE_QUICK.fuelDial,{kind:null,precisionPath:'dashboard.gaugePrecision.fuelDial'});

 renderSecondary=function(){
   secondaryDefs.forEach(def=>{
     const id=`secGauge_${def.key}`,raw=state[def.key],p=displayed(def,raw,id),val=$('sec_'+def.key),[min,max]=limitsFor(id,def),kind=kindForKey(def.key),d=precisionFor(id);
     text('sec_'+def.key,p.text);if(val?.nextElementSibling)val.nextElementSibling.textContent=p.unit;
     setBar('secbar_'+def.key,canonicalValue(def,raw),min,max);
     text('secmin_'+def.key,scaleText(kind,min,d));text('secmax_'+def.key,scaleText(kind,max,d));
     const [label,statusKind]=def.status(raw);text('secstatus_'+def.key,label);classState($('secstatus_'+def.key),'miniStatus',statusKind==='ok'?'':statusKind);
   });
 };
 renderCompact=function(){
   compactDefs.forEach(def=>{
     const id=`cmpGauge_${def.key}`,raw=state[def.key],p=displayed(def,raw,id),val=$('cmp_'+def.key),[min,max]=limitsFor(id,def),kind=kindForKey(def.key),d=precisionFor(id);
     text('cmp_'+def.key,p.text);if(val?.nextElementSibling)val.nextElementSibling.textContent=p.unit;
     setBar('cmpbar_'+def.key,canonicalValue(def,raw),min,max);
     text('cmpmin_'+def.key,scaleText(kind,min,d));text('cmpmax_'+def.key,scaleText(kind,max,d));
   });
 };

 const baseRender=render;
 render=function(){
   baseRender();
   const cfg=window.SettingsUX?.getConfig?.()||{},gp=cfg.dashboard?.gaugePrecision||{};
   const show=(valueId,kind,raw,gaugeId,fallbackUnit='')=>{const d=Number(gp[gaugeId]),digits=Number.isFinite(d)&&d>=0?d:undefined,p=kind?window.SettingsUX?.present?.(kind,raw,digits):genericPresent(raw,digits??Number(cfg.units?.precisionDigits??1));text(valueId,p.text);const u=$(valueId)?.parentElement?.querySelector('.radialUnit,.dialUnit');if(u)u.textContent=p.unit||fallbackUnit};
   show('boost','pressureBar',(Number(state.map)-Number(state.baro||100))/100,'boostDial','bar');
   show('afr','afr',state.afr,'afrDial','AFR');
   show('clt','temperature',state.clt,'cltDial','°C');
   show('oil','pressureBar',state.oilPressure,'oilDial','bar');
   show('fuelLevel',null,state.fuelLevel,'fuelDial','%');
 };

 const displayLimit=(def,v,d)=>def.kind?window.SettingsUX?.present?.(def.kind,v,d)?.value:Number(v);
 const rawLimit=(def,v)=>def.kind?window.SettingsUX?.toRaw?.(def.kind,v):Number(v);
 openGaugeQuick=function(id){
   const def=GAUGE_QUICK[id];if(!def)return;gaugeQuickId=id;const cfg=window.SettingsUX?.getConfig?.()||{},min=Number(cfgPath(cfg,def.minPath)),max=Number(cfgPath(cfg,def.maxPath)),precision=Number(cfgPath(cfg,def.precisionPath));
   const d=Number.isFinite(precision)&&precision>=0?precision:undefined,pmin=displayLimit(def,Number.isFinite(min)?min:def.defaults[0],d),pmax=displayLimit(def,Number.isFinite(max)?max:def.defaults[1],d),unit=def.kind?(window.SettingsUX?.present?.(def.kind,def.defaults[0],d)?.unit||def.unit):def.unit;
   $('gaugeQuickTitle').textContent=`${def.label} — DISPLAY OPTIONS`;$('gaugeQuickHint').textContent=`Adjust this gauge only • ${unit||'unitless'} • local display setting`;$('gaugeQuickError').textContent='';
   $('gaugeQuickMin').step=String(def.step||.1);$('gaugeQuickMax').step=String(def.step||.1);$('gaugeQuickMin').value=Number(pmin.toFixed?.(3)??pmin);$('gaugeQuickMax').value=Number(pmax.toFixed?.(3)??pmax);$('gaugeQuickPrecision').value=Number.isFinite(precision)&&precision>=0?String(precision):'-1';$('gaugeQuickOverlay').classList.remove('hidden');
   try{window.EpicDashAndroid?.performHaptic?.('longpress')}catch(_){}
 };
 applyGaugeQuick=function(reset=false){
   const def=GAUGE_QUICK[gaugeQuickId];if(!def)return;const precision=reset?-1:Number($('gaugeQuickPrecision').value),displayMin=reset?displayLimit(def,def.defaults[0]):Number($('gaugeQuickMin').value),displayMax=reset?displayLimit(def,def.defaults[1]):Number($('gaugeQuickMax').value),min=reset?def.defaults[0]:rawLimit(def,displayMin),max=reset?def.defaults[1]:rawLimit(def,displayMax);
   if(!Number.isFinite(min)||!Number.isFinite(max)||max<=min){$('gaugeQuickError').textContent='Maximum must be greater than minimum.';return}
   window.SettingsUX?.setValues?.({[def.minPath]:min,[def.maxPath]:max,[def.precisionPath]:precision});
   if(reset){$('gaugeQuickPrecision').value='-1';openGaugeQuick(gaugeQuickId)}else closeGaugeQuick();
 };

 let nonRadialHold=null,nonRadialPointers=new Set();
 const cancel=()=>{if(nonRadialHold?.timer)clearTimeout(nonRadialHold.timer);nonRadialHold=null};
 document.addEventListener('pointerdown',e=>{const gauge=e.target?.closest?.('.dashboardGaugeTarget');if(!gauge||e.button>0)return;nonRadialPointers.add(e.pointerId);if(nonRadialPointers.size>1){cancel();return}const g=nonRadialHold={id:gauge.dataset.gaugeQuickId,pointer:e.pointerId,x:e.clientX,y:e.clientY,timer:setTimeout(()=>{if(nonRadialHold===g&&nonRadialPointers.size===1){gaugeHoldSuppressUntil=performance.now()+650;openGaugeQuick(g.id)}},560)}},{capture:true});
 document.addEventListener('pointermove',e=>{const g=nonRadialHold;if(g&&g.pointer===e.pointerId&&Math.hypot(e.clientX-g.x,e.clientY-g.y)>9)cancel()},{capture:true});
 document.addEventListener('pointerup',e=>{nonRadialPointers.delete(e.pointerId);cancel()},{capture:true});
 document.addEventListener('pointercancel',e=>{nonRadialPointers.delete(e.pointerId);cancel()},{capture:true});
 document.addEventListener('contextmenu',e=>{if(e.target?.closest?.('.dashboardGaugeTarget,.radialGauge'))e.preventDefault()},{capture:true});
 document.addEventListener('selectstart',e=>{if(e.target?.closest?.('.dashboardGaugeTarget,.radialGauge'))e.preventDefault()},{capture:true});
 document.addEventListener('dragstart',e=>{if(e.target?.closest?.('.dashboardGaugeTarget,.radialGauge'))e.preventDefault()},{capture:true});

 // Fullscreen table modal owns taps completely; internal controls still receive them.
 document.addEventListener('touchstart',e=>{if(e.target?.closest?.('.tableSurfaceModal')){pageSwipe=null;pageSwipeClear(pageSwipeSurface(),false)}},{capture:true,passive:true});
 document.addEventListener('pointerdown',e=>{if(e.target?.closest?.('.tableSurfaceModal')){pageSwipe=null;pageSwipeClear(pageSwipeSurface(),false)}},{capture:true});

 try{window.ConceptRadialGauge?.rebuildAll?.();render()}catch(_){}
})();
