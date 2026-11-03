(function(){
  /* ---- mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navPanel = document.getElementById('navPanel');
  const navScrim = document.getElementById('navScrim');
  if(navToggle && navPanel && navScrim){
    function closeMenu(){
      navPanel.classList.remove('open');
      navScrim.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
      document.body.style.overflow='';
    }
    function openMenu(){
      navPanel.classList.add('open');
      navScrim.classList.add('open');
      navToggle.setAttribute('aria-expanded','true');
      document.body.style.overflow='hidden';
    }
    navToggle.addEventListener('click', ()=>{
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });
    navScrim.addEventListener('click', closeMenu);
    navPanel.querySelectorAll('a').forEach((a)=> a.addEventListener('click', closeMenu));
    window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', ()=>{ if(window.innerWidth > 820) closeMenu(); });
  }

  /* ---- animated monkey logo(s): eyes track the pointer ---- */
  const BASE_W = 1254;
  const MAX_DX = 9;
  const MAX_DY = 3;
  function clamp(v,lo,hi){return Math.max(lo,Math.min(hi,v));}

  const instances = [];
  document.querySelectorAll('[data-mk]').forEach((root)=>{
    const pupils = root.querySelectorAll('.mk-pupil');
    const badge = root.querySelector('.mk-badge');
    let isPointerActive = false;
    let idleTimer = null;

    function applyLook(x,y){
      const badgeRect = badge.getBoundingClientRect();
      const scale = badgeRect.width / BASE_W;
      const maxDx = MAX_DX * scale;
      const maxDy = MAX_DY * scale;
      pupils.forEach((el)=>{
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const dx = clamp(x-cx,-maxDx,maxDx);
        const dy = clamp(y-cy,-maxDy,maxDy);
        if(!el.classList.contains('blink')){
          el.style.transform = 'translate('+dx+'px, '+dy+'px)';
        }
        el.dataset.dx = dx;
        el.dataset.dy = dy;
      });
    }

    function onPointerMove(x,y){
      isPointerActive = true;
      applyLook(x,y);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(()=>{isPointerActive=false;},3500);
    }

    function idleGlance(){
      if(!isPointerActive){
        const badgeRect = badge.getBoundingClientRect();
        const scale = badgeRect.width / BASE_W;
        const maxDx = MAX_DX * scale;
        const maxDy = MAX_DY * scale;
        const dx = (Math.random()*2-1)*maxDx;
        const dy = (Math.random()*2-1)*maxDy;
        pupils.forEach((el)=>{
          el.style.transition = 'transform .9s ease-in-out';
          el.style.transform = 'translate('+dx+'px, '+dy+'px)';
          el.dataset.dx = dx;
          el.dataset.dy = dy;
          setTimeout(()=>{el.style.transition='transform .09s ease-out';},950);
        });
      }
    }

    function blink(){
      pupils.forEach((el)=>{
        const dx = el.dataset.dx || 0;
        const dy = el.dataset.dy || 0;
        el.style.transition = 'transform .09s ease-in-out';
        el.classList.add('blink');
        el.style.transform = 'translate('+dx+'px, '+dy+'px) scaleY(0.15)';
      });
      setTimeout(()=>{
        pupils.forEach((el)=>{
          const dx = el.dataset.dx || 0;
          const dy = el.dataset.dy || 0;
          el.classList.remove('blink');
          el.style.transform = 'translate('+dx+'px, '+dy+'px)';
        });
      },110);
      setTimeout(blink, 2600 + Math.random()*3200);
    }

    setInterval(idleGlance, 2800);
    idleGlance();
    setTimeout(blink, 1800 + Math.random()*800);

    instances.push({onPointerMove});
  });

  window.addEventListener('mousemove', (e)=>{
    instances.forEach((inst)=>inst.onPointerMove(e.clientX,e.clientY));
  });
  window.addEventListener('touchmove', (e)=>{
    if(e.touches && e.touches[0]){
      instances.forEach((inst)=>inst.onPointerMove(e.touches[0].clientX,e.touches[0].clientY));
    }
  },{passive:true});

})();
