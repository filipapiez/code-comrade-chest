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
    slug: "schaumburg-il",
    name: "Schaumburg",
    state: "Illinois",
    stateAbbr: "IL",
    heroImage: "images/frameless-marble-bench.jpg",
    heroImageAlt: "Frameless glass shower door installed by Makibaki in a Schaumburg, IL bathroom",
    ogImage: "images/frameless-marble-bench.jpg",
    metaDescription: "Custom shower doors, enclosures and glass installed across Schaumburg, IL — from Town Square to Weathersfield. Free in-home estimates, 224-427-9199.",
    intro: "Makibaki is based right here in Schaumburg, and the bathrooms in this town are where we cut our teeth. From the 1970s split-levels off Roselle Road to the newer townhomes around Woodfield, we've measured, fabricated and installed thousands of square feet of shower glass within a five-mile radius of our shop.",
    whyTitle: "Why Schaumburg homeowners call us first",
    whyParagraphs: [
      "Schaumburg's housing stock is unusually varied for a single suburb. Walk one block in Weathersfield and you'll find original 1965 ranches with the builder-grade tub still in place. Drive ten minutes north toward Town Square and you're suddenly in 2010-era townhomes with double vanities and walk-in showers framed out for glass. Our day-to-day moves between both — and the truth is, the install process is completely different for each.",
      "Older Schaumburg baths usually need a careful out-of-plumb measurement (those walls have settled for fifty years), and the framing often needs a hidden header reinforced before we hang a frameless door. Newer construction is squarer, but the trade-off is that builders often left the curb a half-inch too low, which we have to account for in the door sweep. After a few hundred installs around town, we know which subdivisions tend to surprise us — and we price the job honestly the first time so you don't get a 'change order' mid-install.",
    ],
    neighborhoods: [
      { name: "Weathersfield", body: "Original Campanelli homes hitting their second or third bath remodel. Tear-out is usually straightforward, but watch for cast-iron tubs that need an extra hand to remove." },
      { name: "Lakewood", body: "Slightly newer (late '70s and '80s) split-levels with master baths that were never quite big enough. Frameless inline panels make the tight footprint feel larger." },
      { name: "Town Square & Olde Schaumburg", body: "Mix of older homes and newer infill. Lots of luxury frameless installs in this pocket, often paired with brushed gold or matte black hardware." },
      { name: "Near Woodfield", body: "Newer townhomes with prepped wall blocking — the easiest installs in town. Sliding doors over alcove showers are the most common request." },
      { name: "Poplar Creek & Hoffman border", body: "Custom homes from the late '90s and early 2000s with oversized master baths. This is where most of our true walk-in enclosures and steam shower jobs come from." },
    ],
    projects: [
      { title: "Frameless walk-in, Weathersfield ranch remodel", body: "A homeowner on Springinsguth Road had torn out the original 1968 fiberglass surround and rebuilt the alcove as a 60″ curbless walk-in. We installed a ½″ low-iron glass panel with a 24″ fixed return and a single matte-black wall clamp — no header, no door. Low-iron was the right call; standard tempered would have read green against the cool porcelain tile." },
      { title: "Sliding enclosure over alcove tub, Lakewood townhome", body: "A guest bath near Schaumburg Road had a standard 60″ alcove tub the owners weren't ready to rip out. They wanted to retire the fabric curtain without a full remodel. Frameless ⅜″ bypass slider, brushed-nickel hardware. On-site install: under three hours." },
      { title: "Custom steam shower enclosure, Poplar Creek custom home", body: "A 2002 custom home off Bode Road had a generously sized master bath the original builder had under-finished. We engineered a ½″ frameless layout with a 90-degree return, hinged door and a fixed transom — all sealed for steam. Hardware in polished chrome to match the existing plumbing fixtures." },
    ],
    trendsTitle: "What's trending in Schaumburg bathrooms right now",
    trendsParagraphs: [
      "Three things have shifted in the last 18 months. <strong>Matte black hardware</strong> has finally peaked — we're still installing plenty of it, but more clients are asking about brushed gold and aged brass as the next thing. <strong>Low-iron glass</strong> (ultra-clear, no green tint) has gone from a luxury upgrade to a standard request on any high-end remodel. And <strong>curbless walk-ins</strong> are showing up in homes whose owners aren't even thinking about aging-in-place yet — they just like how the bathroom feels when the floor flows under the glass.",
      "If you're not sure which way to go on the frameless-vs-semi-frameless question, we wrote a full <a href=\"frameless-vs-semi-frameless-shower-doors.html\">comparison guide</a> covering cost, glass thickness, cleaning and durability.",
    ],
    faqs: [
      { q: "Do you handle permit work in Schaumburg?", a: "Standard shower glass replacement and door installs don't typically require a permit in the Village of Schaumburg. If your project is part of a larger remodel that involves moving plumbing or framing, your GC pulls the permit and we coordinate inspection timing." },
      { q: "Can you match the brushed-gold fixtures my plumber already installed?", a: "Yes. We carry hardware in polished chrome, brushed nickel, matte black, brushed gold, polished gold, oil-rubbed bronze and brushed bronze. Bring us your fixture spec sheet at the estimate and we'll match the finish family." },
      { q: "How much does a frameless shower door cost in Schaumburg?", a: "For a typical Schaumburg master bath — single hinged frameless door with one fixed inline panel, ⅜″ tempered glass, mid-grade hardware — most projects land between $1,800 and $3,500 installed. Larger walk-ins, steam-rated assemblies and ½″ glass push the number higher. We quote your actual opening at the free estimate." },
      { q: "How long does an install take from first call to finished glass?", a: "Two to three weeks. About a week is fabrication; the on-site install is a single visit, usually 2-6 hours depending on the layout. We're local, so if anything needs adjusting after install we're usually back within a day or two." },
    ],
    contactBlurb: "We can usually be at your door within a few days. Most estimates take 20-30 minutes and include itemized pricing on the spot.",
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
