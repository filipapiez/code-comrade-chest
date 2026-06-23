/* ============================================================
   SVG SCENE GENERATOR — stylized glass bathroom scenes
   ============================================================ */
function scene(opts){
  // opts: {phase:'before'|'after', layout:1-4}
  const after = opts.phase === 'after';
  const L = opts.layout || 1;
  const wall = after ? '#EAF0F1' : '#D9D2C9';
  const wall2 = after ? '#DCE5E7' : '#C8C0B5';
  const tile = after ? '#C9D6D9' : '#B6Ada1';
  const floor = after ? '#C2CDD0' : '#B0A89C';
  const glass = after ? 'rgba(120,205,214,0.30)' : 'rgba(150,150,150,0.30)';
  const glassEdge = after ? '#57C4D0' : '#9aa0a6';
  const chrome = after ? '#E8EEEF' : '#B9B7B2';
  const frame = after ? 'none' : '#8c8881';

  let fixtures = '';
  // common back wall tiling
  const tiles = `
    <rect x="0" y="0" width="800" height="600" fill="${wall}"/>
    <rect x="0" y="0" width="800" height="600" fill="url(#tileGrid${L}${after?'a':'b'})"/>
    <rect x="0" y="430" width="800" height="170" fill="${floor}"/>
    <rect x="0" y="425" width="800" height="6" fill="${after?'#aebabd':'#9b948a'}"/>`;

  if(L===1){ // frameless walk-in shower
    fixtures = `
      <!-- shower head -->
      <rect x="150" y="70" width="10" height="60" rx="3" fill="${chrome}"/>
      <ellipse cx="155" cy="135" rx="34" ry="11" fill="${chrome}"/>
      ${after?`<g opacity="0.5" stroke="#bfe7ec" stroke-width="2"><line x1="140" y1="150" x2="135" y2="250"/><line x1="155" y1="150" x2="155" y2="260"/><line x1="170" y1="150" x2="176" y2="250"/></g>`:''}
      <!-- niche -->
      <rect x="300" y="150" width="120" height="90" rx="4" fill="${wall2}" stroke="${after?'#a9b9bc':'#9b948a'}" stroke-width="2"/>
      <rect x="312" y="200" width="44" height="10" rx="3" fill="${after?'#7fb8c0':'#8c8881'}"/>
      <!-- glass panel -->
      <rect x="470" y="110" width="250" height="320" fill="${glass}" stroke="${glassEdge}" stroke-width="${after?'4':'3'}" rx="3"/>
      ${frame!=='none'?`<rect x="468" y="108" width="254" height="324" fill="none" stroke="${frame}" stroke-width="9" rx="4"/>`:''}
      <rect x="690" y="220" width="16" height="80" rx="6" fill="${chrome}"/>
      ${after?`<rect x="470" y="110" width="250" height="320" fill="url(#shine${L})" opacity="0.6"/>`:''}`;
  } else if(L===2){ // tub with glass door
    fixtures = `
      <rect x="120" y="300" width="420" height="130" rx="14" fill="${after?'#fff':'#efece6'}" stroke="${after?'#cdd9db':'#bdb6ab'}" stroke-width="3"/>
      <rect x="120" y="300" width="420" height="30" rx="14" fill="${after?'#eef4f5':'#e2ddd4'}"/>
      <rect x="150" y="80" width="9" height="55" rx="3" fill="${chrome}"/>
      <ellipse cx="154" cy="140" rx="30" ry="10" fill="${chrome}"/>
      <!-- glass tub door -->
      <rect x="150" y="150" width="360" height="180" fill="${glass}" stroke="${glassEdge}" stroke-width="${after?'4':'3'}" rx="3"/>
      ${frame!=='none'?`<rect x="148" y="148" width="364" height="184" fill="none" stroke="${frame}" stroke-width="8" rx="4"/><line x1="330" y1="150" x2="330" y2="330" stroke="${frame}" stroke-width="6"/>`:''}
      <rect x="560" y="200" width="14" height="70" rx="6" fill="${chrome}"/>
      ${after?`<rect x="150" y="150" width="360" height="180" fill="url(#shine${L})" opacity="0.55"/>`:''}`;
  } else if(L===3){ // custom corner / mirror glass
    fixtures = `
      <rect x="80" y="120" width="250" height="300" rx="6" fill="${after?'#dff0f2':'#cfc7bc'}" stroke="${after?'#b6d9dd':'#b1a99e'}" stroke-width="3"/>
      <rect x="100" y="140" width="210" height="260" rx="3" fill="${after?'rgba(150,220,228,0.25)':'rgba(140,140,140,0.2)'}"/>
      ${after?`<line x1="120" y1="160" x2="200" y2="380" stroke="#fff" stroke-width="10" opacity="0.4"/>`:''}
      <!-- corner glass panels -->
      <rect x="430" y="140" width="160" height="290" fill="${glass}" stroke="${glassEdge}" stroke-width="${after?'4':'3'}"/>
      <rect x="590" y="140" width="120" height="290" fill="${glass}" stroke="${glassEdge}" stroke-width="${after?'4':'3'}"/>
      ${frame!=='none'?`<rect x="428" y="138" width="284" height="294" fill="none" stroke="${frame}" stroke-width="9"/>`:''}
      <rect x="560" y="250" width="80" height="14" rx="6" fill="${chrome}"/>
      ${after?`<rect x="430" y="140" width="280" height="290" fill="url(#shine${L})" opacity="0.5"/>`:''}`;
  } else { // L4 large enclosure
    fixtures = `
      <rect x="120" y="80" width="9" height="60" rx="3" fill="${chrome}"/>
      <ellipse cx="124" cy="145" rx="32" ry="10" fill="${chrome}"/>
      <rect x="250" y="170" width="90" height="120" rx="4" fill="${wall2}" stroke="${after?'#a9b9bc':'#9b948a'}" stroke-width="2"/>
      <!-- two-panel enclosure -->
      <rect x="180" y="100" width="230" height="330" fill="${glass}" stroke="${glassEdge}" stroke-width="${after?'4':'3'}"/>
      <rect x="410" y="100" width="230" height="330" fill="${glass}" stroke="${glassEdge}" stroke-width="${after?'4':'3'}"/>
      ${frame!=='none'?`<rect x="178" y="98" width="464" height="334" fill="none" stroke="${frame}" stroke-width="8"/><line x1="410" y1="100" x2="410" y2="430" stroke="${frame}" stroke-width="6"/>`:''}
      <rect x="430" y="230" width="16" height="80" rx="6" fill="${chrome}"/>
      ${after?`<rect x="180" y="100" width="460" height="330" fill="url(#shine${L})" opacity="0.55"/>`:''}`;
  }

  return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="tileGrid${L}${after?'a':'b'}" width="80" height="80" patternUnits="userSpaceOnUse">
        <rect width="80" height="80" fill="none" stroke="${tile}" stroke-width="1.5" opacity="0.5"/>
      </pattern>
      <linearGradient id="shine${L}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff" stop-opacity="0.65"/>
        <stop offset="35%" stop-color="#fff" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${tiles}
    ${fixtures}
  </svg>`;
}

/* hero scene — premium frameless enclosure with light sweep */
const HERO_SVG = `
  <svg viewBox="0 0 520 580" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%">
    <defs>
      <linearGradient id="hwall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#EEF3F4"/><stop offset="100%" stop-color="#DCE4E6"/>
      </linearGradient>
      <linearGradient id="hglass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="rgba(120,205,214,0.34)"/>
        <stop offset="55%" stop-color="rgba(120,205,214,0.12)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.05)"/>
      </linearGradient>
      <linearGradient id="hsweep" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#fff" stop-opacity="0"/>
        <stop offset="50%" stop-color="#fff" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <pattern id="htile" width="64" height="64" patternUnits="userSpaceOnUse">
        <rect width="64" height="64" fill="none" stroke="#C5D2D4" stroke-width="1.4" opacity="0.6"/>
      </pattern>
    </defs>
    <rect width="520" height="580" fill="url(#hwall)"/>
    <rect width="520" height="580" fill="url(#htile)"/>
    <rect x="0" y="470" width="520" height="110" fill="#C7D1D3"/>
    <rect x="0" y="466" width="520" height="6" fill="#aebabd"/>
    <!-- shower head -->
    <rect x="120" y="60" width="10" height="64" rx="3" fill="#EAF0F1"/>
    <ellipse cx="125" cy="128" rx="38" ry="12" fill="#EAF0F1"/>
    <g opacity="0.55" stroke="#bfe7ec" stroke-width="2">
      <line x1="108" y1="142" x2="102" y2="300"/><line x1="125" y1="142" x2="125" y2="320"/>
      <line x1="142" y1="142" x2="150" y2="300"/><line x1="116" y1="142" x2="112" y2="280"/><line x1="134" y1="142" x2="138" y2="280"/>
    </g>
    <!-- niche -->
    <rect x="250" y="150" width="120" height="100" rx="5" fill="#D4DEE0" stroke="#A9B9BC" stroke-width="2"/>
    <rect x="264" y="205" width="46" height="10" rx="3" fill="#7fb8c0"/>
    <rect x="264" y="222" width="34" height="8" rx="3" fill="#9fc9cf"/>
    <!-- frameless glass panel -->
    <rect x="330" y="90" width="170" height="400" fill="url(#hglass)" stroke="#57C4D0" stroke-width="4" rx="3"/>
    <rect x="330" y="90" width="170" height="400" fill="url(#hsweep)" opacity="0.5">
      <animate attributeName="x" values="330;360;330" dur="6s" repeatCount="indefinite"/>
    </rect>
    <line x1="350" y1="110" x2="350" y2="470" stroke="#fff" stroke-width="6" opacity="0.35"/>
    <rect x="470" y="250" width="16" height="90" rx="7" fill="#EAF0F1"/>
  </svg>`;

const _hs=document.getElementById('heroScene'); if(_hs) _hs.innerHTML = HERO_SVG;
const _shs=document.getElementById('svcHeroScene'); if(_shs) _shs.innerHTML = HERO_SVG;

/* ============================================================
   SERVICES
   ============================================================ */
const ICN = {
  door:'<rect x="5" y="3" width="14" height="18" rx="1.5"/><circle cx="15.5" cy="12" r="1"/>',
  tub:'<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M5 12V7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2"/><path d="M8 7h3"/>',
  enclosure:'<rect x="3" y="4" width="8" height="16" rx="1"/><rect x="13" y="4" width="8" height="16" rx="1"/><line x1="11" y1="4" x2="11" y2="20"/>',
  custom:'<path d="M12 2 4 7v10l8 5 8-5V7z"/><path d="M12 2v20M4 7l8 5 8-5"/>',
  remodel:'<path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M9 21v-6h6v6"/>',
  replace:'<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>',
  mirror:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7l2 4 4-2"/>',
  rail:'<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/><line x1="6" y1="6" x2="6" y2="18"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="18" y1="6" x2="18" y2="18"/>',
  wine:'<path d="M8 3h8l-1 7a4 4 0 0 1-6 0z"/><path d="M12 13v6M9 21h6"/>',
  office:'<rect x="3" y="3" width="8" height="18" rx="1"/><rect x="13" y="3" width="8" height="18" rx="1"/>',
  more:'<circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>'
};
const services = [
  {ic:'door', t:'Shower Doors', d:'Frameless and semi-frameless glass shower doors that open clean, seal tight, and make any bathroom feel larger.'},
  {ic:'tub', t:'Tub Doors', d:'Sliding and pivoting tub doors that replace dated curtains with bright, easy-to-clean glass.'},
  {ic:'enclosure', t:'Shower Enclosures', d:'Full corner and three-panel enclosures engineered to your exact walls, slope, and tile.'},
  {ic:'custom', t:'Custom Shower Glass', d:'Made-to-measure glass cut, tempered, and finished to fit even the most unusual layouts.'},
  {ic:'remodel', t:'Bathroom Remodel Glass', d:'Glass that ties a full remodel together — coordinated with your tile, hardware, and lighting.'},
  {ic:'replace', t:'Replacement Glass', d:'Fast, precise replacement of cracked or cloudy panels without redoing the whole bathroom.'},
  {ic:'mirror', t:'Mirrors & Mirror Walls', d:'Frameless vanity mirrors, LED-backlit mirrors and full-wall mirror installations — measured and hung to fit.'},
  {ic:'rail', t:'Glass Railings', d:'Frameless and post-mounted glass stair, balcony and deck railings — ½″ tempered, code-compliant.'},
  {ic:'wine', t:'Wine & Cigar Rooms', d:'Sealed glass enclosures for wine cellars and cigar lounges — frameless or black-framed, climate-friendly.'},
  {ic:'office', t:'Office Partitions', d:'Frosted and clear glass partitions and sliding doors for home offices and commercial buildouts.'},
  {ic:'more', t:'Other Custom Glass', d:'Display shelves, glass-wrapped columns, rooftop railings and the one-off pieces that don\u2019t fit a category.'}
];
const SVC_LINKS={'Shower Doors':'shower-doors.html','Tub Doors':'tub-doors.html','Shower Enclosures':'shower-enclosures.html','Custom Shower Glass':'custom-shower-glass.html','Bathroom Remodel Glass':'bathroom-remodel-glass.html','Replacement Glass':'replacement-glass.html','Mirrors & Mirror Walls':'mirrors.html','Glass Railings':'glass-railings.html','Wine & Cigar Rooms':'wine-cigar-rooms.html','Office Partitions':'office-partitions.html','Other Custom Glass':'other-custom-glass.html'};
// Map gallery category → service page so clicking a tile opens the right service
const CAT_LINKS={'shower-doors':'shower-doors.html','sliding-doors':'shower-doors.html','tub-doors':'tub-doors.html','enclosures':'shower-enclosures.html','custom-glass':'custom-shower-glass.html','mirrors':'mirrors.html','railings':'glass-railings.html','wine-rooms':'wine-cigar-rooms.html','office':'office-partitions.html','other':'other-custom-glass.html'};
const _sg=document.getElementById('servicesGrid'); if(_sg) _sg.innerHTML = services.map((s,i)=>`
  <article class="svc" data-reveal data-delay="${(i%3)+1}">
    <div class="svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICN[s.ic]}</svg></div>
    <h3>${s.t}</h3>
    <p>${s.d}</p>
    <span class="more">Learn more <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
    <a class="svc-stretch" href="${SVC_LINKS[s.t]||'#contact'}" aria-label="${s.t}"></a>
  </article>`).join('');


// pointer-follow glow on service cards
document.querySelectorAll('.svc').forEach(card=>{
  card.addEventListener('pointermove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
});

/* ============================================================
   WHY
   ============================================================ */
const why = [
  {t:'Free Estimates', d:'In-home, no-obligation quotes with honest pricing.', ic:'<circle cx="12" cy="12" r="9" data-anim/><path d="M8 12h8M12 8v8"/>'},
  {t:'Flexible Scheduling', d:'Appointments and installs that work around your week.', ic:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4" data-anim/>'},
  {t:'Best Quality Materials', d:'Thick tempered safety glass and premium hardware.', ic:'<path d="M12 2 4 7v10l8 5 8-5V7z" data-anim/><path d="M12 2v20"/>'},
  {t:'Custom Measurements', d:'Every panel measured and cut to your exact space.', ic:'<path d="M3 17 17 3l4 4L7 21z"/><path d="M9 7l2 2M13 5l2 2M5 13l2 2" data-anim/>'},
  {t:'Professional Installation', d:'Clean, careful installs by experienced glass techs.', ic:'<path d="M14 7l3 3-9 9-4 1 1-4z"/><path d="M14 7l3-3 3 3-3 3z" data-anim/>'},
  {t:'Beautiful Modern Designs', d:'Frameless, minimal looks that elevate the whole room.', ic:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M9 9v11" data-anim/>'}
];
const _wg=document.getElementById('whyGrid'); if(_wg) _wg.innerHTML = why.map((w,i)=>`
  <div class="why-item" data-reveal data-delay="${(i%3)+1}">
    <div class="why-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${w.ic}</svg></div>
    <div><h3>${w.t}</h3><p>${w.d}</p></div>
  </div>`).join('');

/* ============================================================
   PHOTO GALLERY + LIGHTBOX (filterable)
   ============================================================ */
(function(){
  const grid=document.getElementById('galleryGrid');
  if(!grid) return;
  let items=window.MAKI_GALLERY||[];
  // On a service page (e.g. shower-enclosures.html), data-default-cat scopes the gallery to that service.
  const defaultCat=grid.getAttribute('data-default-cat')||'all';
  // On the homepage, show only ONE tile per category — each tile links to the matching service page for "see more".
  if(grid.hasAttribute('data-one-per-cat')){
    const seen=new Set();
    items=items.filter(p=>{ if(seen.has(p.cat)) return false; seen.add(p.cat); return true; });
  }
  grid.innerHTML=items.map((p,i)=>{
    const link=(window.CAT_LINKS||CAT_LINKS)[p.cat]||'#contact';
    return `
    <a class="tile" data-cat="${p.cat||''}" data-i="${i}" data-reveal data-delay="${(i%3)+1}" href="${link}" aria-label="See more ${p.catLabel||'projects'}: ${p.title}">
      <img class="g-img" src="${p.src}" alt="${p.alt||p.title}" loading="lazy">
      <span class="tile-overlay"><span class="cat">${p.catLabel||''}</span><span class="tile-title-wrap"><h4>${p.title}</h4><span class="tile-cta">See more ${p.catLabel||'projects'} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span></span>
    </a>`;
  }).join('');

  function applyFilter(f){
    const allowed=(f||'all').split(',').map(s=>s.trim());
    const showAll=allowed.includes('all');
    grid.querySelectorAll('.tile').forEach(t=>{
      const show=showAll||allowed.includes(t.dataset.cat);
      t.classList.toggle('hide',!show);
    });
  }

  // Auto-filter on service pages
  if(defaultCat!=='all') applyFilter(defaultCat);

  document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelector('.filter.active')?.classList.remove('active');
    btn.classList.add('active');applyFilter(btn.dataset.filter);
  }));
})();


/* ============================================================
   PROCESS
   ============================================================ */
const steps=[
  {t:'Contact Us',d:'Call or send a quick message with what you have in mind. We listen first.'},
  {t:'Free Estimate',d:'We visit your home, look at the space, and give honest, upfront pricing — no obligation.'},
  {t:'Custom Measurement',d:'Precise measurements ensure your glass fits perfectly the first time.'},
  {t:'Professional Installation',d:'Our techs install carefully and clean up completely when they leave.'},
  {t:'Enjoy Your New Bathroom',d:'Step into a cleaner, brighter, more comfortable space built to last.'}
];
const _tl=document.getElementById('timeline'); if(_tl) _tl.innerHTML=steps.map((s,i)=>`
  <div class="step" data-reveal>
    <div class="dot">${i+1}</div>
    <h3>${s.t}</h3>
    <p>${s.d}</p>
  </div>`).join('');

/* ============================================================
   FAQ
   ============================================================ */
const faqs=window.MAKI_FAQS||[
  {q:'Do you offer free estimates?',a:'Yes. Every estimate is free and comes with no obligation. We measure your space and give you clear pricing before any work begins.'},
  {q:'What type of glass do you use?',a:'We use thick tempered safety glass with premium hardware, so your shower doors and enclosures are both beautiful and built to last.'},
  {q:'Can you match an unusual or custom layout?',a:'Absolutely. Custom shower glass is one of our specialties — we cut and finish each panel to fit your exact walls, slope, and tile.'},
  {q:'Do you handle remodels, new construction, and replacements?',a:'All three. Whether you are upgrading one shower door or coordinating glass for a full remodel, we tailor the work to your project.'},
  {q:'How long does installation take?',a:'Most standard shower door and tub door installs are completed in a single visit once your custom glass is ready. We confirm timing during your estimate.'}
];
const _fl=document.getElementById('faqList'); if(_fl) _fl.innerHTML=faqs.map((f,i)=>`
  <div class="faq-item">
    <button class="faq-q" aria-expanded="false" aria-controls="fa-${i}">${f.q}<span class="pm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></span></button>
    <div class="faq-a" id="fa-${i}"><p>${f.a}</p></div>
  </div>`).join('');
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item=q.parentElement, ans=item.querySelector('.faq-a'), open=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o=>{o.classList.remove('open');o.querySelector('.faq-q').setAttribute('aria-expanded','false');o.querySelector('.faq-a').style.maxHeight=null;});
    if(!open){item.classList.add('open');q.setAttribute('aria-expanded','true');ans.style.maxHeight=ans.scrollHeight+'px';}
  });
});

/* ============================================================
   NAV / MENU / SCROLL
   ============================================================ */
const nav=document.getElementById('nav');
const onScroll=()=>nav.classList.toggle('scrolled',window.scrollY>30);
onScroll();window.addEventListener('scroll',onScroll,{passive:true});

const burger=document.getElementById('burger');
const menu=document.getElementById('mobileMenu');
burger.addEventListener('click',()=>{
  const open=burger.classList.toggle('open');menu.classList.toggle('open',open);
  burger.setAttribute('aria-expanded',open);document.body.style.overflow=open?'hidden':'';
});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  burger.classList.remove('open');menu.classList.remove('open');document.body.style.overflow='';
}));

// smooth scroll with nav offset
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id.length<2)return;
    const el=document.querySelector(id);
    if(el){e.preventDefault();const y=el.getBoundingClientRect().top+window.scrollY-72;window.scrollTo({top:y,behavior:'smooth'});}
  });
});

/* ============================================================
   FLOATING CALL
   ============================================================ */
const fc=document.getElementById('floatCall');
document.getElementById('floatToggle').addEventListener('click',()=>{
  const open=fc.classList.toggle('open');
  document.getElementById('floatToggle').setAttribute('aria-expanded',open);
});
document.addEventListener('click',e=>{if(!fc.contains(e.target))fc.classList.remove('open');});

/* ============================================================
   REVEAL + TIMELINE OBSERVERS
   ============================================================ */
const io=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));

const stepIo=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{if(en.isIntersecting)en.target.classList.add('in');});
},{threshold:0.4});
document.querySelectorAll('.step').forEach(el=>stepIo.observe(el));

/* ============================================================
   FORM VALIDATION
   ============================================================ */
const form=document.getElementById('estimateForm');
const success=document.getElementById('formSuccess');
function setErr(id,bad){document.getElementById(id).classList.toggle('invalid',bad);return !bad;}
form.addEventListener('submit',e=>{
  e.preventDefault();
  const name=form.name.value.trim();
  const phone=form.phone.value.replace(/[^\d]/g,'');
  const email=form.email.value.trim();
  const project=form.project.value;
  const message=form.message.value.trim();
  let ok=true;
  ok&=setErr('f-name',name.length<2);
  ok&=setErr('f-phone',phone.length<10);
  ok&=setErr('f-email',!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  ok&=setErr('f-project',!project);
  ok&=setErr('f-message',message.length<5);
  if(ok){
    form.style.display='none';
    success.classList.add('show');
    success.scrollIntoView({behavior:'smooth',block:'center'});
  }else{
    form.querySelector('.field.invalid input,.field.invalid select,.field.invalid textarea')?.focus();
  }
});
// clear error on input
form.querySelectorAll('input,select,textarea').forEach(el=>{
  el.addEventListener('input',()=>el.closest('.field').classList.remove('invalid'));
});

/* ============================================================
   GLASS STUDIO — live enclosure configurator
   ============================================================ */
(function(){
  const STYLES=[
    {id:'frameless',label:'Frameless'},
    {id:'semi',label:'Semi-Frameless'},
    {id:'sliding',label:'Sliding Bypass'},
    {id:'pivot',label:'Pivot Door'},
    {id:'corner',label:'Corner Enclosure'},
    {id:'tub',label:'Tub Door'},
    {id:'walkin',label:'Walk-In Panel'}
  ];
  const GLASS=[
    {id:'clear',label:'Clear',sw:'linear-gradient(135deg,rgba(123,202,212,.35),rgba(255,255,255,.6))'},
    {id:'lowiron',label:'Low-Iron',sw:'linear-gradient(135deg,rgba(150,220,228,.32),rgba(255,255,255,.78))'},
    {id:'frosted',label:'Frosted',sw:'linear-gradient(135deg,#eef3f4,#dde7e9)'},
    {id:'rain',label:'Rain Textured',sw:'repeating-linear-gradient(115deg,rgba(123,202,212,.45) 0 3px,rgba(255,255,255,.55) 3px 7px)'},
    {id:'reeded',label:'Reeded',sw:'repeating-linear-gradient(90deg,rgba(123,202,212,.5) 0 4px,rgba(255,255,255,.6) 4px 8px)'},
    {id:'bronze',label:'Bronze Tint',sw:'linear-gradient(135deg,rgba(150,110,66,.55),rgba(214,184,150,.4))'},
    {id:'grey',label:'Grey Tint',sw:'linear-gradient(135deg,rgba(96,104,110,.55),rgba(200,205,208,.4))'},
    {id:'satin',label:'Satin',sw:'linear-gradient(135deg,#f1f4f5,#e0e8e9)'}
  ];
  const HW=[
    {id:'chrome',label:'Polished Chrome',sw:'linear-gradient(135deg,#eef2f3,#b9c2c4 60%,#dfe5e6)',base:'#C7CFD1',hi:'#F1F5F6'},
    {id:'nickel',label:'Brushed Nickel',sw:'linear-gradient(135deg,#dcdcd6,#aeafa8 60%,#cdcdc6)',base:'#B4B5AE',hi:'#D9DAD3'},
    {id:'black',label:'Matte Black',sw:'linear-gradient(135deg,#33383b,#16191b)',base:'#23282B',hi:'#3c4347'},
    {id:'brass',label:'Brushed Brass',sw:'linear-gradient(135deg,#e3cc85,#b8932f 60%,#d9bd6a)',base:'#C2A24E',hi:'#E6CF88'},
    {id:'bronze',label:'Oil-Rubbed Bronze',sw:'linear-gradient(135deg,#6a5848,#3a2f26 60%,#574a3d)',base:'#473A30',hi:'#6c5a4a'}
  ];
  const THICK=['⅜″','½″'];
  const GLASSSVG={
    clear:{fill:'rgba(123,202,212,.16)',edge:'#57C4D0',pat:null},
    lowiron:{fill:'rgba(150,220,228,.10)',edge:'#7fd0d9',pat:null},
    frosted:{fill:'rgba(244,248,249,.80)',edge:'#bcd6da',pat:'frost'},
    rain:{fill:'rgba(150,205,212,.30)',edge:'#57C4D0',pat:'rain'},
    reeded:{fill:'rgba(150,205,212,.26)',edge:'#57C4D0',pat:'reeded'},
    bronze:{fill:'rgba(150,110,66,.32)',edge:'#9c7a4e',pat:null},
    grey:{fill:'rgba(96,104,110,.34)',edge:'#7c858b',pat:null},
    satin:{fill:'rgba(240,244,245,.62)',edge:'#c4d3d6',pat:'frost'}
  };

  const state={style:'frameless',glass:'clear',hardware:'chrome',thickness:'⅜″'};

  const $style=document.getElementById('stStyle');
  const $glass=document.getElementById('stGlass');
  const $hw=document.getElementById('stHardware');
  const $thick=document.getElementById('stThick');
  const $preview=document.getElementById('stPreview');
  const $summary=document.getElementById('stSummary');
  if(!$style) return;

  $style.innerHTML=STYLES.map(s=>`<button class="opt${s.id===state.style?' active':''}" data-v="${s.id}">${s.label}</button>`).join('');
  $glass.innerHTML=GLASS.map(g=>`<button class="swatch${g.id===state.glass?' active':''}" data-v="${g.id}" data-tip="${g.label}" style="background:${g.sw}" aria-label="${g.label}"></button>`).join('');
  $hw.innerHTML=HW.map(h=>`<button class="swatch${h.id===state.hardware?' active':''}" data-v="${h.id}" data-tip="${h.label}" style="background:${h.sw}" aria-label="${h.label}"></button>`).join('');
  $thick.innerHTML=THICK.map(t=>`<button class="${t===state.thickness?'active':''}" data-v="${t}">${t}</button>`).join('');

  function bind(container,key){
    container.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
      container.querySelector('.active')?.classList.remove('active');
      b.classList.add('active');state[key]=b.dataset.v;render();
    }));
  }
  bind($style,'style');bind($glass,'glass');bind($hw,'hardware');bind($thick,'thickness');

  function metalDefs(h){
    return `<linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${h.hi}"/><stop offset="50%" stop-color="${h.base}"/><stop offset="100%" stop-color="${h.hi}"/></linearGradient>`;
  }
  function glassPatDefs(){
    return `
    <pattern id="frost" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="rgba(255,255,255,.35)"/><circle cx="2" cy="2" r="1" fill="rgba(255,255,255,.6)"/><circle cx="5" cy="5" r="1" fill="rgba(255,255,255,.5)"/></pattern>
    <pattern id="reeded" width="14" height="10" patternUnits="userSpaceOnUse"><rect width="7" height="10" fill="rgba(255,255,255,.18)"/><rect x="7" width="7" height="10" fill="rgba(14,17,19,.05)"/></pattern>
    <pattern id="rain" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(8)"><path d="M0 11 Q5.5 6 11 11 T22 11" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/><path d="M0 22 Q5.5 17 11 22 T22 22" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/></pattern>`;
  }
  // glass panel helper
  function panel(x,y,w,h,g,edgeW){
    let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${g.fill}" rx="2"/>`;
    if(g.pat) s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${g.pat})" rx="2"/>`;
    s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#gshine)" opacity="0.5" rx="2"/>`;
    s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${g.edge}" stroke-width="${edgeW}" rx="2"/>`;
    return s;
  }
  const M='url(#metal)';

  function render(){
    const g=GLASSSVG[state.glass];
    const h=HW.find(x=>x.id===state.hardware);
    const ew=state.thickness==='½″'?5:3.5;
    let fx='';
    const handle=(x,y,hh)=>`<rect x="${x}" y="${y}" width="9" height="${hh}" rx="4.5" fill="${M}"/><rect x="${x+1.5}" y="${y}" width="2" height="${hh}" rx="1" fill="rgba(255,255,255,.45)"/>`;
    const hinge=(x,y)=>`<rect x="${x}" y="${y}" width="20" height="26" rx="3" fill="${M}"/>`;
    const clamp=(x,y)=>`<rect x="${x}" y="${y}" width="22" height="18" rx="3" fill="${M}"/>`;

    if(state.style==='frameless'){
      fx+=panel(250,70,300,388,g,ew);
      fx+=clamp(239,118)+clamp(239,392);
      fx+=handle(536,238,96);
    }else if(state.style==='semi'){
      fx+=`<rect x="246" y="66" width="308" height="396" fill="${M}" rx="4"/>`;
      fx+=panel(254,74,292,380,g,ew);
      fx+=handle(536,238,96);
    }else if(state.style==='sliding'){
      fx+=`<rect x="196" y="66" width="372" height="22" rx="6" fill="${M}"/>`;
      fx+=`<rect x="196" y="452" width="372" height="10" rx="4" fill="${M}"/>`;
      fx+=panel(206,90,210,358,g,ew);
      fx+=handle(398,236,90);
      fx+=panel(356,90,210,358,g,ew);
      fx+=handle(372,236,90);
    }else if(state.style==='pivot'){
      fx+=panel(250,70,300,388,g,ew);
      fx+=`<circle cx="270" cy="78" r="11" fill="${M}"/><circle cx="270" cy="450" r="11" fill="${M}"/>`;
      fx+=handle(536,238,96);
    }else if(state.style==='corner'){
      fx+=panel(150,80,180,378,g,ew);
      fx+=`<rect x="332" y="74" width="12" height="390" fill="${M}"/>`;
      fx+=panel(348,80,206,378,g,ew);
      fx+=handle(538,238,96);
    }else if(state.style==='tub'){
      fx+=`<rect x="170" y="356" width="392" height="120" rx="12" fill="#eef3f4" stroke="#cdd9db" stroke-width="3"/><rect x="170" y="356" width="392" height="26" rx="12" fill="#e3eaeb"/>`;
      fx+=`<rect x="188" y="118" width="356" height="20" rx="6" fill="${M}"/>`;
      fx+=panel(198,140,178,222,g,ew);
      fx+=handle(360,210,80);
      fx+=panel(348,140,178,222,g,ew);
      fx+=handle(364,210,80);
    }else if(state.style==='walkin'){
      fx+=panel(286,70,250,400,g,ew);
      fx+=`<rect x="536" y="150" width="92" height="9" rx="4.5" fill="${M}"/><circle cx="630" cy="154.5" r="7" fill="${M}"/>`;
      fx+=`<rect x="300" y="80" width="6" height="380" fill="rgba(255,255,255,.3)"/>`;
    }

    $preview.innerHTML=`<svg viewBox="0 0 680 520" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        ${metalDefs(h)}${glassPatDefs()}
        <linearGradient id="wallg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#EEF3F4"/><stop offset="100%" stop-color="#DDE5E7"/></linearGradient>
        <linearGradient id="gshine" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fff" stop-opacity=".55"/><stop offset="40%" stop-color="#fff" stop-opacity=".04"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <pattern id="wtile" width="56" height="56" patternUnits="userSpaceOnUse"><rect width="56" height="56" fill="none" stroke="#C8D4D6" stroke-width="1.3" opacity=".6"/></pattern>
      </defs>
      <rect width="680" height="520" fill="url(#wallg)"/>
      <rect width="680" height="520" fill="url(#wtile)"/>
      <rect x="0" y="470" width="680" height="50" fill="#C6D0D2"/><rect x="0" y="466" width="680" height="5" fill="#aebabd"/>
      <rect x="96" y="56" width="9" height="52" rx="3" fill="${M}"/><ellipse cx="100" cy="112" rx="30" ry="10" fill="${M}"/>
      <rect x="600" y="150" width="60" height="86" rx="5" fill="#D4DEE0" stroke="#A9B9BC" stroke-width="2"/>
      ${fx}
    </svg>`;

    const styleLabel=STYLES.find(s=>s.id===state.style).label;
    const glassLabel=GLASS.find(x=>x.id===state.glass).label;
    const hwLabel=HW.find(x=>x.id===state.hardware).label;
    $summary.innerHTML=`
      <div class="sum-item"><div class="k">Style</div><div class="v">${styleLabel}</div></div>
      <div class="sum-item"><div class="k">Glass</div><div class="v">${glassLabel}</div></div>
      <div class="sum-item"><div class="k">Hardware</div><div class="v">${hwLabel}</div></div>
      <div class="sum-item"><div class="k">Thickness</div><div class="v">${state.thickness}</div></div>`;
  }
  render();

  // Surprise me
  document.getElementById('stSurprise').addEventListener('click',()=>{
    const pick=(arr)=>arr[Math.floor(Math.random()*arr.length)];
    state.style=pick(STYLES).id;state.glass=pick(GLASS).id;state.hardware=pick(HW).id;state.thickness=pick(THICK);
    $style.querySelector('.active')?.classList.remove('active');$style.querySelector(`[data-v="${state.style}"]`).classList.add('active');
    $glass.querySelector('.active')?.classList.remove('active');$glass.querySelector(`[data-v="${state.glass}"]`).classList.add('active');
    $hw.querySelector('.active')?.classList.remove('active');$hw.querySelector(`[data-v="${state.hardware}"]`).classList.add('active');
    $thick.querySelector('.active')?.classList.remove('active');$thick.querySelector(`[data-v="${state.thickness}"]`).classList.add('active');
    render();
  });

  // Request this look -> prefill contact form + scroll
  document.getElementById('stRequest').addEventListener('click',()=>{
    const styleLabel=STYLES.find(s=>s.id===state.style).label;
    const glassLabel=GLASS.find(x=>x.id===state.glass).label;
    const hwLabel=HW.find(x=>x.id===state.hardware).label;
    const f=document.getElementById('estimateForm');
    if(f){
      f.project.value='Custom Shower Glass';
      f.message.value=`I designed a look in the Glass Studio I'd like a quote on:\n• Style: ${styleLabel}\n• Glass: ${glassLabel}\n• Hardware: ${hwLabel}\n• Thickness: ${state.thickness}`;
      f.project.closest('.field')?.classList.remove('invalid');
      f.message.closest('.field')?.classList.remove('invalid');
    }
    const el=document.getElementById('contact');
    const y=el.getBoundingClientRect().top+window.scrollY-72;
    window.scrollTo({top:y,behavior:'smooth'});
    setTimeout(()=>{document.getElementById('name')?.focus();},650);
  });
})();
