// Generates city landing pages from CITIES data.
// Run: bun scripts/build-city-pages.ts

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

type Project = { title: string; body: string };
type Neighborhood = { name: string; body: string };
type FAQ = { q: string; a: string };
type City = {
  slug: string; // e.g. "schaumburg-il"
  name: string; // "Schaumburg"
  state: string; // "Illinois"
  stateAbbr: string; // "IL"
  heroImage: string; // images/...jpg
  heroImageAlt: string;
  metaDescription: string;
  ogImage: string;
  intro: string; // hero lede
  whyTitle: string;
  whyParagraphs: string[];
  neighborhoods: Neighborhood[];
  projects: Project[];
  trendsTitle: string;
  trendsParagraphs: string[]; // may contain html
  faqs: FAQ[];
  contactBlurb: string;
};

const BASE = "https://www.makibakiglass.com";

const css = `
<style>
.prose{color:var(--steel);font-size:1.02rem;line-height:1.75}
.prose p{margin:0 0 1.1rem;max-width:68ch}
.prose a{color:var(--glass-deep);text-decoration:underline;text-underline-offset:3px}
.proj-card{display:flex;flex-direction:column;gap:.5rem}
.proj-num{font-family:var(--display);font-size:.78rem;color:var(--glass-deep);font-weight:600;letter-spacing:.12em;text-transform:uppercase}
.proj-card h3{margin:0;font-size:1.15rem;font-weight:600;letter-spacing:-.01em}
.proj-card p{margin:0;color:var(--steel);font-size:.97rem;line-height:1.65}
.hood-card h3{margin:0 0 .35rem;font-size:1.05rem;font-weight:600}
.hood-card p{margin:0;color:var(--steel);font-size:.93rem;line-height:1.55}
.faq-list{display:flex;flex-direction:column;border-top:1px solid rgba(14,17,19,.08)}
.faq-item{border-bottom:1px solid rgba(14,17,19,.08);padding:1.2rem 0}
.faq-item summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:1rem;font-weight:500;font-size:1.05rem;color:var(--ink)}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary::after{content:"+";font-family:var(--display);font-size:1.6rem;line-height:1;color:var(--glass-deep);transition:transform .25s ease;flex-shrink:0}
.faq-item[open] summary::after{transform:rotate(45deg)}
.faq-item p{margin:.85rem 0 0;color:var(--steel);line-height:1.7;max-width:68ch}
.disclaimer{font-style:italic;color:var(--steel);font-size:.93rem;padding:1rem 1.2rem;border-left:3px solid var(--glass-deep);background:rgba(87,196,208,.06);border-radius:6px;margin:0 0 2rem}
.band-mist{background:var(--mist)}
.city-grid-2{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}
.city-grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px}
.cta-band{background:linear-gradient(135deg,var(--ink),#1a1f23);color:#fff;border-radius:20px;padding:clamp(32px,5vw,56px);text-align:center}
.cta-band h2{color:#fff;font-size:clamp(1.8rem,3.6vw,2.6rem);margin:0 0 .8rem}
.cta-band p{color:rgba(255,255,255,.7);margin:0 auto 1.6rem;max-width:48ch}
.cta-band .btn-outline{border-color:rgba(255,255,255,.4);color:#fff}
.cta-band .btn-outline:hover{background:rgba(255,255,255,.1);color:#fff}
@media(max-width:640px){.proj-card h3{font-size:1.05rem}}
</style>`;

function nav() {
  return `<nav class="nav" id="nav">
  <div class="wrap">
    <a href="index.html" class="brand" aria-label="Makibaki home">
      <svg class="mark" viewBox="0 0 40 40" fill="none" aria-hidden="true"><rect x="3" y="3" width="34" height="34" rx="9" fill="#0E1113"/><rect x="9" y="9" width="9.5" height="22" rx="2.5" fill="#57C4D0" opacity="0.9"/><rect x="21.5" y="9" width="9.5" height="22" rx="2.5" fill="#fff" opacity="0.85"/><rect x="9" y="9" width="22" height="22" rx="2.5" stroke="#fff" stroke-opacity="0.4"/></svg>
      Makibaki
    </a>
    <div class="nav-links">
      <a href="index.html#services">Services</a>
      <a href="shower-doors.html">Shower Doors</a>
      <a href="index.html#areas">Areas</a>
      <a href="#contact">Contact</a>
    </div>
    <div class="nav-cta">
      <a href="tel:+12244279199" class="nav-phone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>224-427-9199</a>
      <a href="#contact" class="btn btn-primary">Get Free Estimate</a>
    </div>
  </div>
</nav>`;
}

function footer() {
  return `<footer>
  <div class="wrap">
    <div class="foot-top">
      <div>
        <div class="foot-brand"><svg class="mark" viewBox="0 0 40 40" fill="none" aria-hidden="true"><rect x="3" y="3" width="34" height="34" rx="9" fill="#fff" opacity="0.06"/><rect x="9" y="9" width="9.5" height="22" rx="2.5" fill="#57C4D0" opacity="0.9"/><rect x="21.5" y="9" width="9.5" height="22" rx="2.5" fill="#fff" opacity="0.7"/><rect x="9" y="9" width="22" height="22" rx="2.5" stroke="#fff" stroke-opacity="0.3"/></svg> Makibaki</div>
        <p class="foot-tag">Premium Shower Doors &bull; Tub Doors &bull; Shower Enclosures &bull; Custom Glass<br>Deerfield, IL</p>
      </div>
      <div class="foot-col">
        <h4>Services</h4>
        <a href="shower-doors.html">Shower Doors</a>
        <a href="tub-doors.html">Tub Doors</a>
        <a href="shower-enclosures.html">Shower Enclosures</a>
        <a href="custom-shower-glass.html">Custom Shower Glass</a>
        <a href="bathroom-remodel-glass.html">Bathroom Remodel Glass</a>
        <a href="replacement-glass.html">Replacement Glass</a>
      </div>
      <div class="foot-col">
        <h4>Guides</h4>
        <a href="frameless-vs-semi-frameless-shower-doors.html">Frameless vs Semi-Frameless</a>
      </div>
      <div class="foot-col">
        <h4>Contact</h4>
        <a href="tel:+12244279199">224-427-9199</a>
        <a href="tel:+12245095420">224-509-5420</a>
        <p>Deerfield, IL</p>
      </div>
    </div>
    <div class="foot-bottom"><span>&copy; <span id="year"></span> Makibaki. All rights reserved.</span></div>
  </div>
</footer>
<script>document.getElementById('year').textContent=new Date().getFullYear();</script>`;
}

function relatedGrid() {
  return `<section class="band">
  <div class="wrap">
    <div class="sec-head center" data-reveal><span class="eyebrow">All Services</span><h2>What we install locally</h2></div>
    <div class="related-grid">
      <a class="related-card" href="shower-doors.html" style="--card-img:url('images/frameless-marble-black.jpg')"><span class="rc-img" aria-hidden="true"></span><span class="rc-body"><span class="rc-text"><span class="rc-title">Shower Doors</span><span class="rc-sub">Frameless &amp; semi-frameless</span></span><span class="rc-arrow" aria-hidden="true">→</span></span></a>
      <a class="related-card" href="shower-enclosures.html" style="--card-img:url('images/enclosure-travertine-walkin.jpg')"><span class="rc-img" aria-hidden="true"></span><span class="rc-body"><span class="rc-text"><span class="rc-title">Shower Enclosures</span><span class="rc-sub">Walk-in &amp; corner</span></span><span class="rc-arrow" aria-hidden="true">→</span></span></a>
      <a class="related-card" href="tub-doors.html" style="--card-img:url('images/tubdoor-brass.jpg')"><span class="rc-img" aria-hidden="true"></span><span class="rc-body"><span class="rc-text"><span class="rc-title">Tub Doors</span><span class="rc-sub">Glass over standard tubs</span></span><span class="rc-arrow" aria-hidden="true">→</span></span></a>
      <a class="related-card" href="custom-shower-glass.html" style="--card-img:url('images/custom-herringbone-walkin.jpg')"><span class="rc-img" aria-hidden="true"></span><span class="rc-body"><span class="rc-text"><span class="rc-title">Custom Shower Glass</span><span class="rc-sub">Made-to-measure</span></span><span class="rc-arrow" aria-hidden="true">→</span></span></a>
    </div>
  </div>
</section>`;
}

function render(c: City): string {
  const url = `${BASE}/shower-doors-${c.slug}.html`;
  const fullTitle = `Shower Doors in ${c.name}, ${c.stateAbbr} — Frameless &amp; Custom Glass | Makibaki`;

  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Shower Doors", item: `${BASE}/shower-doors.html` },
      { "@type": "ListItem", position: 3, name: `${c.name}, ${c.stateAbbr}`, item: url },
    ],
  });

  const serviceJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Shower Door Installation",
    name: `Shower Doors in ${c.name}, ${c.stateAbbr}`,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: "Makibaki",
      telephone: "+1-224-427-9199",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Deerfield",
        addressRegion: "IL",
        addressCountry: "US",
      },
    },
    areaServed: { "@type": "City", name: c.name },
    url,
  });

  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${fullTitle}</title>
<meta name="description" content="${c.metaDescription}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
<link rel="canonical" href="${url}" />
<meta name="geo.region" content="US-${c.stateAbbr}" />
<meta name="geo.placename" content="${c.name}, ${c.state}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="Makibaki" />
<meta property="og:title" content="${fullTitle}" />
<meta property="og:description" content="${c.metaDescription}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${BASE}/${c.ogImage}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Shower Doors in ${c.name}, ${c.stateAbbr} | Makibaki" />
<meta name="twitter:description" content="${c.metaDescription}" />
<meta name="twitter:image" content="${BASE}/${c.ogImage}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="assets/styles.css" />
${css}
<script type="application/ld+json">${serviceJsonLd}</script>
<script type="application/ld+json">${breadcrumbJsonLd}</script>
<script type="application/ld+json">${faqJsonLd}</script>
</head>
<body>
${nav()}

<header class="hero band">
  <div class="hero-bg"></div>
  <div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span class="sep">/</span><a href="shower-doors.html">Shower Doors</a><span class="sep">/</span><span class="here">${c.name}, ${c.stateAbbr}</span></nav>
    <div class="hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">${c.name}, ${c.state}</span>
        <h1>Shower Doors &amp; <span class="accent">Custom Glass in ${c.name}</span></h1>
        <p class="lede">${c.intro}</p>
        <div class="hero-actions">
          <a href="#contact" class="btn btn-primary">Get a Free Estimate</a>
          <a href="tel:+12244279199" class="btn btn-outline">Call 224-427-9199</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="glass-stage">
          <img class="g-img" src="${c.heroImage}" alt="${c.heroImageAlt}" fetchpriority="high" onerror="this.remove()">
        </div>
      </div>
    </div>
  </div>
</header>

<section class="band">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Why Local Matters</span><h2>${c.whyTitle}</h2></div>
    <div class="prose" style="max-width:68ch">${c.whyParagraphs.map((p) => `<p>${p}</p>`).join("")}</div>
  </div>
</section>

<section class="band band-mist">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Neighborhoods</span><h2>Where we install glass in ${c.name}</h2><p>A short tour of the pockets we work in most often.</p></div>
    <div class="services-grid city-grid-2">
      ${c.neighborhoods
        .map(
          (n) => `<article class="svc hood-card"><h3>${n.name}</h3><p>${n.body}</p></article>`,
        )
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Recent Work</span><h2>Projects in &amp; around ${c.name}</h2><p>A sample of the kinds of installs we do locally.</p></div>
    <p class="disclaimer">The projects below are representative of the work we do in ${c.name}. For current photos and references in your specific neighborhood, call us at <a href="tel:+12244279199" style="color:var(--glass-deep)">224-427-9199</a> and we'll share a current portfolio at your estimate.</p>
    <div class="services-grid city-grid-3">
      ${c.projects
        .map(
          (p, i) =>
            `<article class="svc proj-card"><span class="proj-num">Project 0${i + 1}</span><h3>${p.title}</h3><p>${p.body}</p></article>`,
        )
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="band band-mist">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Trends</span><h2>${c.trendsTitle}</h2></div>
    <div class="prose" style="max-width:68ch">${c.trendsParagraphs.map((p) => `<p>${p}</p>`).join("")}</div>
  </div>
</section>

<section class="band">
  <div class="wrap" style="max-width:820px">
    <div class="sec-head"><span class="eyebrow">FAQs</span><h2>${c.name} shower-door questions</h2></div>
    <div class="faq-list">
      ${c.faqs
        .map(
          (f) =>
            `<details class="faq-item"><summary>${f.q}</summary><p>${f.a}</p></details>`,
        )
        .join("\n      ")}
    </div>
  </div>
</section>

${relatedGrid()}

<section id="contact" class="band">
  <div class="wrap">
    <div class="cta-band">
      <span class="eyebrow" style="color:rgba(255,255,255,.6);justify-content:center;display:inline-flex">${c.name}, ${c.stateAbbr}</span>
      <h2>Get a free estimate in ${c.name}</h2>
      <p>${c.contactBlurb}</p>
      <div class="hero-actions" style="justify-content:center">
        <a href="tel:+12244279199" class="btn btn-accent">Call 224-427-9199</a>
        <a href="tel:+12245095420" class="btn btn-outline">Call 224-509-5420</a>
      </div>
    </div>
  </div>
</section>

${footer()}
</body>
</html>
`;
}

// ============================================================
// CITIES DATA — Batch 1 (5 cities)
// ============================================================
const CITIES: City[] = [
  {
    slug: "deerfield-il",
    name: "Deerfield",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/frameless-marble-bench.jpg",
    heroImageAlt: "Frameless glass shower door installed by Makibaki in a Deerfield, IL bathroom",
    ogImage: "images/frameless-marble-bench.jpg",
    metaDescription: "Custom shower doors, enclosures and glass installed across Deerfield, IL — from Coromandel to Kings Cove. Free in-home estimates, 224-427-9199.",
    intro: "Makibaki is headquartered right here in Deerfield, and this is the town where we know every street corner. From the mid-century homes along Wilmot Road to the newer construction near Riverwoods Road, we've measured, fabricated and installed shower glass in hundreds of Deerfield baths — usually within a few miles of our shop.",
    whyTitle: "Why Deerfield homeowners call us first",
    whyParagraphs: [
      "Deerfield's housing stock spans a wide range. The 1950s and '60s ranches and split-levels east of the train tracks are on their second or third bath remodel by now, often with original walls that have settled an inch or more out of plumb. The newer custom homes west toward Riverwoods and around Briarwood are typically squarer, but tend to come with oversized master baths that need careful engineering — long fixed panels, steam-rated assemblies, or multi-panel walk-ins with no header.",
      "Because we're local, we know which Deerfield subdivisions tend to surprise us. The bath above the garage in a 1962 Coromandel ranch will measure differently top-to-bottom than it does side-to-side, and the curb in a newer Kings Cove townhome is almost always a half-inch low — both things we account for at the measure, not as a 'change order' on install day. Living in town also means we're usually back within a day if anything ever needs an adjustment.",
    ],
    neighborhoods: [
      { name: "Coromandel & East Deerfield", body: "1950s-60s ranches and split-levels with original baths hitting their second remodel. Frameless inline panels are the most common request — they make the older footprints feel modern without a structural change." },
      { name: "Kings Cove & South Deerfield", body: "1970s and '80s homes with mid-sized master baths. Most projects here are tub-to-shower conversions or fully frameless replacements of original framed doors." },
      { name: "Briarwood & West Deerfield", body: "Newer custom homes with generous master baths. Multi-panel walk-ins, 90-degree returns and steam enclosures are the norm in this pocket." },
      { name: "Downtown Deerfield", body: "Mix of original homes near the train station and newer infill. Lots of luxury frameless with brushed gold or matte black hardware, often paired with full-height mirrors on the same project." },
      { name: "Near Riverwoods Road", body: "Larger lots, larger baths. We see the most ½″ glass and true walk-in enclosure work in this part of town." },
    ],
    projects: [
      { title: "Frameless walk-in, Coromandel ranch remodel", body: "A homeowner off Wilmot had torn out the original 1961 tub and rebuilt the alcove as a 60″ curbless walk-in. We installed a ½″ low-iron glass panel with a 24″ fixed return and a single matte-black wall clamp — no header, no door. Low-iron was the right call; standard tempered would have read green against the warm porcelain tile." },
      { title: "Sliding enclosure over alcove tub, Kings Cove townhome", body: "A guest bath near Deerfield Road had a standard 60″ alcove tub the owners weren't ready to rip out. They wanted to retire the fabric curtain without a full remodel. Frameless ⅜″ bypass slider, brushed-nickel hardware. On-site install: under three hours." },
      { title: "Custom steam shower enclosure, Briarwood custom home", body: "A 2004 custom home off Saunders Road had a generously sized master bath the original builder had under-finished. We engineered a ½″ frameless layout with a 90-degree return, hinged door and a fixed transom — all sealed for steam. Hardware in polished chrome to match the existing plumbing fixtures." },
    ],
    trendsTitle: "What's trending in Deerfield bathrooms right now",
    trendsParagraphs: [
      "Three things have shifted in the last 18 months. <strong>Matte black hardware</strong> has finally peaked — we're still installing plenty of it, but more Deerfield clients are asking about brushed gold and aged brass as the next thing. <strong>Low-iron glass</strong> (ultra-clear, no green tint) has gone from a luxury upgrade to a near-standard request on any mid- to high-end remodel. And <strong>curbless walk-ins</strong> are showing up in homes whose owners aren't even thinking about aging-in-place yet — they just like how the bathroom feels when the floor flows under the glass.",
      "If you're not sure which way to go on the frameless-vs-semi-frameless question, we wrote a full <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covering cost, glass thickness, cleaning and durability.",
    ],
    faqs: [
      { q: "Do you handle permit work in Deerfield?", a: "Standard shower glass replacement and door installs don't typically require a permit in the Village of Deerfield. If your project is part of a larger remodel that moves plumbing or framing, your GC pulls the permit and we coordinate around the inspection schedule." },
      { q: "Can you match the brushed-gold fixtures my plumber already installed?", a: "Yes. We carry hardware in polished chrome, brushed nickel, matte black, brushed gold, polished gold, oil-rubbed bronze and brushed bronze. Bring us your fixture spec sheet at the estimate and we'll match the finish family." },
      { q: "How much does a frameless shower door cost in Deerfield?", a: "For a typical Deerfield master bath — single hinged frameless door with one fixed inline panel, ⅜″ tempered glass, mid-grade hardware — most projects land between $1,800 and $3,500 installed. Larger walk-ins, steam-rated assemblies and ½″ glass push the number higher. We quote your actual opening at the free estimate." },
      { q: "How long does an install take from first call to finished glass?", a: "Two to three weeks. About a week is fabrication; the on-site install is a single visit, usually 2-6 hours depending on the layout. We're based in Deerfield, so if anything needs adjusting after install we're usually back within a day." },
    ],
    contactBlurb: "Since we're based in Deerfield, we can usually be at your door within a day or two. Most estimates take 20-30 minutes and include itemized pricing on the spot.",
  },
  {
    slug: "hoffman-estates-il",
    name: "Hoffman Estates",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/frameless-herringbone-black.jpg",
    heroImageAlt: "Frameless shower door installed by Makibaki in a Hoffman Estates, IL bathroom",
    ogImage: "images/frameless-herringbone-black.jpg",
    metaDescription: "Custom shower doors and glass enclosures installed across Hoffman Estates, IL — Barrington Square, Hilldale, Highland Woods. Free estimates, 224-427-9199.",
    intro: "Hoffman Estates sits on our doorstep — a ten-minute drive from our shop and one of the towns we work in most. From the original Highland Woods ranches to the newer luxury homes around the Arboretum, we've installed shower glass into just about every floor plan this village has on file.",
    whyTitle: "Hoffman Estates is mostly mid-century — and that matters",
    whyParagraphs: [
      "A huge chunk of Hoffman Estates was built between 1960 and 1985. Barrington Square, Hilldale, Highland Woods, Parcel C — these neighborhoods went up fast, on slab or shallow crawl, and the original master baths almost always shipped with a 60-inch alcove tub and a fiberglass surround. Forty years later, those surrounds are tired, the framing has settled, and homeowners want glass.",
      "What that means in practice: when we measure a Hoffman Estates master bath, we expect to find walls that are not square. We bring laser levels and check for plumb in two planes before we cut anything. A standard 60-inch sliding door kit from a big-box store assumes a perfectly square opening — which almost never exists in a 1972 Hilldale house. Our doors are cut to your actual opening, not the nominal one, which is the difference between glass that closes properly and glass that drags on the curb.",
    ],
    neighborhoods: [
      { name: "Highland Woods", body: "Tri-levels and four-bedroom colonials from the late '60s and early '70s. Most baths are tight; sliding bypass doors and inline frameless panels make the biggest visual impact." },
      { name: "Barrington Square", body: "Townhomes and condo-style baths with prefab tubs. Bypass sliders are our most common install here, often as part of a single-day refresh." },
      { name: "Hilldale", body: "Original ranches with detached garages, many being expanded with master-bath additions. Frameless walk-ins are popular when the addition allows a real shower footprint." },
      { name: "Parcel C", body: "Late '70s through '80s tract homes. We see a lot of semi-frameless installs here as the cost-conscious upgrade." },
      { name: "The Arboretum & Princeton Estates", body: "Newer construction (late '90s onward) with larger primary baths. Custom frameless enclosures, steam glass and oversized walk-ins." },
      { name: "Casey Farms", body: "Custom builds with bigger budgets. Floor-to-ceiling fixed panels and ½″ low-iron are common here." },
    ],
    projects: [
      { title: "Bypass slider replacement, Highland Woods ranch", body: "A homeowner on Freeman Road was selling and needed the original framed shower door replaced before listing. Standard 60″ alcove, porcelain-on-steel tub the buyers wanted to keep. We installed a frameless ⅜″ bypass slider with brushed nickel hardware. Two hours start to finish — the home sold a week later." },
      { title: "Frameless walk-in, Arboretum custom home", body: "A 2003 build off Beverly Road had a generous primary bath with a curbed walk-in shower the original builder had finished with a basic framed door. Owners had just retiled in Calacatta porcelain and didn't want a frame interrupting it. Single ½″ low-iron hinged frameless door and a 36″ inline panel, concealed-edge hardware in polished chrome." },
      { title: "Steam-rated enclosure, Princeton Estates", body: "A custom build near Bartlett Road had a dedicated steam shower the builder had framed correctly but glazed with an undersized framed door — losing most of the steam through the gap. Full ½″ frameless steam enclosure: hinged door, two fixed panels, transom over the door, continuous gasketing top to bottom. The homeowner can finally use the feature they paid extra for." },
    ],
    trendsTitle: "What we're seeing in Hoffman Estates right now",
    trendsParagraphs: [
      "Two clear shifts. <strong>Tub-to-shower conversions</strong> are way up — Hoffman Estates families are at the age where the master tub never gets used and the master shower is too small to enjoy. Pulling the tub and rebuilding the whole footprint as a walk-in is the single biggest visual change you can make in a Hoffman bath. The other shift: <strong>aged-brass and unlacquered-brass hardware</strong> showing up alongside the matte-black look that dominated the last five years.",
      "If you're trying to decide between frameless and semi-frameless for your project, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> walks through the real differences in cost, glass thickness, cleaning and durability.",
    ],
    faqs: [
      { q: "Do I need a permit for a new shower door in Hoffman Estates?", a: "For a like-for-like glass replacement, generally no. If you're part of a larger remodel that changed framing or plumbing, your contractor handles permitting through the village and we coordinate timing." },
      { q: "Can you work around an existing tile job?", a: "Yes — that's most of our work. We measure to the finished tile surface and account for lippage. If your tile setter is still finishing, we measure after grout is set so the door fits the actual finished opening." },
      { q: "How long do frameless doors typically last in this climate?", a: "Twenty-plus years for the glass and hardware if you wipe the glass dry occasionally. Hinges and seals are the wear items, and both are easily replaceable without redoing the whole enclosure." },
      { q: "Do you do bathroom mirrors and railings too?", a: "Yes — we install custom mirrors and glass railings throughout the Hoffman Estates area. Many shower-door clients add a custom vanity mirror to the same install visit." },
    ],
    contactBlurb: "We're a short drive away and usually book estimates within the same week.",
  },
  {
    slug: "palatine-il",
    name: "Palatine",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/custom-herringbone-walkin.jpg",
    heroImageAlt: "Custom frameless shower glass installed by Makibaki in a Palatine, IL bathroom",
    ogImage: "images/custom-herringbone-walkin.jpg",
    metaDescription: "Custom shower doors, walk-in enclosures and frameless glass installed across Palatine, IL — downtown, Plum Grove Hills, Inverness border. 224-427-9199.",
    intro: "Palatine is one of the more interesting towns we work in. Drive five blocks in any direction and the housing stock shifts completely — brick ranches downtown, mid-century split-levels off Quentin, and across the Inverness line, custom estates where a single primary bath has more square footage than a Loop apartment. We install glass into all of it.",
    whyTitle: "The Palatine of 1955 and the Palatine of 2005 are not the same job",
    whyParagraphs: [
      "Older central Palatine — the area within walking distance of the Metra station — was built mostly between 1950 and 1975. Brick ranches, modest masters, a fiberglass tub-surround in nearly every original bath. The remodels here are usually pragmatic: take out the surround, retile, install a sensible frameless door, done. Honest budgets, quick turnarounds.",
      "Cross into the Inverness side of Palatine, or into the newer construction off Quentin and Dundee, and the brief changes. Primary baths are 200+ square feet. Showers are big enough for two. Curbless entries, dual rain heads, oversized benches built into the wall. These are the projects where we end up specifying ½″ low-iron glass with custom-fabricated channels and concealed hardware, sometimes with three or four panels in a single enclosure.",
    ],
    neighborhoods: [
      { name: "Downtown Palatine", body: "Older brick ranches and Cape Cods, many with single full baths. Pivot doors over tubs are popular when the bath is small." },
      { name: "Plum Grove Hills", body: "Mid-century classics with strong bones. Tear-out can surprise you (we've found cedar planks behind tile more than once), but the results are gorgeous." },
      { name: "Winston Park & Winston Knolls", body: "Late '60s and '70s split-levels. Sliding doors and inline frameless panels are the most common requests." },
      { name: "Inverness border & Hidden Creek", body: "Custom homes with big budgets. Frameless walk-ins, steam enclosures and custom-laminated glass projects." },
      { name: "Deer Grove area", body: "Newer infill and luxury rebuilds. Full bathroom-remodel glass packages combined with custom mirrors and tub enclosures." },
    ],
    projects: [
      { title: "Frameless pivot over a clawfoot, downtown Palatine bungalow", body: "A homeowner near Slade Street had restored an original clawfoot tub and didn't want a curtain ruining the look. The bath was tight — only 30 inches between the tub and the toilet. We custom-fit a single ½″ pivot panel anchored to the wall with two heavy-duty hinges. Swings open against the wall when not in use; watertight enclosure when closed." },
      { title: "Curbless walk-in, Plum Grove Hills primary bath", body: "A 1962 ranch on Mallard Lane had its original master bath gutted and rebuilt as a curbless wet room. The framing was reset for a 72″ entry with a linear drain. Single ⅜″ floor-to-ceiling fixed panel — no door — with a polished-chrome floor-mount channel and clear silicone seal at the floor." },
      { title: "Three-panel frameless enclosure, Inverness-border custom home", body: "An estate near Ela Road had a primary bath we honestly didn't want to leave. Shower footprint was 8×5, with a built-in bench, a niche, two showerheads. Three-panel ½″ low-iron frameless layout: hinged door, 90-degree return, 60″ fixed panel. Hardware in satin brass to match the existing fixtures." },
    ],
    trendsTitle: "What Palatine is asking for in 2026",
    trendsParagraphs: [
      "Three clear trends. <strong>Low-iron glass</strong> on every premium project — homeowners notice the green tint of standard glass once it's pointed out, and they won't accept it. <strong>Aged brass and satin gold hardware</strong> are replacing matte black as the default 'wow' finish. And <strong>floor-to-ceiling fixed panels</strong> instead of doors — particularly in larger walk-ins where the geometry doesn't need a door at all.",
      "If you're weighing frameless vs semi-frameless for your Palatine project, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers cost, glass thickness, cleaning and durability in plain English.",
    ],
    faqs: [
      { q: "Do you work on homes in Inverness too?", a: "Yes — Inverness is a regular part of our service area. Many of the biggest custom enclosures we install are over the Palatine-Inverness line." },
      { q: "How do you handle older tile that might be fragile?", a: "For mid-century baths with original tile, we drill carefully with masonry bits and use anchored wall clamps rather than continuous channels where we can. If we have any concerns during measurement, we flag them before fabrication so there are no surprises on install day." },
      { q: "Can you finish before a closing date?", a: "Usually yes. Standard turnaround is 2-3 weeks from order. If you're working against a closing, tell us at the estimate and we'll see if we can prioritize fabrication." },
      { q: "Do you do custom mirrors for vanities too?", a: "Yes — many of our Palatine clients add custom vanity mirrors, transom panels above doorways, or glass railings to the same project visit." },
    ],
    contactBlurb: "We typically book Palatine estimates within a few days of your call.",
  },
  {
    slug: "arlington-heights-il",
    name: "Arlington Heights",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/frameless-marble-black.jpg",
    heroImageAlt: "Frameless shower door installed by Makibaki in an Arlington Heights, IL primary bath",
    ogImage: "images/frameless-marble-black.jpg",
    metaDescription: "Frameless shower doors, walk-in enclosures and custom glass installed across Arlington Heights, IL — Scarsdale, Stonegate, Greenbrier. 224-427-9199.",
    intro: "Arlington Heights is a teardown town. We've watched whole blocks south of Northwest Highway flip from 1950s ranches to four-bedroom moderns over the last decade. We work in both — the original homes with character we want to preserve, and the new builds where the GC has framed the bath specifically with frameless glass in mind.",
    whyTitle: "Old and new sit side-by-side here",
    whyParagraphs: [
      "One day we're installing a frameless inline panel in a 1924 bungalow off Eastman Street where the bathroom is original and tight. The next day we're across town in a 2023 new-build with a 100-square-foot wet room and ¾-inch low-iron glass running floor to ceiling. Both jobs require the same skill — careful measurement, precise fabrication, clean install — but the conversations couldn't be more different.",
      "On the older Arlington Heights homes, the question is almost always 'how do we make this work without the door looking like an afterthought?' On the new builds, the question is 'what do we put in that justifies the rest of the bathroom?' We give honest answers to both.",
    ],
    neighborhoods: [
      { name: "Scarsdale", body: "Older brick Cape Cods and mid-century ranches near the Metra. We do a lot of frameless inline panels and pivot doors here where space is tight." },
      { name: "Stonegate", body: "Late '70s and '80s colonials with reasonable-sized primary baths. Frameless walk-ins and hinged-door configurations are the bread and butter." },
      { name: "Greenbrier", body: "Custom split-levels and ranches from the '60s, many now in their second or third remodel. Curbless walk-ins are increasingly common." },
      { name: "Surrey Ridge & Volz Park", body: "1990s and 2000s homes with prepped wall blocking. The easiest installs in town." },
      { name: "Downtown Arlington Heights", body: "Older bungalows being modernized for empty-nesters who downsized from Stonegate. Smart, compact bathrooms with high-end finishes." },
      { name: "Tear-down rebuilds south of NW Highway", body: "Big primary baths, big budgets, ½″ low-iron everywhere." },
    ],
    projects: [
      { title: "Frameless inline panel, Scarsdale bungalow", body: "A 1928 bungalow near Park Street had a second-floor bath the owners had retiled in subway and hex but still had an original framed door on. Opening was barely 32 inches wide and out of plumb by almost ⅜ inch. We fabricated a single 32″ inline panel in ⅜″ glass and installed it with two concealed clamps and a single header to take up the plumb." },
      { title: "Frameless 90-degree return, Stonegate primary", body: "A 1985 colonial near Forest Park had a primary bath with a corner shower the original builder had glazed with a fully framed bronze unit. New owners had retiled in large-format porcelain and wanted nothing framed. ⅜″ frameless 90-degree return: hinged door on one wall, 36″ fixed return on the adjacent wall. Hardware in matte black." },
      { title: "Floor-to-ceiling fixed panel, new-build off Hickory", body: "A 2024 tear-down rebuild had a 6×4 walk-in shower with a linear drain and no curb. The architect specified no door — just a single fixed panel and an open entry. ½″ low-iron panel running from the finished floor to the 9-foot ceiling. Continuous polished-chrome floor channel, upper clip into the ceiling joist." },
    ],
    trendsTitle: "What's selling in Arlington Heights this year",
    trendsParagraphs: [
      "Three things. <strong>No-door layouts</strong> on walk-ins big enough to support them — clients love the visual continuity. <strong>Aged-brass hardware</strong> on traditional and transitional bathrooms, almost always paired with cream marble or warm beige tile. And <strong>fluted or reeded glass</strong> as an accent panel — usually in powder rooms and water closets rather than full showers, but it's showing up.",
      "Still on the fence about frameless vs semi-frameless? Our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> walks through the trade-offs that actually matter.",
    ],
    faqs: [
      { q: "Do you do new-construction work for builders?", a: "Yes — we work directly with several GCs and design-build firms in Arlington Heights. If your builder hasn't picked a glass installer yet, have them call us and we'll coordinate measure and install around the rest of the trades." },
      { q: "Can you replace just the glass on an existing frame?", a: "Sometimes. If the framing and hardware are still solid and the issue is cracked, etched, or foggy glass, we can fabricate a replacement panel. We'll evaluate at the estimate — sometimes a full replacement actually costs less than a one-off panel." },
      { q: "How do you protect the rest of the bathroom on install day?", a: "We bring our own drop cloths, runner protection for hallway floors, and a HEPA shop vac. Walls and finishes adjacent to the work area are taped if there's any risk. Everything gets cleaned up before we leave." },
      { q: "Do you guarantee your installs?", a: "Yes. Hardware carries the manufacturer warranty, and we stand behind the install workmanship. If anything shifts or seals fail in the first year, we come back and fix it." },
    ],
    contactBlurb: "Same-week estimates available for most of Arlington Heights.",
  },
  {
    slug: "elk-grove-village-il",
    name: "Elk Grove Village",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/enclosure-travertine-walkin.jpg",
    heroImageAlt: "Frameless walk-in glass enclosure installed by Makibaki in an Elk Grove Village, IL bathroom",
    ogImage: "images/enclosure-travertine-walkin.jpg",
    metaDescription: "Custom shower doors, walk-in enclosures and frameless glass installed across Elk Grove Village, IL — Town & Country, Salem Village, Brantwood. 224-427-9199.",
    intro: "Elk Grove Village was one of America's original planned suburbs — a 1957 vision that produced an almost uniform stock of mid-century ranches, tri-levels and four-bedroom colonials. Sixty-plus years later, those original baths are getting their second or third remodel, and we install glass into a lot of them. The work here is honest, friendly, and rarely fussy.",
    whyTitle: "One thing Elk Grove gets right: the bones are good",
    whyParagraphs: [
      "The original Centex homes that built Elk Grove Village in the late '50s and early '60s were not fancy, but they were well-framed. Sixty years on, those walls are mostly still straight, the floor pans usually still drain, and remodeling a master bath here is one of the more predictable jobs we get. That's a real benefit for homeowners: we can usually quote tighter, install cleaner, and finish faster than in towns with wildly varied housing stock.",
      "The flip side is the original bath footprint is tight. A typical Elk Grove Village master bath off Lincoln or Ridge is around 5×8, with a 60-inch alcove tub and a vanity opposite. The smart remodel removes the tub, makes the whole footprint a walk-in shower, and uses a single frameless inline panel to keep the room feeling open. That's the most common job we run in Elk Grove — and it's the one that delivers the biggest visual change for the budget.",
    ],
    neighborhoods: [
      { name: "Town & Country", body: "Original tri-levels and ranches. Tear-out is predictable; we know exactly what we'll find behind the tile." },
      { name: "Salem Village", body: "Slightly newer (mid '60s through '70s) split-levels and four-bedroom colonials. Frameless inline panels and bypass sliders are common." },
      { name: "Brantwood", body: "Mid-century classics; many homeowners are doing full remodels and adding mirrors and custom glass at the same time." },
      { name: "Around Busse Woods", body: "A mix of older homes and newer infill. We do a lot of corner and 90-degree enclosures here." },
      { name: "Townhomes near Devon & Arlington Heights Rd", body: "Bypass sliders over alcove tubs are the standard request." },
    ],
    projects: [
      { title: "Tub-to-shower conversion, Salem Village ranch", body: "A homeowner on Hampton Lane was tired of stepping over a 1962 cast-iron tub the previous owner had never used. We coordinated with their tile guy: tub out, alcove rebuilt as a 60″ curbed walk-in, tiled in 12×24 porcelain. Single ⅜″ frameless inline panel with a polished-chrome wall clamp and a corner support." },
      { title: "Bypass sliding door, Town & Country townhome", body: "A second-floor guest bath in a townhome off Tonne Road still had the original framed shower door from the late '90s — discolored aluminum frame, peeling vinyl seals. Frameless ⅜″ bypass slider with brushed-nickel hardware, single-day visit. No tile work, no drywall, no permit. The bath was usable that night." },
      { title: "Frameless corner enclosure, Brantwood remodel", body: "A 1968 four-bedroom on Margate Lane was getting a full primary-bath gut with a new 42×42 corner shower. ⅜″ frameless 90-degree enclosure: hinged door on one wall, fixed panel on the other, both clamped with matte-black hardware. The homeowners had budgeted for semi-frameless but went frameless after seeing it in person." },
    ],
    trendsTitle: "What we hear most often in Elk Grove",
    trendsParagraphs: [
      "Clients in Elk Grove Village tend to be value-focused without being cheap. The most common questions: <em>'Is frameless really worth the extra cost?'</em> (often yes — see our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a>) and <em>'How long will this last?'</em> (a properly installed frameless door easily outlasts the rest of the bathroom's finishes).",
      "The other thing that comes up: noise. People in Elk Grove tend to be working from home or have early-morning O'Hare flights, and they appreciate that a frameless door doesn't have the metallic rattle of a framed unit. Real benefit, rarely advertised.",
    ],
    faqs: [
      { q: "Do you do tub-to-shower conversions?", a: "We don't do the plumbing or tile, but we coordinate with whoever does. Once your contractor has finished the new shower pan and tile, we measure and install the glass typically within a week." },
      { q: "What about Elk Grove permits?", a: "Standard glass replacement doesn't require a village permit. Larger remodels are handled by your general contractor." },
      { q: "Will frameless glass shatter if I bump it?", a: "No. Shower glass is tempered safety glass — about four times stronger than regular glass, and if it ever does break (very rare), it breaks into small dull pebbles rather than sharp shards. Same glass used in car side windows." },
      { q: "Can you handle a small bath where everything is tight?", a: "Yes — small Elk Grove baths are most of our work. Pivot doors, inline panels, and corner enclosures are all designed for compact footprints. We'll show you 2-3 layouts at the estimate." },
    ],
    contactBlurb: "We can usually be at your home within the week.",
  },
  {
    slug: "rolling-meadows-il",
    name: "Rolling Meadows",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/sliding-black-subway.jpg",
    heroImageAlt: "Frameless sliding shower door installed by Makibaki in a Rolling Meadows, IL bathroom",
    ogImage: "images/sliding-black-subway.jpg",
    metaDescription: "Frameless shower doors, sliding enclosures and custom glass installed across Rolling Meadows, IL — Plum Grove, Carriageway, Meadow Edge. 224-427-9199.",
    intro: "Rolling Meadows started as a Kimball Hill planned community in the 1950s and the original ranches still define the place. We install a lot of glass into these homes — usually as part of a master-bath remodel that finally retires the original tub and turns the alcove into a walk-in shower the owners actually want to use.",
    whyTitle: "A Kimball Hill ranch is a specific kind of remodel",
    whyParagraphs: [
      "When the original Kimball Hill homes went up, the master bath was almost always a 5×7 with a 60-inch alcove tub against one wall. Sixty years on, that footprint is still the most common starting point we see in Rolling Meadows. Tear out the tub, rebuild the alcove as a curbed shower, and put a single frameless inline panel in front. It's the highest-ROI bath move you can make in this town.",
      "What's specific to Rolling Meadows is the wall construction. The original plaster-over-lath walls on Kimball Hill homes are unforgiving — we drill carefully and use wider clamp footprints to spread load. On newer homes around Plum Grove and Algonquin Road, drywall is standard and the job is faster. We charge the same either way, but the on-site time differs.",
    ],
    neighborhoods: [
      { name: "Original Kimball Hill section", body: "1950s ranches, tight master baths. Inline frameless panels and pivot doors do the most visual work here." },
      { name: "Plum Grove Estates", body: "Slightly newer split-levels with bigger primary baths. Frameless walk-ins and 90-degree returns are the common request." },
      { name: "Carriageway / Three Lakes", body: "Townhomes and condos. Bypass sliders over alcove tubs are the bread and butter." },
      { name: "Meadow Edge", body: "Late '70s and '80s ranches. Tub-to-shower conversions are popular — easy footprint to rework." },
      { name: "Near Salt Creek Park", body: "Custom rebuilds and bigger primary baths. Low-iron frameless enclosures show up here more than anywhere else in town." },
    ],
    projects: [
      { title: "Tub-to-shower conversion, original Kimball Hill ranch", body: "A homeowner on Owl Drive had finally pulled the original 1956 cast-iron tub and rebuilt the alcove as a 60″ curbed walk-in. We installed a ⅜″ frameless inline panel with a single header reinforcement (the original framing wasn't strong enough for an unsupported span). Hardware in brushed nickel to match the new fixtures." },
      { title: "Bypass slider, Three Lakes townhome guest bath", body: "A homeowner near Algonquin Road had a tired framed shower door from the early 2000s — peeling vinyl, foggy glass. Frameless ⅜″ bypass slider with polished-chrome hardware. One-visit install, three hours from arrival to handoff." },
      { title: "Frameless 90-degree return, Plum Grove primary bath", body: "A 1978 split-level near Plum Grove Road had a corner shower the original builder had glazed in framed bronze. New owners had retiled in large-format ceramic. ⅜″ frameless 90-degree return — hinged door on one wall, 32″ fixed panel on the other, matte-black hardware throughout." },
    ],
    trendsTitle: "Rolling Meadows is a value-first market",
    trendsParagraphs: [
      "Most homeowners here are weighing real trade-offs. Frameless looks better and lasts longer; semi-frameless is meaningfully cheaper. We give honest pricing on both at the estimate and let the project decide. Our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the trade-offs in detail.",
      "The other shift: <strong>low-iron glass</strong> as the upgrade path of choice. Once you've seen low-iron against white tile, the green tint of standard tempered is hard to un-see. We're quoting it on more than half of new Rolling Meadows projects.",
    ],
    faqs: [
      { q: "Do you do same-week installs in Rolling Meadows?", a: "Often, for bypass sliders and standard inline panels we already have stock for. Custom fabrication is 2-3 weeks from measure. Tell us the urgency at the estimate." },
      { q: "Can you work over the original plaster walls?", a: "Yes — we use wider clamp footprints and pre-drill carefully. We've worked on hundreds of original Kimball Hill homes." },
      { q: "What's the typical price range for a Rolling Meadows install?", a: "Bypass sliders typically $1,200-$1,800 installed. Frameless inline panels $1,500-$2,800. Full frameless enclosures with doors and returns $2,500-$5,000 depending on glass thickness and hardware." },
      { q: "Do you remove the old door?", a: "Yes — we remove and dispose of the old door and frame as part of the install. Walls get patched at the anchor points if needed." },
    ],
    contactBlurb: "Most Rolling Meadows estimates are booked within the week of your call.",
  },
  {
    slug: "streamwood-il",
    name: "Streamwood",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/sliding-gold-tan.jpg",
    heroImageAlt: "Sliding shower door installed by Makibaki in a Streamwood, IL bathroom",
    ogImage: "images/sliding-gold-tan.jpg",
    metaDescription: "Custom shower doors, sliding enclosures and frameless glass installed across Streamwood, IL — Oltendorf Crossings, Surrey Ridge, Heatherwood. 224-427-9199.",
    intro: "Streamwood grew up fast — most of the housing stock here went in between the late 1960s and early 1990s, with subdivisions rolling out one after another. We work in pretty much all of them, and the bathrooms tend to share a similar DNA: builder-grade originally, retired tub-surrounds today, and a real appetite for clean modern glass that doesn't blow the budget.",
    whyTitle: "Streamwood is the most pragmatic glass market in our service area",
    whyParagraphs: [
      "Homeowners here ask great questions. They want to know what lasts, what looks good, and what the actual cost-per-year of the install will be over twenty years. We respect that, and we quote accordingly — no upsell, no scare tactics, just honest options for the bath you actually have.",
      "The housing stock works in your favor. Most Streamwood primary baths were framed reasonably square, walls are drywall, and there's almost always solid wood behind the tile for our clamps to bite into. That keeps install times short and prices fair. The most common job we run here is a frameless inline panel over a tub-to-shower conversion, finished in a single afternoon.",
    ],
    neighborhoods: [
      { name: "Oltendorf Crossings", body: "Late-90s subdivision with reasonable primary baths. Frameless walk-ins are the most common upgrade." },
      { name: "Surrey Ridge", body: "1980s split-levels with tight master baths. Bypass sliders and inline panels do the most." },
      { name: "Heatherwood", body: "Early 2000s with prepped framing. Easiest installs in town." },
      { name: "Near Bartlett Road", body: "Mix of older ranches and townhomes. Bypass sliders are the everyday request." },
      { name: "Bittersweet & Wexford", body: "1990s tract homes. Frameless 90-degree returns work well in the typical corner-shower layouts." },
    ],
    projects: [
      { title: "Frameless inline panel, Oltendorf Crossings remodel", body: "A homeowner on Brookside Drive had pulled an alcove tub and rebuilt the footprint as a 60″ curbed shower in subway tile. ⅜″ frameless inline panel, polished-chrome hardware, single header. On-site install in about three hours." },
      { title: "Bypass sliding door, Surrey Ridge guest bath", body: "A second-floor bath off Park Boulevard still had the original framed slider from 1989 — bent track, foggy glass, scratched vinyl. Replaced with a frameless ⅜″ bypass slider in brushed nickel. One visit, no demo." },
      { title: "Frameless 90-degree return, Heatherwood primary", body: "A 2003 build off Park Avenue had a corner shower the builder had glazed in semi-frameless. Owner had upgraded the tile to large-format porcelain and wanted nothing framed. ⅜″ frameless corner return, matte-black hardware." },
    ],
    trendsTitle: "What Streamwood is buying in 2026",
    trendsParagraphs: [
      "Bypass sliders are still the volume product — fast, affordable, dramatic improvement over a curtain or old framed door. Frameless walk-ins are the upgrade most owners go for when they're remodeling anyway. <strong>Brushed nickel and matte black</strong> remain the everyday finishes; <strong>brushed gold</strong> is the request when homeowners want something that feels more designed.",
      "If you're not sure whether frameless is worth the upcharge over semi-frameless, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> walks through the math.",
    ],
    faqs: [
      { q: "How fast can you replace an old framed slider?", a: "If we have the size in stock, often within the week. Custom sizes are 2-3 weeks from measure." },
      { q: "Will the new glass fit my existing alcove?", a: "We custom-cut to your actual opening. Standard widths are 56-60 inches; we handle anything from 28 to 72 inches." },
      { q: "Can I keep my existing tile?", a: "Yes — most of our Streamwood installs are over existing tile. We measure to the finished surface and anchor through tile with masonry-rated bits." },
      { q: "What does a basic bypass slider cost installed?", a: "Most Streamwood bypass installs run $1,200-$1,800 complete, including removal and disposal of the old door." },
    ],
    contactBlurb: "We can usually be at your door within the week.",
  },
  {
    slug: "hanover-park-il",
    name: "Hanover Park",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/sliding-black-bench.jpg",
    heroImageAlt: "Frameless sliding shower door installed by Makibaki in a Hanover Park, IL bathroom",
    ogImage: "images/sliding-black-bench.jpg",
    metaDescription: "Custom shower doors, frameless enclosures and sliding glass installed across Hanover Park, IL — Greenbrook, Heritage Estates, Walnut Glen. 224-427-9199.",
    intro: "Hanover Park is one of those towns where the housing stock divides cleanly: pre-1985 ranches and split-levels on one side, post-1995 subdivisions on the other. We install shower glass into both — and the conversation looks completely different depending on which side of that line your home sits on.",
    whyTitle: "Two distinct housing eras, two different conversations",
    whyParagraphs: [
      "Older Hanover Park (the original tracts off Lake Street and Irving Park) tends to have tight 5×8 master baths with a tub and a vanity — and an owner ready to gut the whole thing. Newer Hanover Park (Heritage Estates, Walnut Glen, Greenbrook) has bigger primary baths the builder already framed for a separate shower, often with the rough opening sized for glass.",
      "Knowing which era you're in changes the project. Older baths almost always need a tub-to-shower conversion and a single frameless inline panel. Newer baths usually need a frameless hinged door with a fixed inline or 90-degree return — and the install is a one-visit job because the wall blocking is already there.",
    ],
    neighborhoods: [
      { name: "Greenbrook", body: "1990s subdivision with reasonable primary baths. Hinged frameless doors with inline panels are the common request." },
      { name: "Heritage Estates", body: "Early 2000s, larger footprints. Frameless walk-ins and 90-degree returns dominate." },
      { name: "Walnut Glen", body: "Newer construction with prepped framing. Easiest installs in the village." },
      { name: "Original Hanover Park (off Lake Street)", body: "1960s and '70s ranches and split-levels. Bypass sliders and tub-to-shower conversions are most of the work." },
      { name: "Spring Lake / townhome blocks", body: "Townhome stock — alcove tubs everywhere. Bypass sliders are the standard request." },
    ],
    projects: [
      { title: "Hinged frameless door + inline, Greenbrook primary", body: "A 1996 build off Greenbrook Boulevard had a 36×60 shower the builder had glazed in a framed pivot door. New owners had retiled in large-format porcelain. ⅜″ frameless hinged door with a 24″ fixed inline, polished-chrome hardware." },
      { title: "Tub-to-shower conversion, original Hanover Park ranch", body: "A 1971 ranch near Maple Avenue had its master tub pulled and rebuilt as a 60″ curbed walk-in. Single ⅜″ frameless inline panel with a header. Hardware in brushed nickel to match the new fixtures." },
      { title: "Frameless 90-degree return, Heritage Estates remodel", body: "An early-2000s home off Schick Road had a 60×42 corner shower the builder had framed in bronze. ⅜″ frameless 90-degree return with matte-black hardware. The bathroom finally read as designed rather than builder-grade." },
    ],
    trendsTitle: "What's moving in Hanover Park right now",
    trendsParagraphs: [
      "<strong>Tub-to-shower conversions</strong> are the dominant project in older Hanover Park — empty-nesters who never use the master tub and want the master shower to feel actually usable. <strong>Large-format porcelain tile</strong> is the prevailing wall finish, which pairs beautifully with frameless glass. And <strong>matte black hardware</strong> is still the everyday choice, though brushed gold is creeping in on transitional bathrooms.",
      "Choosing between frameless and semi-frameless? Our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the practical trade-offs.",
    ],
    faqs: [
      { q: "Do you work with Hanover Park contractors directly?", a: "Yes — we coordinate measure and install with whoever's doing your tile and plumbing. Most of our Hanover Park projects come through a GC or design-build firm." },
      { q: "Can you install over existing tile?", a: "Yes — most of our installs are. We measure to the finished tile surface and use masonry-rated bits for anchors." },
      { q: "How long is the typical install?", a: "Bypass sliders: 2-3 hours. Inline panels: 2-4 hours. Full frameless enclosures with hinged doors: 3-6 hours." },
      { q: "What's the warranty?", a: "Hardware carries manufacturer warranty (typically lifetime on hinges, 10 years on seals). Install workmanship is guaranteed for life of the install — if anything shifts, we come back." },
    ],
    contactBlurb: "Same-week estimates available for most of Hanover Park.",
  },
  {
    slug: "bartlett-il",
    name: "Bartlett",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/frameless-marble-tub.jpg",
    heroImageAlt: "Frameless shower door installed by Makibaki in a Bartlett, IL primary bath",
    ogImage: "images/frameless-marble-tub.jpg",
    metaDescription: "Frameless shower doors, walk-in enclosures and custom glass installed across Bartlett, IL — Westridge, Amber Grove, Castle Creek. 224-427-9199.",
    intro: "Bartlett has expanded steadily for two decades — newer construction on the west end and out toward Wayne, older ranches near the train station and downtown. The bathrooms we install glass into reflect that range, but the common thread is that Bartlett homeowners tend to plan their remodels carefully and want options laid out clearly before they commit.",
    whyTitle: "Bartlett homeowners do their research — we appreciate that",
    whyParagraphs: [
      "Most Bartlett estimates we run are with homeowners who've already read up on frameless vs semi-frameless, looked at hardware finishes, and have a clear picture of what they want. That makes our job mostly about confirming feasibility, taking accurate measurements, and being honest about which decisions matter and which don't.",
      "The newer Bartlett subdivisions — Westridge, Amber Grove, Castle Creek — were built with reasonable wall blocking for glass enclosures. Older Bartlett homes near the downtown core need more careful measurement and sometimes a hidden header. Both jobs are within our wheelhouse; the timeline shifts but the quality is the same.",
    ],
    neighborhoods: [
      { name: "Westridge", body: "Late-90s and early-2000s subdivision. Frameless hinged doors with inline panels are the volume request." },
      { name: "Amber Grove", body: "Newer luxury subdivision. Full frameless enclosures, sometimes with custom transom panels above the door." },
      { name: "Castle Creek", body: "Larger custom homes. Steam-rated enclosures and oversized walk-ins are common." },
      { name: "Downtown Bartlett", body: "Older homes near the Metra. Frameless inline panels and pivot doors for tight historical footprints." },
      { name: "Stearns Road corridor", body: "Mix of housing stock — bypass sliders and frameless walk-ins both show up frequently." },
    ],
    projects: [
      { title: "Frameless transom enclosure, Amber Grove primary", body: "A luxury home off Amber Lane had a primary bath with a 4×6 shower and 9-foot ceilings. The owners didn't want a wall-height door — they wanted glass running near the ceiling for the ceremony of it. ⅜″ frameless hinged door with a fixed transom above and a 36″ inline panel, all in low-iron glass. Hardware in polished chrome." },
      { title: "Tub-to-shower conversion, downtown Bartlett bungalow", body: "A 1924 bungalow near Oak Avenue had its only full bath gutted as part of a larger restoration. Custom 48″ curbed walk-in with a single ⅜″ frameless inline panel and a header reinforcement (lath-and-plaster walls needed careful clamp placement). Hardware in aged brass to match the rest of the restoration." },
      { title: "Frameless walk-in with bench, Castle Creek custom home", body: "A 2010 custom build off Spring Bluff had a 6×4 walk-in shower with a built-in bench and dual rain heads. ½″ low-iron frameless layout: hinged door, fixed inline panel, 90-degree return. Concealed-edge hardware in brushed nickel." },
    ],
    trendsTitle: "Bartlett's signal projects this year",
    trendsParagraphs: [
      "<strong>Transom panels</strong> above the door on tall-ceilinged bathrooms have been a recurring request — they extend the design language of the glass without committing to a full wall-height door. <strong>Low-iron glass</strong> is now standard on premium projects. <strong>Aged-brass hardware</strong> is the choice when homeowners want warmth instead of the harder edge of matte black.",
      "If you're weighing options between frameless and semi-frameless, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">guide</a> covers the trade-offs in detail.",
    ],
    faqs: [
      { q: "Can you do steam-rated enclosures?", a: "Yes — we build full steam enclosures with continuous gasketing top to bottom, sealed transom panels, and the appropriate hardware for the rated assembly." },
      { q: "How tall can a frameless panel go?", a: "Standard fabricated panels go up to 96 inches without special engineering. Taller than that we can do with custom hardware — common in Bartlett luxury baths with 9-10 foot ceilings." },
      { q: "Will frameless glass leak?", a: "A well-installed frameless enclosure with proper sweeps and seals doesn't leak meaningfully. There can be a small amount of splash at the door gap, which is normal for any glass enclosure." },
      { q: "Can you match my existing brushed-nickel fixtures?", a: "Yes. We carry hardware in every common finish family. Bring fixture spec sheets to the estimate." },
    ],
    contactBlurb: "We typically book Bartlett estimates within the same week.",
  },
  {
    slug: "roselle-il",
    name: "Roselle",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/blackframed-marble.jpg",
    heroImageAlt: "Black-framed shower door installed by Makibaki in a Roselle, IL bathroom",
    ogImage: "images/blackframed-marble.jpg",
    metaDescription: "Custom shower doors, frameless enclosures and black-framed glass installed across Roselle, IL — Trails of Roselle, Waterbury, Stonecreek. 224-427-9199.",
    intro: "Roselle is a tidy, well-kept village with a mix of older ranches near the downtown Metra and newer subdivisions toward the western edge. We install glass across the whole footprint, and the project that's been moving most here this year is the modern black-framed industrial look — finally hitting the suburbs in a real way.",
    whyTitle: "Roselle is where the industrial look broke through for us",
    whyParagraphs: [
      "For years the answer to 'what kind of shower door?' was either frameless or some flavor of semi-frameless. Over the last 18 months, a third option has shown up consistently in Roselle estimates: black-framed industrial glass, sometimes with horizontal or vertical mullions, almost always in matte black. It's a deliberately designed look, and it lands particularly well in transitional Roselle bathrooms — modern enough to feel current, structured enough to feel timeless.",
      "Beyond that, the standard Roselle project is still a clean frameless walk-in or a bypass slider for townhome guest baths. We do plenty of both. But if you've seen the industrial look on Instagram and wondered whether it would work in your bathroom, ask us at the estimate — we'll show you a sample.",
    ],
    neighborhoods: [
      { name: "Trails of Roselle", body: "Late '90s and early 2000s, reasonable primary baths. Frameless hinged doors and inline panels." },
      { name: "Waterbury", body: "Mid-2000s subdivision with bigger footprints. Frameless walk-ins and 90-degree returns." },
      { name: "Stonecreek", body: "Newer luxury homes. Industrial black-framed doors and low-iron frameless enclosures." },
      { name: "Original Roselle / near downtown Metra", body: "Older ranches and bungalows. Tub-to-shower conversions and pivot doors." },
      { name: "Roselle Greens", body: "Townhomes. Bypass sliders over alcove tubs are the standard." },
    ],
    projects: [
      { title: "Black-framed industrial door, Stonecreek new build", body: "A 2022 custom home off Bryn Mawr had a 48″ alcove shower the homeowners wanted to feel like a London apartment, not a suburban builder bath. Matte-black framed door with horizontal mullions, ⅜″ tempered glass, custom-fabricated track. The whole bathroom changed character around it." },
      { title: "Tub-to-shower conversion, original Roselle bungalow", body: "A 1932 bungalow off Park Street had its only bathroom gutted. Custom 54″ curbed walk-in with a ⅜″ frameless inline panel, header reinforcement, aged-brass hardware." },
      { title: "Bypass slider, Roselle Greens townhome", body: "A second-floor guest bath off Roselle Road had a tired framed slider. Replaced with frameless ⅜″ bypass in brushed nickel. Single visit, no demo." },
    ],
    trendsTitle: "What's selling in Roselle in 2026",
    trendsParagraphs: [
      "<strong>Black-framed industrial doors</strong> are the new request driver — usually paired with subway or zellige tile and matte-black plumbing. <strong>Frameless walk-ins</strong> remain the everyday upgrade. <strong>Aged-brass hardware</strong> is showing up on traditional remodels as the alternative to matte black.",
      "Trying to decide between frameless and a framed industrial look? Our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">guide</a> covers the comparison.",
    ],
    faqs: [
      { q: "Do you do the black-framed industrial look?", a: "Yes — it's one of our fastest-growing styles. We fabricate custom frames in matte black with horizontal, vertical, or grid mullion patterns." },
      { q: "Is the framed industrial style more or less expensive than frameless?", a: "Usually comparable to frameless on a per-square-foot basis. The hardware is more intricate; the glass itself is often ⅜″ rather than ½″." },
      { q: "Will the matte-black finish chip or wear?", a: "The powder-coat finish we use is rated for shower environments and won't peel or rust. Wipe occasionally with a soft cloth — no abrasive cleaners." },
      { q: "How long does the industrial-style door take to fabricate?", a: "Slightly longer than standard frameless — typically 3-4 weeks because the frame is custom-built per opening." },
    ],
    contactBlurb: "We're a short drive away and book Roselle estimates quickly.",
  },
  {
    slug: "mount-prospect-il",
    name: "Mount Prospect",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/frameless-marble-bench.jpg",
    heroImageAlt: "Frameless shower door installed by Makibaki in a Mount Prospect, IL bathroom",
    ogImage: "images/frameless-marble-bench.jpg",
    metaDescription: "Frameless shower doors, walk-in enclosures and custom glass installed across Mount Prospect, IL — Lions Park, Briarwood, Old Orchard. 224-427-9199.",
    intro: "Mount Prospect is one of the older villages we work in regularly — much of the housing stock predates 1970, and many of the bathrooms we walk into still have their original tile, original plumbing, and original everything. The remodels here tend to be thoughtful, full-scope, and once-in-thirty-years.",
    whyTitle: "Mount Prospect bathrooms are usually a once-in-a-generation remodel",
    whyParagraphs: [
      "When a Mount Prospect homeowner finally takes on the master bath, they take it on completely. We're usually the last trade in — coming after the plumber, the tile setter, the electrician, the painter. Our job is to install glass that complements all of that work and lasts as long as the rest of it will.",
      "Because these are generational remodels, our clients want glass that won't date quickly and hardware that will outlast them. We push toward simple frameless geometry, classic hardware finishes (polished chrome and brushed nickel still age the best), and glass thicknesses that read substantial without being ostentatious.",
    ],
    neighborhoods: [
      { name: "Lions Park / downtown Mount Prospect", body: "1920s through '50s housing. Bungalows, Cape Cods, modest masters. Inline panels and pivot doors." },
      { name: "Briarwood", body: "Late '60s and '70s ranches and split-levels. Frameless walk-ins after tub-to-shower conversions." },
      { name: "Old Orchard", body: "1980s and '90s colonials with larger primary baths. Frameless hinged doors with returns." },
      { name: "Forest River", body: "Custom homes on bigger lots. Steam enclosures and oversized walk-ins." },
      { name: "Townhomes near Algonquin & Busse", body: "Bypass sliders over alcove tubs — the standard request." },
    ],
    projects: [
      { title: "Frameless inline panel, Lions Park 1928 bungalow", body: "A homeowner near Maple Street had the original 1928 second-floor bath retiled in subway and hex. They wanted glass that wouldn't fight the period feel. Single ⅜″ frameless inline panel in clear tempered (low-iron would have read too modern), polished-chrome hardware, header reinforced into original wood blocking." },
      { title: "Frameless walk-in, Briarwood ranch", body: "A 1969 ranch off Westgate Road had its master tub pulled and the alcove rebuilt as a 60″ curbed walk-in. ⅜″ frameless inline panel with a 24″ fixed return, brushed-nickel hardware throughout. The bathroom finally felt like a 2026 bathroom in a 1969 house." },
      { title: "Steam enclosure, Forest River custom home", body: "A 1995 custom build off Burning Bush had a dedicated steam shower the builder had under-glazed. Full ⅜″ frameless steam enclosure: hinged door, two fixed panels, sealed transom, continuous gasketing. Polished-chrome hardware to match the original fixtures." },
    ],
    trendsTitle: "Mount Prospect's enduring choices",
    trendsParagraphs: [
      "Mount Prospect clients tend to skip trends. The choices we install here are <strong>simple frameless geometry</strong>, <strong>polished chrome or brushed nickel hardware</strong>, and <strong>clear or low-iron glass</strong> — finishes that will read well in 2046 as they do today.",
      "If you're trying to decide whether the upgrade to fully frameless is worth it for your project, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> walks through the long-term math.",
    ],
    faqs: [
      { q: "Do you do mirror work as part of the same project?", a: "Yes — many Mount Prospect remodels include a custom vanity mirror cut to the same project visit." },
      { q: "How do you handle older plumbing concerns near anchors?", a: "We map plumbing locations during measurement and route anchors to avoid them. If there's any question, we coordinate with your plumber before drilling." },
      { q: "Can you install in a bath with original tile we want to keep?", a: "Yes. We use wider clamp footprints to spread load on older tile and avoid cracking. Hundreds of period-tile installs in our portfolio." },
      { q: "How long does fabrication take?", a: "Standard frameless: 2-3 weeks from measure. Steam-rated assemblies: 3-4 weeks." },
    ],
    contactBlurb: "Most Mount Prospect estimates are booked within the week.",
  },
  {
    slug: "des-plaines-il",
    name: "Des Plaines",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/sliding-corner-marble.jpg",
    heroImageAlt: "Sliding shower door installed by Makibaki in a Des Plaines, IL bathroom",
    ogImage: "images/sliding-corner-marble.jpg",
    metaDescription: "Custom shower doors, sliding enclosures and frameless glass installed across Des Plaines, IL — Cumberland, Riverview, Forest Knolls. 224-427-9199.",
    intro: "Des Plaines has a deep stock of mid-century homes and a steady appetite for bath remodels. We install glass into Des Plaines bathrooms almost every week — bypass sliders for the smaller older masters, frameless walk-ins for the bigger primary baths in the newer subdivisions north of Oakton.",
    whyTitle: "Des Plaines has serious mid-century inventory",
    whyParagraphs: [
      "A meaningful portion of Des Plaines was built between 1955 and 1975. The original ranches and split-levels here have tight master baths, often 5×7 or smaller, with the standard 60-inch alcove tub. Two paths are common: retire the tub and rebuild as a walk-in (best ROI), or keep the tub and put a frameless bypass slider in front (best for resale).",
      "Either way, the wall framing in these homes is reliable and the install is predictable. Where we slow down is plumb — fifty years of settling means we always laser-check before fabrication. Cutting glass to a nominal 60-inch opening when the actual opening is 59 ⅝ on the bottom and 60 ⅛ on the top is the difference between a door that closes properly and one that doesn't.",
    ],
    neighborhoods: [
      { name: "Cumberland", body: "Original mid-century ranches. Tight masters; bypass sliders and inline panels do the most." },
      { name: "Riverview", body: "Older bungalows and Cape Cods near the river. Tub-to-shower conversions and pivot doors." },
      { name: "Forest Knolls", body: "Late '60s and '70s split-levels. Frameless walk-ins after gut remodels." },
      { name: "North Des Plaines / Oakton", body: "Newer construction with bigger primary baths. Frameless hinged doors with returns." },
      { name: "Near Lake Park", body: "Mid-century classics, often being modernized. Frameless and industrial-framed both show up." },
    ],
    projects: [
      { title: "Bypass slider, Cumberland ranch", body: "A homeowner off Henry Avenue had a tired aluminum-framed slider from the late '90s. Frameless ⅜″ bypass in polished chrome, single-visit install. The bathroom looked ten years newer that night." },
      { title: "Frameless walk-in, Forest Knolls split-level", body: "A 1972 split-level off Forest Avenue had its master tub pulled and rebuilt as a 60″ curbed walk-in shower. ⅜″ frameless inline panel with a polished-chrome wall clamp and corner support, header reinforced." },
      { title: "Frameless 90-degree return, North Des Plaines custom", body: "A 2008 build off Marshall Drive had a corner shower the builder had glazed in a basic framed unit. ⅜″ frameless 90-degree return with matte-black hardware, paired with the homeowner's recent matte-black plumbing upgrade." },
    ],
    trendsTitle: "What Des Plaines is asking for",
    trendsParagraphs: [
      "<strong>Bypass sliders</strong> remain the everyday product in Des Plaines — affordable, fast, dramatic improvement over a framed door or curtain. <strong>Frameless walk-ins</strong> are the upgrade most homeowners choose when they're remodeling anyway. <strong>Matte black</strong> is still the dominant hardware finish; <strong>brushed gold</strong> is emerging as the next thing.",
      "If you're weighing the upgrade from semi-frameless to fully frameless, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the trade-offs.",
    ],
    faqs: [
      { q: "Do I need a permit in Des Plaines?", a: "Glass-only replacement typically doesn't require a permit. Full remodels with plumbing or framing changes are permitted by your GC." },
      { q: "Can you install around an out-of-plumb opening?", a: "Yes — that's most of our work in older Des Plaines homes. We laser-check during measurement and fabricate to the actual opening." },
      { q: "How quickly can you start?", a: "Estimates within the week typically, fabrication 2-3 weeks from measure, install in a single visit." },
      { q: "Do you guarantee the install?", a: "Yes — lifetime install workmanship guarantee, hardware carries manufacturer warranty." },
    ],
    contactBlurb: "Same-week Des Plaines estimates available most weeks.",
  },
  {
    slug: "park-ridge-il",
    name: "Park Ridge",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/frameless-marble-black.jpg",
    heroImageAlt: "Frameless shower door installed by Makibaki in a Park Ridge, IL primary bath",
    ogImage: "images/frameless-marble-black.jpg",
    metaDescription: "Frameless shower doors, walk-in enclosures and custom glass installed across Park Ridge, IL — Uptown, South Park, Country Club. 224-427-9199.",
    intro: "Park Ridge homes tend to be older, well-loved, and meticulously maintained. The bathrooms we install glass into here are almost always part of a thoughtful remodel where the homeowners have made deliberate choices about tile, fixtures, and hardware long before we arrive to measure.",
    whyTitle: "Park Ridge clients know what they want",
    whyParagraphs: [
      "By the time we show up to a Park Ridge estimate, the homeowner usually has reference photos, fixture cut sheets, and a clear picture of the finished bathroom. Our job is to translate that vision into glass that actually fits, actually closes, and actually lasts. We respect the care these clients put into their homes and we install accordingly.",
      "Park Ridge has a high concentration of pre-WWII homes with original plaster walls, original wood blocking, and original everything. The measurement matters; the install matters. We don't rush either.",
    ],
    neighborhoods: [
      { name: "Uptown Park Ridge", body: "Historic district. Older brick and frame homes with character baths. Inline panels and pivot doors." },
      { name: "South Park", body: "Mid-century housing with bigger lots. Frameless walk-ins and 90-degree returns." },
      { name: "Country Club", body: "Larger custom homes. Steam enclosures, oversized walk-ins, low-iron glass." },
      { name: "North End", body: "Mix of historic and updated. Bungalows being modernized; tub-to-shower conversions." },
      { name: "Near Pickwick Theatre", body: "Older condos and townhomes. Bypass sliders and pivot doors." },
    ],
    projects: [
      { title: "Frameless pivot, Uptown 1922 bungalow", body: "A homeowner near Northwest Highway had a 30-inch second-floor bath the previous owners had retiled in subway tile. Single ⅜″ pivot panel anchored to wall with two heavy hinges, polished-chrome hardware. The footprint barely allowed swing clearance — measurement was critical." },
      { title: "Frameless walk-in with bench, South Park primary", body: "A 1958 ranch off Vine Avenue had its master bath gutted and rebuilt with a 60×42 walk-in shower and built-in tile bench. ½″ low-iron frameless hinged door with 36″ inline panel, brushed-nickel hardware." },
      { title: "Custom steam enclosure, Country Club estate", body: "A 1996 custom home off Glenview Road had a dedicated steam shower the builder had glazed inadequately. Full ½″ frameless steam enclosure with sealed transom and continuous gasketing. Polished-chrome hardware to match the original fixtures." },
    ],
    trendsTitle: "Park Ridge installs we're proud of",
    trendsParagraphs: [
      "Park Ridge homeowners gravitate to choices that read as deliberate rather than trendy. <strong>Low-iron frameless glass</strong>, <strong>classic hardware finishes</strong> (polished chrome, brushed nickel, the occasional aged brass), and <strong>simple geometry</strong> — single hinged doors with one fixed panel, executed well.",
      "If you're considering the upgrade from semi-frameless to fully frameless, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">guide</a> covers the trade-offs.",
    ],
    faqs: [
      { q: "Do you work in historic Uptown Park Ridge?", a: "Yes — many of our Park Ridge projects are in homes built before 1940. We handle older wall construction carefully." },
      { q: "Can you install custom-cut glass for non-standard openings?", a: "Yes. Every Park Ridge install is fabricated to the actual opening; we rarely use stock sizes here." },
      { q: "How do you protect plaster walls during install?", a: "Pre-drilled pilots, wider clamp footprints, careful torque on anchors. We've worked on hundreds of plaster-wall installs without cracking." },
      { q: "Do you do same-day repairs?", a: "If the hardware we need is in stock, often yes. Most repair calls are out within the week." },
    ],
    contactBlurb: "Park Ridge estimates typically booked within the same week.",
  },
  {
    slug: "northbrook-il",
    name: "Northbrook",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/frameless-herringbone-black.jpg",
    heroImageAlt: "Frameless shower door installed by Makibaki in a Northbrook, IL primary bath",
    ogImage: "images/frameless-herringbone-black.jpg",
    metaDescription: "Custom frameless shower doors, walk-in enclosures and luxury glass installed across Northbrook, IL — Crestwood, Indian Ridge, Mission Hills. 224-427-9199.",
    intro: "Northbrook is one of our home markets — we're a short drive away and we work here constantly. The bathrooms are usually generous, the remodel budgets are real, and the design intent is high. Most Northbrook installs end up using ½-inch low-iron glass and custom hardware because the rest of the bathroom deserves it.",
    whyTitle: "Northbrook is where we build our most ambitious enclosures",
    whyParagraphs: [
      "Northbrook primary baths are routinely 200+ square feet. Showers are big enough for two, with linear drains, built-in benches, dual rain heads, niches in three walls. The glass we install in those spaces is rarely a single-panel job — it's usually three or four panels, sometimes with a transom, often curbless with continuous floor channel.",
      "The fabrication side has to be just as careful. ½-inch low-iron glass weighs serious pounds per square foot; the hardware has to be rated, the wall blocking has to be reinforced, and the geometry has to be planned at the framing stage. We're often on a Northbrook job site three times — once to consult with the GC at framing, once to measure after tile, once to install.",
    ],
    neighborhoods: [
      { name: "Crestwood", body: "Established mid-century homes with major remodels. Frameless walk-ins with returns and transoms." },
      { name: "Indian Ridge", body: "Larger custom homes on bigger lots. Steam enclosures and oversized walk-ins are routine." },
      { name: "Mission Hills", body: "Townhomes with high-end finishes. Frameless hinged doors with inline panels." },
      { name: "Sunset Ridge corridor", body: "Custom estates. The most ambitious enclosures we build are usually here." },
      { name: "Northbrook East / near Cherry Lane", body: "Mid-century and newer homes mixed. Range of project types." },
    ],
    projects: [
      { title: "Curbless walk-in with linear drain, Indian Ridge estate", body: "A custom home off Sunset Ridge Road had a primary bath we genuinely didn't want to leave. Shower zone was 8×5, curbless, with a linear drain at the wall. Single ½″ low-iron frameless panel from floor to 9-foot ceiling, continuous polished-chrome floor channel, no door. The room felt 50% larger because there was no visual interruption." },
      { title: "Three-panel frameless enclosure, Crestwood remodel", body: "A 1962 ranch off Walters Avenue had been gutted and rebuilt as a contemporary primary suite. Shower was 6×4 with a hinged door, fixed inline, and 90-degree return. ½″ low-iron throughout, satin-brass hardware to match the rest of the fixtures." },
      { title: "Steam enclosure with transom, Mission Hills townhome", body: "A 2012 townhome off Mission Hills Road had a dedicated steam shower with high ceilings. Full ½″ frameless steam enclosure with sealed transom panel above the door, continuous gasketing, polished-chrome hardware." },
    ],
    trendsTitle: "What's defining Northbrook bathrooms in 2026",
    trendsParagraphs: [
      "Three trends define Northbrook installs right now. <strong>Curbless walk-ins</strong> with floor-to-ceiling panels and no doors — visually arresting and increasingly common. <strong>Low-iron ½-inch glass</strong> as the default for any premium install. <strong>Custom-finished hardware</strong> (satin brass, aged brass, custom-blackened bronze) replacing stock matte black on the most considered projects.",
      "If you're trying to decide between semi-frameless and fully frameless, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the trade-offs at every price point.",
    ],
    faqs: [
      { q: "Do you work with design-build firms in Northbrook?", a: "Yes — many of our Northbrook projects come through GCs and designers. We coordinate measure and install around the rest of the trades." },
      { q: "Can you do a fully curbless wet room?", a: "Yes — we install many curbless layouts in Northbrook. The drain detail and waterproofing are handled by your tile setter; we install the glass on top." },
      { q: "How tall can a single frameless panel go?", a: "Standard fabrication to 96 inches; taller is possible with custom engineering. Several Northbrook installs run to 108 inches with concealed ceiling clips." },
      { q: "Do you fabricate custom-colored hardware?", a: "We work with several finishing partners for custom blackened bronze and satin-brass treatments. Lead time is longer (4-5 weeks) but the result is one-of-a-kind." },
    ],
    contactBlurb: "Northbrook is on our doorstep — same-week estimates are typical.",
  },
  {
    slug: "glenview-il",
    name: "Glenview",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/custom-herringbone-walkin.jpg",
    heroImageAlt: "Custom frameless shower glass installed by Makibaki in a Glenview, IL bathroom",
    ogImage: "images/custom-herringbone-walkin.jpg",
    metaDescription: "Custom shower doors, walk-in enclosures and luxury frameless glass installed across Glenview, IL — The Glen, Swainwood, Heatherfield. 224-427-9199.",
    intro: "Glenview is one of those towns where the housing varies dramatically — older central neighborhoods with character homes, newer subdivisions in The Glen with planned modern layouts. We install glass into all of it, and the conversation looks completely different depending on which Glenview you're in.",
    whyTitle: "Two Glenviews, two installation conversations",
    whyParagraphs: [
      "Central Glenview — the area around the original village center — is older housing stock with established trees and thoughtful remodels. The bathrooms here are usually being upgraded carefully, with low-iron frameless glass, classic hardware, and meticulous tile work. The conversations are about preservation and quality.",
      "The Glen — the newer planned development on the former Naval Air Station site — is a completely different brief. Newer construction, larger primary baths, more contemporary design vocabularies. The installs here lean toward larger walk-ins, transom panels, and curbless layouts.",
    ],
    neighborhoods: [
      { name: "Central Glenview", body: "Established neighborhoods near the original village. Frameless walk-ins and inline panels in thoughtful remodels." },
      { name: "The Glen", body: "Planned community with newer construction. Larger walk-ins, transoms, curbless layouts." },
      { name: "Swainwood", body: "Mid-century homes on bigger lots. Major remodels with frameless 90-degree returns." },
      { name: "Heatherfield", body: "Townhomes and condos. Bypass sliders and frameless hinged doors." },
      { name: "Glen Oak Acres", body: "Custom homes. Steam enclosures and oversized walk-ins." },
    ],
    projects: [
      { title: "Curbless walk-in, The Glen new build", body: "A 2018 build in The Glen had a primary bath designed around a 7×4 curbless shower zone with a linear drain. ½″ low-iron frameless panel running floor to ceiling, no door, continuous polished-chrome floor channel. The bathroom felt like a hotel spa." },
      { title: "Frameless walk-in with bench, Central Glenview remodel", body: "A 1955 ranch off Greenwood Road had its master bath gutted and rebuilt with a 60×42 walk-in shower and built-in tile bench. ⅜″ frameless hinged door with 36″ inline panel, brushed-nickel hardware." },
      { title: "Three-panel enclosure with transom, Swainwood primary", body: "A custom remodel off Sleepy Hollow had a 6×5 shower zone with 10-foot ceilings. Three-panel ½″ frameless layout with sealed transom above the door. Hardware in satin brass." },
    ],
    trendsTitle: "Glenview's split-personality trend report",
    trendsParagraphs: [
      "In central Glenview, the trend is <strong>preservation-friendly frameless</strong> — minimal hardware, clear or low-iron glass, classic finishes that defer to the rest of the bathroom. In The Glen, the trend is <strong>contemporary curbless layouts</strong> with maximal glass and minimal interruption.",
      "If you're weighing the trade-offs between frameless and semi-frameless for your Glenview project, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> walks through the practical differences.",
    ],
    faqs: [
      { q: "Do you work in The Glen subdivision?", a: "Yes — The Glen is a regular part of our service area. Many of our larger curbless installs come from there." },
      { q: "Can you install curbless layouts?", a: "Yes — once the tile setter has finished the pan and waterproofing, we install the glass channel on top. We coordinate with whoever's doing the wet work." },
      { q: "How thick should my glass be?", a: "⅜″ is fine for most enclosures up to 6×4. ½″ is appropriate for larger panels, taller heights, or any door without a header. We recommend at the estimate." },
      { q: "How long does fabrication take?", a: "Standard frameless: 2-3 weeks from measure. Custom curbless or transom assemblies: 3-4 weeks." },
    ],
    contactBlurb: "Glenview estimates are typically booked within the same week.",
  },
  {
    slug: "highland-park-il",
    name: "Highland Park",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/steam-marble-spa.jpg",
    heroImageAlt: "Custom steam enclosure installed by Makibaki in a Highland Park, IL primary bath",
    ogImage: "images/steam-marble-spa.jpg",
    metaDescription: "Custom shower doors, steam enclosures and luxury frameless glass installed across Highland Park, IL — Ravinia, Sherwood Forest, Sunset Woods. 224-427-9199.",
    intro: "Highland Park is where we build some of our most ambitious work. The homes are large, the design briefs are considered, and the remodels often involve architects and interior designers rather than just contractors. The glass we install here is rarely off-the-shelf.",
    whyTitle: "Highland Park installs are usually designer-led",
    whyParagraphs: [
      "When we walk into a Highland Park primary bath, there's almost always a designer in the room. The tile is specified, the fixtures are chosen, and we're being asked to deliver glass that completes the design rather than starts it. That's a great brief for us — we get to focus on execution, geometry, and hardware refinement.",
      "Many of our Highland Park installs are also our most technical: steam-rated enclosures, curbless wet rooms, custom transom panels above doors that are themselves over 8 feet tall. We've earned a quiet reputation for being the shop designers in Highland Park call when the project gets complicated.",
    ],
    neighborhoods: [
      { name: "Ravinia", body: "Older homes near the Festival. Character remodels with frameless walk-ins and pivot doors." },
      { name: "Sherwood Forest", body: "Established mid-century with mature lots. Frameless walk-ins and 90-degree returns." },
      { name: "Sunset Woods", body: "Larger custom homes. Steam enclosures, oversized walk-ins, custom transoms." },
      { name: "Fort Sheridan area", body: "Mix of historic and luxury. Custom-finished hardware and ½″ low-iron glass." },
      { name: "Lake bluff border", body: "Larger estates. Multi-panel frameless enclosures, sometimes with custom-laminated glass." },
    ],
    projects: [
      { title: "Steam enclosure with transom, Sunset Woods estate", body: "A custom home off Sheridan Road had a dedicated steam shower with 10-foot ceilings and a fully tiled bench. Full ½″ low-iron frameless steam enclosure: hinged door at 96 inches, sealed transom above to ceiling, continuous gasketing top to bottom. Hardware in satin brass to match the existing plumbing." },
      { title: "Curbless wet room, Sherwood Forest remodel", body: "A 1960s ranch had its primary bath rebuilt as a 8×6 curbless wet room with a linear drain. Two ½″ low-iron panels — one fixed floor-to-ceiling at the entry, one as a splash divider for the toilet area. No doors, no curbs. Architect-led project." },
      { title: "Custom-laminated splash panel, Ravinia historic remodel", body: "A 1924 home near the Festival had a primary bath that needed a splash panel between the shower and the freestanding tub. We custom-laminated two pieces of ⅜″ low-iron glass with a textured-linen interlayer for privacy without losing light transmission. Bronze hardware." },
    ],
    trendsTitle: "What's defining Highland Park bathrooms",
    trendsParagraphs: [
      "Three things we keep installing in Highland Park: <strong>full steam-rated enclosures</strong> that finally allow homeowners to use the steam feature their builder under-glazed; <strong>curbless wet rooms</strong> with multiple glass panels rather than doors; and <strong>custom-laminated specialty glass</strong> for privacy panels, splash dividers, and partition walls in larger primary suites.",
      "If you're weighing the trade-offs between frameless and semi-frameless for a more standard project, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the practical differences.",
    ],
    faqs: [
      { q: "Do you work with architects and designers?", a: "Yes — many of our Highland Park projects are designer- or architect-led. We can engage at the framing stage to coordinate wall blocking, glass thickness, and hardware specification before tile goes on." },
      { q: "Can you build a full steam-rated enclosure?", a: "Yes. We use continuous gasketing, sealed transom panels, and steam-rated hardware. The assembly is engineered to hold steam without leakage." },
      { q: "Do you do laminated specialty glass?", a: "Yes — for splash panels, privacy dividers, and partition walls. We can incorporate interlayers (linen, frosted, custom prints) and combine glass thicknesses." },
      { q: "What's the lead time on a complex enclosure?", a: "Steam-rated and multi-panel assemblies: typically 4-5 weeks from measure. Curbless wet rooms with custom hardware: similar." },
    ],
    contactBlurb: "Highland Park estimates are typically booked within the same week.",
  },
  {
    slug: "lake-forest-il",
    name: "Lake Forest",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/steam-freestanding-marble.jpg",
    heroImageAlt: "Luxury frameless steam shower installed by Makibaki in a Lake Forest, IL primary bath",
    ogImage: "images/steam-freestanding-marble.jpg",
    metaDescription: "Custom shower doors, steam enclosures and luxury glass installed across Lake Forest, IL — East Lake Forest, Conway Farms, Knollwood. 224-427-9199.",
    intro: "Lake Forest is where the budgets are real, the homes are established, and the bathrooms are large enough that the shower glass is usually the focal point of the room rather than a utility object. The installs we do here tend to be considered, technical, and built to last for decades.",
    whyTitle: "Lake Forest installs are generational",
    whyParagraphs: [
      "Lake Forest clients don't remodel often, but when they do, they do it properly. The glass we install here is typically ½-inch low-iron, with custom-finished hardware that's been specified months in advance. The conversations are about decades of use, not seasons of trend.",
      "Many of our Lake Forest projects are part of larger renovations that involve relocating walls, raising ceilings, and rebuilding plumbing. We're often consulted at the framing stage so the wall blocking and glass geometry can be planned together. That's the difference between an enclosure that fits perfectly and one that looks like it was added at the end.",
    ],
    neighborhoods: [
      { name: "East Lake Forest / near the bluff", body: "Historic estates. Multi-panel frameless enclosures with custom-finished hardware." },
      { name: "Conway Farms", body: "Newer luxury construction. Steam enclosures and oversized walk-ins." },
      { name: "Knollwood", body: "Established mid-century homes. Frameless walk-ins and 90-degree returns." },
      { name: "West Lake Forest", body: "Larger lots with custom builds. Curbless layouts, transom panels, ½″ low-iron throughout." },
      { name: "Lake Forest College area", body: "Older character homes. Pivot doors and inline panels in carefully preserved baths." },
    ],
    projects: [
      { title: "Multi-panel enclosure, East Lake Forest estate", body: "A historic home near Sheridan Road had its primary bath rebuilt with an 8×6 shower zone, built-in bench, and 10-foot ceilings. Four-panel ½″ low-iron frameless layout: hinged door, inline panel, 90-degree return, and sealed transom above. Hardware was custom-finished in oil-rubbed bronze to match the existing fixtures." },
      { title: "Steam enclosure, Conway Farms primary", body: "A custom home off Conway Farms Road had a dedicated steam shower with built-in seating and dual rain heads. Full ½″ low-iron frameless steam enclosure: hinged door, two fixed panels, sealed transom, continuous gasketing. Hardware in satin nickel." },
      { title: "Curbless wet room, West Lake Forest new build", body: "A 2020 build off Ridge Road had a primary suite designed around a 9×6 curbless wet room with a linear drain at the wall. Two ½″ low-iron panels — one floor-to-ceiling at the entry, one as a splash divider — no doors. Continuous polished-chrome floor channel." },
    ],
    trendsTitle: "Lake Forest installs we keep building",
    trendsParagraphs: [
      "The dominant Lake Forest install is the <strong>multi-panel frameless enclosure with custom-finished hardware</strong> — three or four panels of ½-inch low-iron glass, hardware that's been blackened, brassed, or otherwise treated to fit the rest of the bathroom exactly. <strong>Steam-rated assemblies</strong> are common; <strong>curbless wet rooms</strong> are increasingly common in newer builds.",
      "For a more standard primary bath, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the trade-offs between frameless and semi-frameless.",
    ],
    faqs: [
      { q: "Do you work directly with Lake Forest architects?", a: "Yes — many of our Lake Forest projects come through architects and design-build firms. We engage at the framing stage when possible." },
      { q: "Can you custom-finish hardware to match existing fixtures?", a: "Yes — we work with several finishing partners for blackened bronze, satin brass, and other custom treatments. Lead time is 4-5 weeks." },
      { q: "How thick should the glass be?", a: "½″ low-iron is the default for any Lake Forest primary bath install. Standard ⅜″ is used only for smaller secondary baths." },
      { q: "Will the install need an architect or just a contractor?", a: "Depends on scope. Glass-only replacements need neither. Larger remodels with framing changes typically involve your existing design team." },
    ],
    contactBlurb: "Lake Forest estimates are scheduled around your design team's timeline.",
  },
  {
    slug: "buffalo-grove-il",
    name: "Buffalo Grove",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/sliding-gold-bench.jpg",
    heroImageAlt: "Sliding shower door installed by Makibaki in a Buffalo Grove, IL primary bath",
    ogImage: "images/sliding-gold-bench.jpg",
    metaDescription: "Custom shower doors, sliding enclosures and frameless glass installed across Buffalo Grove, IL — Strathmore, Cambridge Country, Chevy Chase. 224-427-9199.",
    intro: "Buffalo Grove is a steady, well-organized village with housing stock that ranges from 1970s ranches to early-2000s subdivisions. The bathrooms we install glass into here tend to be reasonable in size, well-built, and ready for a meaningful upgrade with the right glass.",
    whyTitle: "Buffalo Grove rewards careful planning",
    whyParagraphs: [
      "Most Buffalo Grove primary baths are between 60 and 100 square feet, with a separate tub and shower already framed by the builder. That's a great starting point — the geometry is usually fine and the wall blocking is usually adequate. Our job is mostly about choosing the right glass, the right hardware, and the right configuration for the actual use of the space.",
      "Where we slow down is on bathrooms that haven't been touched since the original build. The hardware that came with the house was almost always builder-grade, and the framed shower door has usually outlived its useful life. Replacing it with a frameless enclosure is often the single biggest visual change a homeowner can make.",
    ],
    neighborhoods: [
      { name: "Strathmore", body: "1970s ranches and split-levels. Tub-to-shower conversions and frameless inline panels." },
      { name: "Cambridge Country", body: "1980s and '90s single-family. Frameless hinged doors with returns." },
      { name: "Chevy Chase", body: "Townhomes with bigger primary baths than typical. Frameless walk-ins are common." },
      { name: "Old Buffalo Grove", body: "Original village area. Mix of older homes with modest masters." },
      { name: "Near Lake Cook Road", body: "Newer subdivisions with prepped framing. Easy installs, larger primary baths." },
    ],
    projects: [
      { title: "Frameless walk-in, Strathmore ranch", body: "A 1976 ranch off Strathmore Lane had its master tub pulled and rebuilt as a 60″ curbed walk-in. ⅜″ frameless inline panel with brushed-nickel hardware. The change from cramped alcove tub to open walk-in shower was the kind of remodel that made the owners regret waiting." },
      { title: "Hinged frameless door + inline, Cambridge Country", body: "A 1992 colonial off Cambridge Drive had a 60×36 shower the builder had framed in basic bronze. ⅜″ frameless hinged door with 24″ fixed inline panel, matte-black hardware to match recent fixture updates." },
      { title: "Bypass slider, Chevy Chase townhome", body: "A second-floor guest bath off Chevy Chase had a tired aluminum slider. Frameless ⅜″ bypass in brushed nickel, one-visit install." },
    ],
    trendsTitle: "What Buffalo Grove is asking for",
    trendsParagraphs: [
      "<strong>Frameless walk-ins</strong> are the most-requested upgrade in Buffalo Grove right now — homeowners who've lived with a basic framed door for 20+ years are ready for something that reads as designed. <strong>Matte black</strong> remains the dominant hardware finish; <strong>brushed gold</strong> is showing up on transitional bathrooms.",
      "If you're weighing frameless against semi-frameless, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the trade-offs.",
    ],
    faqs: [
      { q: "What's the typical price range for a Buffalo Grove install?", a: "Bypass sliders $1,200-$1,800. Frameless inline panels $1,500-$2,800. Full frameless enclosures $2,500-$5,500 depending on size and glass thickness." },
      { q: "Can I keep my existing tile?", a: "Yes — most of our installs are over existing tile. We measure to the finished surface." },
      { q: "How long is the typical install?", a: "2-6 hours depending on configuration. Most are completed in a single visit." },
      { q: "Do you do same-week estimates?", a: "Usually yes for Buffalo Grove — we're a short drive away." },
    ],
    contactBlurb: "Buffalo Grove estimates typically booked the same week of your call.",
  },
  {
    slug: "wheeling-il",
    name: "Wheeling",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/sliding-black-white.jpg",
    heroImageAlt: "Sliding shower door installed by Makibaki in a Wheeling, IL bathroom",
    ogImage: "images/sliding-black-white.jpg",
    metaDescription: "Custom shower doors, sliding enclosures and frameless glass installed across Wheeling, IL — Heatherwood, Lexington Commons, Strathmore Square. 224-427-9199.",
    intro: "Wheeling has a wide range of housing — older single-family near downtown, townhomes and condos throughout, newer single-family subdivisions on the west end. We install glass into all of them, and the most common project type here is the bypass slider replacement on a tired framed door from the late '90s.",
    whyTitle: "Wheeling is a townhome-heavy market with a lot of slider work",
    whyParagraphs: [
      "A meaningful portion of Wheeling housing is townhome and condo stock, and the standard configuration is an alcove tub with a framed sliding door. When those original doors hit 20-25 years old, they start to look tired — discolored frame, foggy glass, peeling vinyl. The fastest, highest-impact replacement is a frameless bypass slider.",
      "We do plenty of full frameless walk-ins in the newer single-family stock too. But the volume product in Wheeling is bypass sliders, and we've installed hundreds of them. Most are done in a single 2-3 hour visit with no demo, no permit, and no follow-up needed.",
    ],
    neighborhoods: [
      { name: "Heatherwood", body: "Townhomes throughout. Bypass sliders are the standard." },
      { name: "Lexington Commons", body: "Newer single-family. Frameless hinged doors and walk-ins." },
      { name: "Strathmore Square", body: "Condo and townhome stock. Bypass sliders and pivot doors." },
      { name: "Old Wheeling / downtown", body: "Older single-family with modest masters. Inline panels and tub-to-shower conversions." },
      { name: "Near Restaurant Row", body: "Mix of newer construction. Frameless walk-ins after gut remodels." },
    ],
    projects: [
      { title: "Bypass slider, Heatherwood townhome", body: "A homeowner off Heather Lane had a tired 1998 framed slider — bent track, discolored vinyl. Frameless ⅜″ bypass in brushed nickel, single visit, three hours total." },
      { title: "Frameless walk-in, Lexington Commons single-family", body: "A 2005 build off Lexington Drive had its master tub pulled and rebuilt as a 60″ curbed walk-in. ⅜″ frameless inline panel with polished-chrome hardware." },
      { title: "Pivot door, downtown Wheeling bungalow", body: "An older home near Dundee Road had a tight second-floor bath the owners had recently retiled. Single ⅜″ pivot panel anchored to wall, brushed-nickel hardware." },
    ],
    trendsTitle: "What we install most in Wheeling",
    trendsParagraphs: [
      "Bypass sliders are still the volume product here — they solve the tired-door problem for a reasonable budget. <strong>Frameless walk-ins</strong> are the upgrade most owners go for when they're remodeling anyway. <strong>Brushed nickel and polished chrome</strong> remain the everyday finishes; <strong>matte black</strong> is the choice when homeowners want something more current.",
      "If you're weighing the upgrade to fully frameless, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the trade-offs.",
    ],
    faqs: [
      { q: "Can you replace just a tired framed slider?", a: "Yes — that's one of the most common Wheeling jobs. Single-visit install, typically $1,200-$1,800 complete." },
      { q: "Do you handle the disposal of the old door?", a: "Yes — old hardware and glass are removed and disposed of as part of the install." },
      { q: "Will the new slider fit my existing alcove?", a: "We custom-cut to your actual opening. Standard alcove widths are 56-60 inches; we handle 48-72." },
      { q: "How quickly can you start?", a: "Often within the week for sliders. Custom frameless work is 2-3 weeks from measure." },
    ],
    contactBlurb: "We can usually be at your Wheeling door within the week.",
  },
  {
    slug: "vernon-hills-il",
    name: "Vernon Hills",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/enclosure-travertine-corner.jpg",
    heroImageAlt: "Frameless corner shower enclosure installed by Makibaki in a Vernon Hills, IL bathroom",
    ogImage: "images/enclosure-travertine-corner.jpg",
    metaDescription: "Frameless shower doors, corner enclosures and custom glass installed across Vernon Hills, IL — New Century Town, Deerpath, Centennial. 224-427-9199.",
    intro: "Vernon Hills is one of the more uniformly newer towns we serve — most of the housing stock went up between the late 1980s and the early 2000s, with planned subdivisions throughout. The primary baths are usually reasonably sized, the framing is straightforward, and the installs tend to be efficient.",
    whyTitle: "Vernon Hills was framed for glass",
    whyParagraphs: [
      "Most Vernon Hills homes were built during a period when separate showers and tubs were standard in primary baths, and the rough openings were sized with an eye toward eventual glass enclosures. That makes our job easier — wall blocking is usually adequate, openings are usually square, and the installs are usually predictable.",
      "The most common Vernon Hills upgrade is replacing the original builder-grade framed shower door with a frameless hinged door or a 90-degree corner return. Both are single-visit installs and both deliver a major visual change.",
    ],
    neighborhoods: [
      { name: "New Century Town", body: "Late '80s through '90s subdivision. Frameless hinged doors with inline panels." },
      { name: "Deerpath", body: "1990s single-family. Frameless 90-degree returns and walk-ins." },
      { name: "Centennial", body: "Mid-90s subdivision. Frameless hinged doors over corner showers." },
      { name: "Hawthorn Woods border", body: "Larger lots, newer construction. Walk-ins with returns and transoms." },
      { name: "Westchester", body: "Townhomes and condos. Bypass sliders over alcove tubs." },
    ],
    projects: [
      { title: "Frameless 90-degree return, Deerpath primary", body: "A 1996 build off Deerpath Drive had a 42×42 corner shower the builder had framed in bronze. ⅜″ frameless 90-degree return with matte-black hardware, paired with the homeowner's recent matte-black fixture upgrade." },
      { title: "Frameless hinged door + inline, New Century Town", body: "A 1991 home off Lakeview Parkway had a 60×36 shower with a framed pivot door from the original build. ⅜″ frameless hinged door with 24″ fixed inline panel, brushed-nickel hardware." },
      { title: "Frameless walk-in, Centennial remodel", body: "A 1994 build off Hartford had its master tub pulled and the alcove rebuilt as a 60″ curbed walk-in. Single ⅜″ frameless inline panel, polished-chrome hardware." },
    ],
    trendsTitle: "What Vernon Hills is buying",
    trendsParagraphs: [
      "<strong>Frameless 90-degree returns</strong> are the dominant request — Vernon Hills primary baths often have corner showers and that's the cleanest way to glass them. <strong>Matte black hardware</strong> remains the most-requested finish; <strong>brushed gold</strong> is the emerging alternative.",
      "If you're weighing frameless against semi-frameless, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the trade-offs.",
    ],
    faqs: [
      { q: "Do you do same-day installs?", a: "For glass we have in stock, often yes. Most custom frameless is 2-3 weeks from measure." },
      { q: "Can you match my existing matte-black fixtures?", a: "Yes — matte black is one of our standard finishes, and we can color-match to specific fixture brands." },
      { q: "What's the warranty?", a: "Lifetime install workmanship guarantee. Hardware carries manufacturer warranty." },
      { q: "Do you do mirror work as well?", a: "Yes — custom vanity mirrors are often added to the same install visit." },
    ],
    contactBlurb: "Vernon Hills estimates are typically booked the same week.",
  },
  {
    slug: "libertyville-il",
    name: "Libertyville",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/frameless-marble-tub.jpg",
    heroImageAlt: "Frameless shower door installed by Makibaki in a Libertyville, IL bathroom",
    ogImage: "images/frameless-marble-tub.jpg",
    metaDescription: "Custom shower doors, walk-in enclosures and frameless glass installed across Libertyville, IL — downtown, Greentree, Copeland Manor. 224-427-9199.",
    intro: "Libertyville is one of the more architecturally varied towns we work in — a walkable downtown surrounded by neighborhoods spanning from 1910s craftsman through 2010s new construction. We install glass into all of it, and the variety keeps the work interesting.",
    whyTitle: "Libertyville's range is what makes it fun to work in",
    whyParagraphs: [
      "In one week we might install a single pivot panel in a 1914 craftsman near downtown, a frameless 90-degree return in a 1985 colonial out toward Copeland Manor, and a curbless walk-in in a 2019 custom build on Greentree. The skill set is the same; the conversations are completely different.",
      "What makes Libertyville installs reliably good is that homeowners here tend to invest in their homes for the long term. The remodels are usually done thoughtfully, with quality tile and fixtures, and the glass we install is being asked to complement work that will last 20-30 years.",
    ],
    neighborhoods: [
      { name: "Downtown Libertyville", body: "Older craftsman and Cape Cod homes. Inline panels and pivot doors in carefully preserved baths." },
      { name: "Greentree", body: "Established mid-century. Frameless walk-ins and 90-degree returns." },
      { name: "Copeland Manor", body: "Larger custom homes. Steam enclosures and oversized walk-ins." },
      { name: "Adler Park area", body: "Mix of older and updated. Frameless hinged doors and pivot panels." },
      { name: "Near Butler Lake", body: "Newer single-family. Curbless layouts and transom panels." },
    ],
    projects: [
      { title: "Pivot door, downtown Libertyville craftsman", body: "A 1914 craftsman near Milwaukee Avenue had its only full bath gutted and rebuilt with period-appropriate hex floor and subway walls. Single ⅜″ pivot panel anchored to wall, aged-brass hardware to match the rest of the restoration." },
      { title: "Frameless walk-in, Greentree primary", body: "A 1968 home off Greentree Parkway had its master tub pulled and the alcove rebuilt as a 60×36 curbed walk-in. ⅜″ frameless hinged door with 24″ fixed inline panel, brushed-nickel hardware." },
      { title: "Curbless wet room, Copeland Manor custom", body: "A 2019 build off Copeland Drive had a primary suite designed around a 7×4 curbless wet room with a linear drain. ½″ low-iron frameless panel floor to ceiling, polished-chrome floor channel." },
    ],
    trendsTitle: "Libertyville's mix",
    trendsParagraphs: [
      "Because the housing stock is so varied, the trends are too. <strong>Aged brass</strong> is increasingly common on character remodels in older homes. <strong>Low-iron frameless glass</strong> is standard on premium new construction. <strong>Matte black</strong> remains popular on transitional remodels.",
      "If you're choosing between frameless and semi-frameless, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">guide</a> covers the practical differences.",
    ],
    faqs: [
      { q: "Do you work in historic downtown Libertyville?", a: "Yes — many of our Libertyville projects are in homes built before 1940. We handle older plaster walls and original framing carefully." },
      { q: "Can you do period-appropriate hardware?", a: "Yes — aged brass, unlacquered brass, and oil-rubbed bronze are all standard options for character remodels." },
      { q: "How long is fabrication?", a: "Standard frameless: 2-3 weeks from measure. Specialty hardware or curbless layouts: 3-4 weeks." },
      { q: "Do you do mirrors as part of the same project?", a: "Yes — custom vanity mirrors are commonly added to the same install visit." },
    ],
    contactBlurb: "Libertyville estimates are typically booked within the week.",
  },
  {
    slug: "lincolnshire-il",
    name: "Lincolnshire",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/steam-chevron-black.jpg",
    heroImageAlt: "Custom steam shower installed by Makibaki in a Lincolnshire, IL primary bath",
    ogImage: "images/steam-chevron-black.jpg",
    metaDescription: "Custom shower doors, steam enclosures and luxury frameless glass installed across Lincolnshire, IL — Stevenson High area, Pembridge, Whytegate. 224-427-9199.",
    intro: "Lincolnshire is a smaller, well-maintained village with a high proportion of larger custom and semi-custom homes. The bathrooms we install glass into here tend to be generous, well-built, and ready for premium materials.",
    whyTitle: "Lincolnshire installs lean premium",
    whyParagraphs: [
      "Most Lincolnshire primary baths are 150+ square feet, with separate tubs and showers, often dual vanities, and frequently a dedicated water closet. The glass we install in these spaces is typically ½-inch low-iron with custom hardware, configured as a multi-panel enclosure rather than a single door.",
      "Lincolnshire homeowners tend to commit to their homes for decades, and the remodels reflect that. The hardware finishes get specified months in advance; the tile is high-end; the glass is meant to last as long as everything else. Our job is to execute precisely and not be the trade that causes a delay.",
    ],
    neighborhoods: [
      { name: "Pembridge", body: "Larger semi-custom homes. Frameless walk-ins with returns and transoms." },
      { name: "Whytegate", body: "Established custom housing. Steam enclosures and oversized walk-ins." },
      { name: "Stevenson High area", body: "Established neighborhoods near the high school. Frameless walk-ins and 90-degree returns." },
      { name: "Near the country club", body: "Larger estates. Multi-panel frameless with custom-finished hardware." },
      { name: "Townhomes near Half Day", body: "Bypass sliders and frameless hinged doors over alcove tubs." },
    ],
    projects: [
      { title: "Steam enclosure with transom, Pembridge primary", body: "A custom home off Pembridge Drive had a dedicated steam shower with 10-foot ceilings. Full ½″ low-iron frameless steam enclosure: hinged door, two fixed panels, sealed transom panel above, continuous gasketing. Hardware in satin nickel." },
      { title: "Frameless walk-in, Whytegate remodel", body: "A 1990s home off Whytegate Court had its primary bath rebuilt with a 72×42 walk-in shower and built-in bench. ½″ low-iron frameless hinged door with 42″ inline panel and 36″ return, brushed-nickel hardware." },
      { title: "Three-panel enclosure, Stevenson area custom", body: "A custom build near Old Mill Road had a 6×4 shower zone with a 90-degree corner entry. ½″ low-iron three-panel frameless layout: hinged door, fixed inline, fixed return. Hardware in polished chrome." },
    ],
    trendsTitle: "What Lincolnshire is installing",
    trendsParagraphs: [
      "The defining Lincolnshire install is <strong>multi-panel ½-inch low-iron frameless</strong> with hardware that's been chosen by a designer rather than picked from a stock catalog. <strong>Steam-rated enclosures</strong> are common in primary baths designed for serious daily use. <strong>Custom transom panels</strong> show up frequently on tall-ceilinged installs.",
      "If you're considering a more standard remodel, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the trade-offs between frameless and semi-frameless.",
    ],
    faqs: [
      { q: "Do you do steam-rated enclosures?", a: "Yes — we build full steam enclosures with continuous gasketing, sealed transoms, and steam-rated hardware." },
      { q: "Can you coordinate with our designer?", a: "Yes — many of our Lincolnshire projects are designer-led. We work to their hardware and finish specifications." },
      { q: "How thick should the glass be?", a: "½″ low-iron is the default for any Lincolnshire primary bath install." },
      { q: "How long does a complex enclosure take to fabricate?", a: "Multi-panel and steam-rated assemblies: typically 4-5 weeks from measure." },
    ],
    contactBlurb: "Lincolnshire estimates booked around your designer or builder's schedule.",
  },
  {
    slug: "bannockburn-il",
    name: "Bannockburn",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/steam-black-frame-marble.jpg",
    heroImageAlt: "Custom shower enclosure installed by Makibaki in a Bannockburn, IL primary bath",
    ogImage: "images/steam-black-frame-marble.jpg",
    metaDescription: "Custom shower doors and luxury frameless glass installed across Bannockburn, IL. Multi-panel enclosures, steam showers, custom finishes. 224-427-9199.",
    intro: "Bannockburn is one of our smallest service-area villages by population but one of our most consistent for high-end installs. The homes here are large, the design briefs are considered, and the glass we install tends to be technically interesting.",
    whyTitle: "Small village, ambitious projects",
    whyParagraphs: [
      "Bannockburn's housing stock is predominantly larger custom homes on substantial lots. Primary baths are routinely 150-250 square feet, often with separate water closets, dual vanities, and dedicated dressing areas. The shower zone is typically 6×4 or larger, and the glass is usually a multi-panel frameless enclosure.",
      "Many of our Bannockburn projects involve coordinating with the homeowner's existing designer, GC, and tile setter. We measure carefully, fabricate to spec, and install precisely. The work tends to take longer to plan than to execute — by the time we're installing, every detail has been worked out.",
    ],
    neighborhoods: [
      { name: "Central Bannockburn", body: "Larger custom homes. Multi-panel frameless enclosures with custom hardware." },
      { name: "Near the country club", body: "Established estates. Steam enclosures, oversized walk-ins." },
      { name: "Half Day Road corridor", body: "Mix of newer custom builds. Curbless layouts and transom panels." },
      { name: "Near Trinity College", body: "Established residential. Frameless walk-ins with returns." },
    ],
    projects: [
      { title: "Multi-panel enclosure, central Bannockburn primary", body: "A custom home off Telegraph Road had a primary bath with a 7×5 shower zone and 9-foot ceilings. Four-panel ½″ low-iron frameless layout with sealed transom above the door, all in satin-brass hardware." },
      { title: "Steam enclosure, near country club", body: "A custom estate had a dedicated steam room with built-in seating. Full ½″ low-iron steam-rated enclosure with continuous gasketing and concealed hardware in polished chrome." },
      { title: "Curbless wet room, Half Day Road new build", body: "A 2021 build had a primary suite designed around a 9×5 curbless wet room. Two ½″ low-iron panels floor to ceiling, no doors, continuous floor channel." },
    ],
    trendsTitle: "Bannockburn installs",
    trendsParagraphs: [
      "The Bannockburn install is almost always <strong>premium frameless</strong> — ½-inch low-iron glass, custom hardware finishes, multi-panel geometry. <strong>Steam enclosures</strong> and <strong>curbless wet rooms</strong> are both common in newer construction.",
      "Our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the trade-offs if you're considering a less premium option.",
    ],
    faqs: [
      { q: "Do you work with Bannockburn designers and architects?", a: "Yes — most of our Bannockburn projects are designer- or architect-led." },
      { q: "Can you do custom hardware finishes?", a: "Yes — we work with finishing partners for blackened bronze, satin brass, and other custom treatments." },
      { q: "How long is the lead time?", a: "4-5 weeks for premium multi-panel installs with custom hardware." },
      { q: "Do you guarantee the install?", a: "Yes — lifetime install workmanship guarantee." },
    ],
    contactBlurb: "Bannockburn estimates are scheduled around your design team.",
  },
  {
    slug: "riverwoods-il",
    name: "Riverwoods",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/enclosure-travertine-walkin.jpg",
    heroImageAlt: "Frameless walk-in enclosure installed by Makibaki in a Riverwoods, IL primary bath",
    ogImage: "images/enclosure-travertine-walkin.jpg",
    metaDescription: "Custom shower doors and frameless glass installed across Riverwoods, IL. Premium frameless walk-ins, steam enclosures, multi-panel installs. 224-427-9199.",
    intro: "Riverwoods is a wooded, low-density village where the homes are large, lots are substantial, and remodels are usually thoughtful additions to homes the owners plan to keep for the long term. The glass we install here is almost always frameless, almost always low-iron, and almost always part of a larger renovation.",
    whyTitle: "Riverwoods is the long-haul homeowner's market",
    whyParagraphs: [
      "Riverwoods residents tend to stay in their homes. The remodels reflect that — they're investments in spaces meant to be enjoyed for decades, not flipped in five years. The glass we install here is chosen with that mindset: ½-inch low-iron, classic geometry, hardware that won't date.",
      "Most of our Riverwoods projects come through a designer or design-build firm. We engage at the measurement stage, coordinate with the rest of the trades, and install on a precise schedule. The work is steady and the standards are high.",
    ],
    neighborhoods: [
      { name: "Central Riverwoods", body: "Custom homes on wooded lots. Multi-panel frameless enclosures." },
      { name: "Near Riverwoods Preserve", body: "Larger estates. Steam enclosures and oversized walk-ins." },
      { name: "Deerfield border", body: "Mix of newer and established. Frameless walk-ins with returns." },
      { name: "Lincolnshire border", body: "Premium custom housing. Curbless layouts and transom panels." },
    ],
    projects: [
      { title: "Frameless walk-in with transom, central Riverwoods", body: "A custom home off Saunders Road had a primary bath with a 7×4 shower zone and 10-foot ceilings. ½″ low-iron frameless hinged door with sealed transom panel above, 36″ inline panel. Hardware in satin nickel." },
      { title: "Steam enclosure, near preserve", body: "An estate had a dedicated steam shower with built-in bench. Full ½″ low-iron steam-rated frameless enclosure with continuous gasketing." },
      { title: "Curbless wet room, Deerfield border", body: "A 2020 build had a primary suite with a 6×5 curbless wet room and linear drain. Single ½″ low-iron floor-to-ceiling panel, no door." },
    ],
    trendsTitle: "What we install in Riverwoods",
    trendsParagraphs: [
      "<strong>Premium frameless</strong> defines the Riverwoods install — ½-inch low-iron, multi-panel geometry, custom-finished hardware. <strong>Curbless wet rooms</strong> are increasingly common in newer custom builds.",
      "If you're considering a less premium option, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the trade-offs.",
    ],
    faqs: [
      { q: "Do you coordinate with our GC and designer?", a: "Yes — most of our Riverwoods work is multi-trade coordinated." },
      { q: "How long is the lead time for a custom install?", a: "4-5 weeks for multi-panel premium installs." },
      { q: "Can you do steam-rated enclosures?", a: "Yes — full steam-rated assemblies with continuous gasketing." },
      { q: "Do you guarantee the install?", a: "Yes — lifetime install workmanship guarantee." },
    ],
    contactBlurb: "Riverwoods estimates are scheduled around your design team.",
  },
  {
    slug: "northfield-il",
    name: "Northfield",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/frameless-marble-bench.jpg",
    heroImageAlt: "Frameless shower door installed by Makibaki in a Northfield, IL primary bath",
    ogImage: "images/frameless-marble-bench.jpg",
    metaDescription: "Custom shower doors, walk-in enclosures and frameless glass installed across Northfield, IL — Happ Road, Wagner Farm area, Westmoreland. 224-427-9199.",
    intro: "Northfield is a small, well-maintained village with established residential neighborhoods and a steady stream of meaningful bath remodels. The work we do here is consistent — frameless walk-ins, careful measurement, classic hardware finishes.",
    whyTitle: "Northfield is steady, careful work",
    whyParagraphs: [
      "Most Northfield primary baths we walk into are part of a thoughtful remodel — new tile, updated plumbing, considered hardware. Our job is to install glass that complements all of it. The configurations are usually frameless hinged doors with one fixed inline panel, sometimes a 90-degree return.",
      "Northfield homeowners tend to do their homework. By the time we arrive to measure, they know what they want and they want it executed well. We respect that and install accordingly.",
    ],
    neighborhoods: [
      { name: "Happ Road corridor", body: "Established residential. Frameless walk-ins and hinged doors." },
      { name: "Wagner Farm area", body: "Mid-century homes. Frameless 90-degree returns." },
      { name: "Westmoreland", body: "Larger lots, custom homes. Multi-panel frameless installs." },
      { name: "Near Sunset Ridge", body: "Premium custom housing. Low-iron ½″ glass throughout." },
    ],
    projects: [
      { title: "Frameless walk-in, Happ Road remodel", body: "An established home off Happ Road had its master tub pulled and the alcove rebuilt as a 60×42 walk-in shower. ⅜″ frameless hinged door with 36″ inline panel, brushed-nickel hardware." },
      { title: "Frameless 90-degree return, Wagner Farm area", body: "A 1960s ranch had a corner shower the builder had framed in bronze. ⅜″ frameless 90-degree return with matte-black hardware." },
      { title: "Multi-panel enclosure, Westmoreland custom", body: "A custom home had a 6×5 shower zone. Three-panel ½″ low-iron frameless layout: hinged door, fixed inline, fixed return. Hardware in polished chrome." },
    ],
    trendsTitle: "What Northfield asks for",
    trendsParagraphs: [
      "Northfield clients gravitate to <strong>classic frameless geometry</strong> with <strong>understated hardware</strong> — brushed nickel, polished chrome, the occasional matte black. The look is meant to last 20+ years and it does.",
      "Our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the choice between frameless and semi-frameless.",
    ],
    faqs: [
      { q: "Do you work with established Northfield contractors?", a: "Yes — many of our Northfield projects come through repeat-trusted GCs." },
      { q: "Can you do mirror work too?", a: "Yes — custom vanity mirrors are commonly added to the same install." },
      { q: "How long is fabrication?", a: "2-3 weeks for standard frameless, 4 weeks for multi-panel premium." },
      { q: "What's the warranty?", a: "Lifetime install workmanship guarantee; hardware carries manufacturer warranty." },
    ],
    contactBlurb: "Northfield estimates booked within the week.",
  },
  {
    slug: "winnetka-il",
    name: "Winnetka",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/frameless-marble-black.jpg",
    heroImageAlt: "Luxury frameless shower door installed by Makibaki in a Winnetka, IL primary bath",
    ogImage: "images/frameless-marble-black.jpg",
    metaDescription: "Luxury frameless shower doors and custom glass installed across Winnetka, IL — East Winnetka, Hubbard Woods, Indian Hill. 224-427-9199.",
    intro: "Winnetka is one of those towns where the housing stock is almost uniformly distinguished — historic homes, careful remodels, and design briefs that take design seriously. The glass we install here is part of a long lineage of considered choices.",
    whyTitle: "Winnetka rewards quiet, considered installs",
    whyParagraphs: [
      "Winnetka homeowners don't generally chase trends. The glass we install here is meant to read as inevitable rather than designed — simple frameless geometry, classic hardware, low-iron glass that disappears into the space. The work is about restraint as much as execution.",
      "Most of our Winnetka projects come through architects or designers working on larger renovations. We engage at the measurement stage, coordinate with the other trades, and install on schedule. The standards are high; the work is satisfying.",
    ],
    neighborhoods: [
      { name: "East Winnetka", body: "Historic homes near the lake. Frameless walk-ins and pivot doors in carefully preserved baths." },
      { name: "Hubbard Woods", body: "Established residential with character homes. Multi-panel frameless installs." },
      { name: "Indian Hill", body: "Larger estates. Steam enclosures, oversized walk-ins, custom transoms." },
      { name: "West Winnetka", body: "Mix of historic and updated. Frameless hinged doors with returns." },
      { name: "Near Skokie Country Club", body: "Premium custom housing. ½″ low-iron throughout." },
    ],
    projects: [
      { title: "Frameless walk-in, East Winnetka historic remodel", body: "A 1912 home near Sheridan Road had its primary bath rebuilt with a 60×42 walk-in shower preserving the original tile elsewhere. ⅜″ frameless hinged door with 36″ inline panel, polished-nickel hardware to match the original fixtures." },
      { title: "Steam enclosure, Indian Hill estate", body: "A custom home had a dedicated steam shower with 10-foot ceilings. Full ½″ low-iron frameless steam-rated enclosure with sealed transom and continuous gasketing." },
      { title: "Multi-panel enclosure, Hubbard Woods", body: "A 1928 home had its primary bath rebuilt with a 7×5 shower zone. Three-panel ½″ low-iron frameless layout with satin-brass hardware to match the bathroom's broader restoration." },
    ],
    trendsTitle: "Winnetka's enduring choices",
    trendsParagraphs: [
      "Winnetka installs prioritize <strong>quiet quality</strong> — ½-inch low-iron glass, classic hardware in polished nickel, polished chrome, or satin brass, and simple frameless geometry that defers to the rest of the bathroom. <strong>Steam enclosures</strong> are common in primary suites; <strong>custom transoms</strong> show up on tall-ceilinged installs.",
      "Our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the choice between frameless and semi-frameless for less premium projects.",
    ],
    faqs: [
      { q: "Do you work with Winnetka architects?", a: "Yes — many of our Winnetka projects are architect-led." },
      { q: "Can you preserve original tile during install?", a: "Yes — we measure carefully and use wider clamp footprints to avoid stress on older tile." },
      { q: "How long is the lead time?", a: "4-5 weeks for premium multi-panel installs with custom hardware." },
      { q: "Do you do mirror work?", a: "Yes — custom vanity mirrors are commonly part of the same project." },
    ],
    contactBlurb: "Winnetka estimates are scheduled around your design team.",
  },
  {
    slug: "glencoe-il",
    name: "Glencoe",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/custom-smoked-glass.jpg",
    heroImageAlt: "Custom smoked-glass shower enclosure installed by Makibaki in a Glencoe, IL bathroom",
    ogImage: "images/custom-smoked-glass.jpg",
    metaDescription: "Luxury custom shower doors and frameless glass installed across Glencoe, IL — Skokie Ridge, North Glencoe, near the Botanic Garden. 224-427-9199.",
    intro: "Glencoe is a small, distinguished village with a high proportion of architecturally significant homes. The glass we install here is part of considered remodels, often coordinated with architects and designers working on substantial renovations.",
    whyTitle: "Glencoe is small but consistently ambitious",
    whyParagraphs: [
      "Most Glencoe projects we work on are part of larger renovations — primary suites being expanded, additions being built, historic homes being thoughtfully updated. The glass is one piece of a larger puzzle, and our job is to fit it perfectly.",
      "Glencoe homeowners tend to invest in their homes for the long term. The glass choices reflect that — ½-inch low-iron, custom-finished hardware, multi-panel geometry where the layout calls for it.",
    ],
    neighborhoods: [
      { name: "Skokie Ridge", body: "Established residential with custom homes. Multi-panel frameless installs." },
      { name: "North Glencoe / near the Botanic Garden", body: "Larger estates. Steam enclosures and oversized walk-ins." },
      { name: "South Glencoe", body: "Mix of historic and updated. Frameless walk-ins and pivot doors." },
      { name: "Near the Metra", body: "Older character homes. Inline panels and careful preservation work." },
    ],
    projects: [
      { title: "Specialty smoked-glass enclosure, North Glencoe custom", body: "A custom home had a primary bath with a designer-specified bronze-tinted glass for the shower enclosure. ⅜″ custom-tinted frameless hinged door with 36″ inline panel, hardware in oil-rubbed bronze." },
      { title: "Steam enclosure, Skokie Ridge estate", body: "A custom home had a dedicated steam shower with built-in bench. Full ½″ low-iron frameless steam-rated enclosure with sealed transom and continuous gasketing." },
      { title: "Frameless walk-in, South Glencoe historic remodel", body: "A 1920s home had its primary bath rebuilt with a 60×36 walk-in shower preserving the original window placement. ⅜″ frameless hinged door with 24″ inline panel, polished-nickel hardware." },
    ],
    trendsTitle: "Glencoe's design-led installs",
    trendsParagraphs: [
      "<strong>Specialty tinted glass</strong> (bronze, gray, smoked) shows up more often in Glencoe than anywhere else in our service area. <strong>½-inch low-iron</strong> remains the default for clear-glass installs. <strong>Custom-finished hardware</strong> in oil-rubbed bronze, satin brass, and polished nickel.",
      "Our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the choice between frameless and semi-frameless for less premium projects.",
    ],
    faqs: [
      { q: "Do you do tinted or specialty glass?", a: "Yes — bronze, gray, smoked, fluted, and laminated specialty glass are all available." },
      { q: "Can you work with our architect?", a: "Yes — most of our Glencoe projects are architect-coordinated." },
      { q: "How long is the lead time?", a: "Specialty tinted glass: 4-5 weeks. Standard premium frameless: 3-4 weeks." },
      { q: "Do you guarantee the install?", a: "Yes — lifetime install workmanship guarantee." },
    ],
    contactBlurb: "Glencoe estimates booked around your design team's schedule.",
  },
  {
    slug: "wilmette-il",
    name: "Wilmette",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/frameless-herringbone-black.jpg",
    heroImageAlt: "Frameless shower door installed by Makibaki in a Wilmette, IL primary bath",
    ogImage: "images/frameless-herringbone-black.jpg",
    metaDescription: "Custom shower doors, walk-in enclosures and luxury frameless glass installed across Wilmette, IL — Kenilworth Gardens, Indian Hill, CAGE. 224-427-9199.",
    intro: "Wilmette is a varied, walkable village with housing that spans from 1900s historic homes near the lake to 1950s ranches inland to newer construction near the western edge. We install glass into all of it.",
    whyTitle: "Wilmette gives us range",
    whyParagraphs: [
      "Wilmette housing variety keeps our work interesting. East of Ridge Road, the homes are older, often historic, with character baths that need careful frameless installs. West of Ridge, the homes are newer, the primary baths are bigger, and the glass we install is usually multi-panel.",
      "What's consistent across Wilmette is that homeowners here invest in quality. The remodels are thoughtful, the materials are good, and the glass we install is meant to last as long as the rest of the bathroom.",
    ],
    neighborhoods: [
      { name: "East Wilmette / near the lake", body: "Historic homes. Frameless walk-ins and pivot doors in carefully preserved baths." },
      { name: "Kenilworth Gardens", body: "Established residential. Multi-panel frameless installs." },
      { name: "Indian Hill border", body: "Larger custom homes. Steam enclosures and oversized walk-ins." },
      { name: "West Wilmette / CAGE area", body: "Mix of mid-century and newer. Frameless walk-ins with returns." },
      { name: "Near the Bahai Temple", body: "Older character homes. Pivot doors and inline panels." },
    ],
    projects: [
      { title: "Frameless walk-in, East Wilmette historic", body: "A 1918 home near Sheridan Road had its primary bath rebuilt with a 60×42 walk-in shower. ⅜″ frameless hinged door with 36″ inline panel, polished-nickel hardware." },
      { title: "Multi-panel enclosure, Kenilworth Gardens", body: "An established home off Wilmette Avenue had a 6×4 shower zone. Three-panel ½″ low-iron frameless layout with brushed-nickel hardware." },
      { title: "Pivot door, near Bahai Temple", body: "A 1930s home had a tight second-floor bath the owners had recently retiled. Single ⅜″ pivot panel with brushed-nickel hardware." },
    ],
    trendsTitle: "What Wilmette is installing",
    trendsParagraphs: [
      "<strong>Frameless walk-ins</strong> with classic hardware are the volume install. <strong>Multi-panel ½-inch low-iron</strong> is the upgrade for larger primary baths. <strong>Polished nickel and brushed nickel</strong> remain the dominant finishes; <strong>satin brass</strong> is emerging.",
      "Our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the choice between frameless and semi-frameless.",
    ],
    faqs: [
      { q: "Do you work in historic East Wilmette?", a: "Yes — many of our Wilmette projects are in homes built before 1940." },
      { q: "Can you preserve original tile?", a: "Yes — we measure carefully and use wider clamp footprints on older tile." },
      { q: "How long is fabrication?", a: "2-3 weeks standard, 4 weeks for multi-panel premium." },
      { q: "Do you do mirror work?", a: "Yes — custom vanity mirrors are commonly added to the same install." },
    ],
    contactBlurb: "Wilmette estimates booked within the week.",
  },
  {
    slug: "evanston-il",
    name: "Evanston",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/sliding-black-floral.jpg",
    heroImageAlt: "Frameless sliding shower door installed by Makibaki in an Evanston, IL bathroom",
    ogImage: "images/sliding-black-floral.jpg",
    metaDescription: "Custom shower doors, sliding enclosures and frameless glass installed across Evanston, IL — Northwestern area, Lakeshore, West Evanston. 224-427-9199.",
    intro: "Evanston is one of the most architecturally diverse markets we work in. From 1890s Victorians near the lake to 1960s ranches further west to brand-new condos near the L, the housing variety here keeps our work interesting and our skill set sharp.",
    whyTitle: "Evanston is variety",
    whyParagraphs: [
      "In a single week we might install a pivot door in a Victorian on Forest Avenue, a bypass slider in a condo near Davis Street, and a frameless walk-in in a mid-century ranch in West Evanston. The geometry, the wall construction, and the design vocabulary change completely between projects.",
      "What's consistent in Evanston is that homeowners tend to be design-aware and detail-oriented. The remodels we glass are usually thoughtful, the conversations are substantive, and the glass choices reflect real consideration.",
    ],
    neighborhoods: [
      { name: "East Evanston / near the lake", body: "Historic homes — Victorians, Prairie School, Tudors. Pivot doors and inline panels in character baths." },
      { name: "Northwestern area", body: "Mix of older homes and newer condos. Frameless walk-ins and bypass sliders." },
      { name: "West Evanston", body: "Mid-century housing. Tub-to-shower conversions and frameless 90-degree returns." },
      { name: "Downtown Evanston condos", body: "Bypass sliders over alcove tubs, frameless hinged doors on standalone showers." },
      { name: "South Evanston", body: "Mix of older single-family and townhomes. Range of project types." },
    ],
    projects: [
      { title: "Pivot door, East Evanston Victorian", body: "An 1893 home near Forest Avenue had its only full bath rebuilt with subway and hex tile. Single ⅜″ pivot panel anchored to wall with two heavy hinges, aged-brass hardware." },
      { title: "Frameless walk-in, West Evanston ranch", body: "A 1962 ranch off Crawford had its master tub pulled and the alcove rebuilt as a 60″ curbed walk-in. ⅜″ frameless inline panel with matte-black hardware." },
      { title: "Bypass slider, downtown Evanston condo", body: "A 2015 condo near Davis Street had a tired aluminum slider. Replaced with frameless ⅜″ bypass in polished chrome, one-visit install." },
    ],
    trendsTitle: "What Evanston is installing",
    trendsParagraphs: [
      "Variety. <strong>Aged-brass hardware</strong> on historic remodels; <strong>matte black</strong> on transitional and mid-century; <strong>polished chrome</strong> on contemporary condos. Frameless walk-ins, bypass sliders, pivot doors — all show up regularly.",
      "Our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the trade-offs between frameless and semi-frameless.",
    ],
    faqs: [
      { q: "Do you work in Evanston condos?", a: "Yes — both newer and older condos. We coordinate building access through your association." },
      { q: "Can you do period-appropriate hardware?", a: "Yes — aged brass, unlacquered brass, polished nickel, oil-rubbed bronze, all available." },
      { q: "How long is fabrication?", a: "2-3 weeks standard, 3-4 weeks for specialty hardware." },
      { q: "Do you do mirrors as well?", a: "Yes — custom vanity mirrors commonly part of the same install." },
    ],
    contactBlurb: "Evanston estimates booked within the week.",
  },
  {
    slug: "skokie-il",
    name: "Skokie",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/sliding-corner-marble.jpg",
    heroImageAlt: "Sliding shower door installed by Makibaki in a Skokie, IL bathroom",
    ogImage: "images/sliding-corner-marble.jpg",
    metaDescription: "Custom shower doors, sliding enclosures and frameless glass installed across Skokie, IL — Devonshire, Lincolnwood border, East Prairie. 224-427-9199.",
    intro: "Skokie has a deep stock of post-war ranches and split-levels, and the bathrooms we install glass into here are usually part of a meaningful remodel finally retiring the original fixtures. The work is steady, predictable, and reliably satisfying.",
    whyTitle: "Skokie is post-war ranch country",
    whyParagraphs: [
      "Most Skokie housing went up between 1948 and 1965 — modest ranches and split-levels with tight 5×7 master baths and the standard 60-inch alcove tub. Sixty-plus years on, those baths are being gutted and rebuilt across the village. The most common upgrade is a tub-to-shower conversion with a single frameless inline panel.",
      "Skokie homeowners ask great questions about value. They want to know what lasts, what looks good without being ostentatious, and what makes financial sense for a home they may or may not stay in for another 20 years. We give honest answers on all of it.",
    ],
    neighborhoods: [
      { name: "East Prairie", body: "Original post-war ranches. Tub-to-shower conversions and frameless inline panels." },
      { name: "Devonshire", body: "Split-levels and four-bedroom colonials. Frameless walk-ins and 90-degree returns." },
      { name: "Lincolnwood border", body: "Mix of mid-century and updated. Frameless hinged doors." },
      { name: "Near Old Orchard", body: "Newer condos and townhomes. Bypass sliders over alcove tubs." },
      { name: "West Skokie", body: "1960s ranches. Frameless walk-ins after gut remodels." },
    ],
    projects: [
      { title: "Tub-to-shower conversion, East Prairie ranch", body: "A 1954 ranch off Crawford had its master tub pulled and the alcove rebuilt as a 60″ curbed walk-in. ⅜″ frameless inline panel with brushed-nickel hardware, header reinforced into original wood blocking." },
      { title: "Frameless 90-degree return, Devonshire split-level", body: "A 1965 split-level had a corner shower the builder had framed in bronze. ⅜″ frameless 90-degree return with matte-black hardware." },
      { title: "Bypass slider, Old Orchard area condo", body: "A 2008 condo had a tired framed slider. Replaced with frameless ⅜″ bypass in polished chrome, single visit." },
    ],
    trendsTitle: "What Skokie is buying",
    trendsParagraphs: [
      "<strong>Tub-to-shower conversions</strong> dominate — the original 1950s alcove tub never gets used and the walk-in shower is the highest-ROI bath change available. <strong>Brushed nickel and polished chrome</strong> remain the everyday hardware finishes; <strong>matte black</strong> is the current trend choice.",
      "If you're weighing the upgrade to fully frameless, our <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covers the trade-offs.",
    ],
    faqs: [
      { q: "What does a tub-to-shower conversion cost?", a: "We don't do the tile or plumbing — those are handled by your contractor. Our glass piece is typically $1,500-$2,800 for a single inline panel installed." },
      { q: "Can you install over original tile we're keeping?", a: "Yes — measured to the finished surface, anchored with masonry-rated bits." },
      { q: "How fast can you start?", a: "Estimates typically within the week. Fabrication 2-3 weeks from measure." },
      { q: "Do you guarantee the install?", a: "Yes — lifetime install workmanship guarantee." },
    ],
    contactBlurb: "Skokie estimates booked within the week of your call.",
  },
];

// ============================================================
// Write files
// ============================================================
function routeFile(slug: string) {
  return `import { createFileRoute } from "@tanstack/react-router";
import html from "./_static/shower-doors-${slug}.html?raw";

export const Route = createFileRoute("/shower-doors-${slug}.html")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
`;
}

function write(path: string, content: string) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  console.log("wrote", path);
}

for (const c of CITIES) {
  write(`src/routes/_static/shower-doors-${c.slug}.html`, render(c));
  write(`src/routes/shower-doors-${c.slug}[.]html.ts`, routeFile(c.slug));
}

console.log(`\nGenerated ${CITIES.length} city pages.`);
