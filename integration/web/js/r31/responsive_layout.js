'use strict';
(() => {
  const PROFILE_ATTR='data-ux-viewport';
  let last='';
  let resizeTimer=0;

  function profileFor(width,height){
    const landscape=width>height;
    if(landscape && height<=620) return 'phone-landscape';
    if(!landscape && width<=699) return 'phone-portrait';
    if(!landscape && width<=1150) return 'tablet-portrait';
    return 'tablet-landscape';
  }

  function apply(force=false){
    const width=Math.max(1,window.innerWidth||document.documentElement.clientWidth||1);
    const height=Math.max(1,window.innerHeight||document.documentElement.clientHeight||1);
    const profile=profileFor(width,height);
    document.documentElement.style.setProperty('--ux-window-height',`${height}px`);
    document.documentElement.style.setProperty('--ux-window-width',`${width}px`);
    if(!force && profile===last) return profile;
    last=profile;
    document.body?.setAttribute(PROFILE_ATTR,profile);
    document.body?.classList.toggle('uxPhone',profile.startsWith('phone-'));
    document.body?.classList.toggle('uxPortrait',profile.endsWith('-portrait'));
    document.body?.classList.toggle('uxLandscape',profile.endsWith('-landscape'));
    try{
      window.dispatchEvent(new CustomEvent('epicdashux:viewportchange',{detail:{profile,width,height}}));
    }catch(_){ }
    return profile;
  }

  function schedule(){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>apply(true),80);
  }

  window.UXResponsive={apply,current:()=>last,profileFor};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>apply(true),{once:true});
  else apply(true);
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(()=>apply(true),120),{passive:true});
})();
