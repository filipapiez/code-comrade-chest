// Generates new service pages (Mirrors, Railings, Wine Rooms, Office, Other)
// from the shower-enclosures template, swapping copy + metadata per service.
import { readFileSync, writeFileSync } from "node:fs";

const tpl = readFileSync(
  "src/routes/_static/shower-enclosures.html",
  "utf8",
);

type Svc = {
  slug: string;
  title: string;
  h1Lead: string;
  h1Accent: string;
  eyebrow: string;
  crumb: string;
  lede: string;
  metaTitle: string;
  metaDesc: string;
  heroImg: string;
  heroAlt: string;
  serviceType: string;
  schemaName: string;
  schemaDesc: string;
  defaultCat: string;
  galleryTitle: string;
  featuresHead: string;
  features: { ico: string; t: string; d: string }[];
  faqs: { q: string; a: string }[];
  projectTypes: string[]; // appended to <select>
};

const ICN = {
  mirror: `<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7l2 4 4-2"/>`,
  rail: `<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/><line x1="6" y1="6" x2="6" y2="18"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="18" y1="6" x2="18" y2="18"/>`,
  wine: `<path d="M8 3h8l-1 7a4 4 0 0 1-6 0z"/><path d="M12 13v6M9 21h6"/>`,
  office: `<rect x="3" y="3" width="8" height="18" rx="1"/><rect x="13" y="3" width="8" height="18" rx="1"/>`,
  cube: `<path d="M12 2 4 7v10l8 5 8-5V7z"/><path d="M12 2v20M4 7l8 5 8-5"/>`,
  spark: `<path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4"/>`,
  check: `<path d="M20 6 9 17l-5-5"/>`,
  shield: `<path d="M12 3s8 3 8 9-8 9-8 9-8-3-8-9 8-9 8-9z"/>`,
  ruler: `<path d="M3 17 17 3l4 4L7 21z"/><path d="M9 7l2 2M13 5l2 2M5 13l2 2"/>`,
  lights: `<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="12" cy="12" r="2"/>`,
};

const services: Svc[] = [
  {
    slug: "mirrors",
    title: "Mirrors",
    h1Lead: "Custom",
    h1Accent: "Mirrors & Mirror Walls",
    eyebrow: "Mirrors",
    crumb: "Mirrors",
    lede: "Frameless vanity mirrors, full-wall mirror installations, framed bathroom mirrors and LED-backlit mirrors — cut, polished and hung to fit your space.",
    metaTitle: "Custom Mirrors & Mirror Walls in Deerfield, IL | Makibaki",
    metaDesc:
      "Custom mirrors — frameless vanity, full-wall, framed and LED-backlit — measured and installed in Deerfield, IL. Free estimates: 224-427-9199.",
    heroImg: "images/mirror-frameless-vanity.jpg",
    heroAlt:
      "Large frameless vanity mirror over double sinks in a Carrara marble bathroom, by Makibaki",
    serviceType: "Mirror Installation",
    schemaName: "Mirrors",
    schemaDesc:
      "Custom vanity, full-wall, framed and LED-backlit mirrors cut, polished and professionally installed.",
    defaultCat: "mirrors",
    galleryTitle: "Recent mirror projects",
    featuresHead: "Mirrors done right",
    features: [
      { ico: ICN.mirror, t: "Frameless vanity mirrors", d: "Polished-edge mirrors cut to your exact vanity width — single, paired or split around a tower cabinet." },
      { ico: ICN.lights, t: "LED-backlit mirrors", d: "Modern, hardwired backlit mirrors for bathrooms, dressing rooms and salons — warm or cool light, dimmable." },
      { ico: ICN.cube, t: "Full-wall mirror installations", d: "Floor-to-ceiling mirror walls for home gyms, dance studios and statement bathrooms." },
      { ico: ICN.shield, t: "Framed bathroom mirrors", d: "Matte-black, brushed-gold or wood-framed mirrors that pull a remodel together." },
      { ico: ICN.ruler, t: "Custom-measured to fit", d: "Every mirror templated on-site — no awkward gaps, no off-the-shelf compromises." },
      { ico: ICN.check, t: "Clean, anchored installs", d: "French-cleat or adhesive mounts depending on substrate — flush, level and safe." },
    ],
    faqs: [
      { q: "Do you cut mirrors to any size?", a: "Yes — single sheets up to roughly 96\" × 130\" are common, and we can seam larger walls invisibly. We template on-site for the best fit." },
      { q: "Can you install over existing tile?", a: "Usually yes. We use the right adhesive and mechanical anchors for the substrate and weight of the mirror." },
      { q: "How are large wall mirrors hung safely?", a: "Wall mirrors above a certain size use a continuous J-channel at the bottom and adhesive plus mechanical clips behind. For very large walls we seam panels with tight joints." },
      { q: "Do you do LED-backlit mirrors?", a: "Yes. We coordinate with your electrician for the rough-in, then template and install the mirror over the junction box." },
    ],
    projectTypes: ["Mirrors — Vanity", "Mirrors — Full Wall", "Mirrors — LED Backlit"],
  },
  {
    slug: "glass-railings",
    title: "Glass Railings",
    h1Lead: "Frameless",
    h1Accent: "Glass Railings & Stair Walls",
    eyebrow: "Glass Railings",
    crumb: "Glass Railings",
    lede: "Frameless glass stair railings, balcony railings, deck railings and floor-to-ceiling glass walls — code-compliant, professionally engineered, beautifully installed.",
    metaTitle: "Frameless Glass Railings in Deerfield, IL | Makibaki",
    metaDesc:
      "Frameless glass stair, balcony and deck railings in Deerfield, IL. Code-compliant, ½″ tempered glass, custom hardware. Free estimates: 224-427-9199.",
    heroImg: "images/railing-modern-staircase.jpg",
    heroAlt:
      "Frameless glass stair railing with matte black handrail in a modern home, installed by Makibaki near Deerfield, IL",
    serviceType: "Glass Railing Installation",
    schemaName: "Glass Railings",
    schemaDesc:
      "Frameless and post-mounted glass railings for stairs, balconies, lofts and decks — ½″ tempered glass, code-compliant.",
    defaultCat: "railings",
    galleryTitle: "Recent glass railing projects",
    featuresHead: "Glass railings done right",
    features: [
      { ico: ICN.rail, t: "Frameless stair railings", d: "Floor-mounted ½″ tempered glass panels with continuous channel — no posts, uninterrupted view." },
      { ico: ICN.shield, t: "Stainless or oak posts", d: "Post-and-glass systems when local code or budget calls for it — stainless, matte black or wood-capped." },
      { ico: ICN.cube, t: "Floor-to-ceiling stair walls", d: "Full-height glass walls beside floating stair treads for a true architectural statement." },
      { ico: ICN.spark, t: "Balcony &amp; loft rails", d: "Indoor balcony, mezzanine and loft railings with crisp top caps." },
      { ico: ICN.check, t: "Code-compliant", d: "Engineered for IBC/IRC residential load requirements — we handle the spec." },
      { ico: ICN.ruler, t: "Site-templated", d: "Every panel templated to your actual stair, with notches for handrails and skirts as needed." },
    ],
    faqs: [
      { q: "Are glass railings code-compliant?", a: "Yes — when designed correctly. We use ½″ tempered (often laminated) glass and base channels rated for the residential load code in your jurisdiction." },
      { q: "Can you put glass on existing stairs?", a: "In most cases yes. We assess the substrate, sister joists or add blocking if needed, then install the channel and panels." },
      { q: "Frameless or with posts?", a: "Frameless looks cleanest but needs a strong substrate for the channel. Post systems are forgiving on existing construction and still look modern." },
      { q: "How are smudges handled?", a: "An optional protective coating dramatically reduces fingerprints. A microfiber and glass cleaner keeps panels looking new." },
    ],
    projectTypes: ["Glass Railings — Stair", "Glass Railings — Balcony", "Glass Railings — Deck"],
  },
  {
    slug: "wine-cigar-rooms",
    title: "Wine & Cigar Rooms",
    h1Lead: "Glass",
    h1Accent: "Wine &amp; Cigar Rooms",
    eyebrow: "Wine & Cigar Rooms",
    crumb: "Wine & Cigar Rooms",
    lede: "Frameless and black-framed glass enclosures for residential wine cellars, cigar lounges and tasting rooms — sealed, climate-friendly and built to show off the room.",
    metaTitle: "Glass Wine Rooms & Cigar Lounge Enclosures | Makibaki Deerfield, IL",
    metaDesc:
      "Custom glass enclosures for wine cellars and cigar lounges in Deerfield, IL — frameless, black-framed, sealed for climate. Free estimates: 224-427-9199.",
    heroImg: "images/wine-room-frameless.jpg",
    heroAlt:
      "Frameless glass double doors and side panels for a wine room, fabricated and installed by Makibaki",
    serviceType: "Wine Room Glass Installation",
    schemaName: "Wine & Cigar Room Glass",
    schemaDesc:
      "Custom glass enclosures, doors and walls for residential wine cellars and cigar lounges — sealed and climate-friendly.",
    defaultCat: "wine-rooms",
    galleryTitle: "Recent wine & cigar room projects",
    featuresHead: "Wine & cigar rooms done right",
    features: [
      { ico: ICN.wine, t: "Frameless wine room walls", d: "Floor-to-ceiling glass with double or single doors — show off the bottles, hold the temperature." },
      { ico: ICN.office, t: "Black-framed designs", d: "Industrial-style steel-look black frames with frosted privacy bands for cellars and lounges." },
      { ico: ICN.shield, t: "Sealed for climate", d: "Bottom sweeps, side seals and tight gasket lines to help your cooling unit do its job." },
      { ico: ICN.cube, t: "Custom layouts", d: "L-shaped enclosures, transom panels and angled returns — designed around your room." },
      { ico: ICN.spark, t: "Hardware to match the room", d: "Pulls and pivots in oil-rubbed bronze, matte black, brushed nickel or brass." },
      { ico: ICN.check, t: "Clean installs", d: "We protect floors and finishes during install and leave the room spotless." },
    ],
    faqs: [
      { q: "Do glass walls work with a cellar cooling unit?", a: "Yes — with the right seals and door sweeps, sealed glass enclosures hold temperature well. We coordinate with your cellar contractor on sizing." },
      { q: "Can you build doors big enough for double-door entries?", a: "Yes. Single panels up to ~36\"× 96\" are standard; for taller or wider entries we use a transom panel above and side lites." },
      { q: "Frameless or black-framed — what's the difference?", a: "Frameless is the most modern, minimal look. Black-framed reads more architectural / industrial and adds visual structure to a larger wall of glass." },
      { q: "Will it work in a basement remodel?", a: "Most of our wine rooms are in basements. We work around bulkheads, low ceilings and existing finishes." },
    ],
    projectTypes: ["Wine Room Glass", "Cigar Lounge Glass"],
  },
  {
    slug: "office-partitions",
    title: "Office Partitions",
    h1Lead: "Interior",
    h1Accent: "Office &amp; Glass Partitions",
    eyebrow: "Office Partitions",
    crumb: "Office Partitions",
    lede: "Frosted and clear glass partitions, sliding glass doors and floor-to-ceiling office walls — for home offices, professional suites and commercial spaces.",
    metaTitle: "Glass Office Partitions & Sliding Doors | Makibaki Deerfield, IL",
    metaDesc:
      "Frosted and clear glass office partitions and sliding doors for home and commercial offices in Deerfield, IL. Free estimates: 224-427-9199.",
    heroImg: "images/office-frosted-partition.jpg",
    heroAlt:
      "Frosted glass office partition with sliding door and black hardware, installed by Makibaki near Deerfield, IL",
    serviceType: "Office Glass Partition Installation",
    schemaName: "Office Partitions",
    schemaDesc:
      "Glass office partitions, sliding glass doors and demountable glass walls for home and commercial offices.",
    defaultCat: "office",
    galleryTitle: "Recent office partition projects",
    featuresHead: "Office partitions done right",
    features: [
      { ico: ICN.office, t: "Frosted glass walls", d: "Privacy without losing light — full-frost, gradient frost or custom-banded panels." },
      { ico: ICN.cube, t: "Sliding glass doors", d: "Top-hung sliding doors on matte-black or brushed-nickel tracks for quiet, full-light openings." },
      { ico: ICN.rail, t: "Full-height partitions", d: "Floor-to-ceiling glass walls with crisp black framing for that loft-office look." },
      { ico: ICN.shield, t: "Demountable systems", d: "Partition systems that can be reconfigured later as the floor plan changes." },
      { ico: ICN.spark, t: "Clean acoustics", d: "We use the right gaskets and door sweeps to dampen sound between rooms." },
      { ico: ICN.check, t: "After-hours installs", d: "For commercial spaces we work evenings or weekends to avoid disrupting your team." },
    ],
    faqs: [
      { q: "Are these for commercial spaces too?", a: "Yes — we do both home offices and commercial buildouts (suites, conference rooms, exam rooms, salons)." },
      { q: "Will frosted glass actually be private?", a: "Full-frost gives full visual privacy; gradient and banded designs give partial privacy with more daylight. We'll show samples at estimate." },
      { q: "How loud is a glass office?", a: "Quieter than you'd expect with the right gasketing. We use brush seals on sliding doors and continuous gaskets on fixed panels." },
      { q: "Can the partitions be moved later?", a: "Yes — demountable systems are designed to be unbolted and reconfigured. Standard fixed partitions can be removed but not as cleanly." },
    ],
    projectTypes: ["Office Glass Partition", "Glass Sliding Door"],
  },
  {
    slug: "other-custom-glass",
    title: "Other Custom Glass",
    h1Lead: "Other",
    h1Accent: "Custom Glass Projects",
    eyebrow: "Other Custom Glass",
    crumb: "Other Custom Glass",
    lede: "Glass shelves, columns, rooftop railings, low-wall tub enclosures and the one-off projects that don't fit a category — measured, fabricated and installed.",
    metaTitle: "Other Custom Glass Projects in Deerfield, IL | Makibaki",
    metaDesc:
      "Custom glass shelves, columns, rooftop railings and one-off glass projects in Deerfield, IL. Free estimates: 224-427-9199.",
    heroImg: "images/other-rooftop-railing.jpg",
    heroAlt:
      "Frosted glass rooftop deck railing with black posts and pergola, installed by Makibaki near Deerfield, IL",
    serviceType: "Custom Glass Fabrication",
    schemaName: "Other Custom Glass",
    schemaDesc:
      "One-off custom glass projects — shelves, columns, rooftop railings and specialty fabrications.",
    defaultCat: "other",
    galleryTitle: "Recent custom glass projects",
    featuresHead: "Custom projects done right",
    features: [
      { ico: ICN.cube, t: "Glass display shelves", d: "Tempered glass shelves for memorabilia, books and retail — chrome, brass or hidden brackets." },
      { ico: ICN.shield, t: "Rooftop &amp; deck railings", d: "Frosted or clear glass railings designed for outdoor weather and wind load." },
      { ico: ICN.spark, t: "Glass-wrapped columns", d: "Floor-to-ceiling glass panels wrapping decorative columns or feature walls." },
      { ico: ICN.office, t: "Low-wall tub enclosures", d: "Custom frameless panels on knee walls or partial dividers — designed around the existing build." },
      { ico: ICN.ruler, t: "One-off fabrications", d: "If it's glass and it's custom, we'll measure, template and quote it." },
      { ico: ICN.check, t: "Engineered properly", d: "Right thickness, right edge work, right anchors — so it lasts." },
    ],
    faqs: [
      { q: "What kind of one-off glass projects do you take?", a: "Display shelves, glass columns, glass-wrapped features, low-wall partitions, rooftop railings, custom tabletops — if it can be measured, we'll quote it." },
      { q: "Do you do outdoor glass?", a: "Yes. Outdoor glass uses thicker tempered (often laminated) panels and stainless or powder-coated hardware rated for weather." },
      { q: "Can you match an existing piece?", a: "Usually. Bring us a measurement and a photo of the edge profile and finish and we'll match it." },
      { q: "Is there a minimum project size?", a: "We'll take small jobs (single shelf, single panel) when we're already in the area — just ask." },
    ],
    projectTypes: ["Other Custom Glass"],
  },
];

function patch(svc: Svc): string {
  let out = tpl;
  // <title>
  out = out.replace(
    /<title>[^<]*<\/title>/,
    `<title>${svc.metaTitle}</title>`,
  );
  // meta description
  out = out.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${svc.metaDesc}" />`,
  );
  // canonical
  out = out.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="https://www.makibakiglass.com/${svc.slug}.html" />`,
  );
  // og:title / twitter:title
  out = out.replaceAll(
    /<meta property="og:title" content="[^"]*"\s*\/>/g,
    `<meta property="og:title" content="${svc.metaTitle}" />`,
  );
  out = out.replaceAll(
    /<meta name="twitter:title" content="[^"]*"\s*\/>/g,
    `<meta name="twitter:title" content="${svc.metaTitle}" />`,
  );
  // og/twitter description
  out = out.replaceAll(
    /<meta property="og:description" content="[^"]*"\s*\/>/g,
    `<meta property="og:description" content="${svc.metaDesc}" />`,
  );
  out = out.replaceAll(
    /<meta name="twitter:description" content="[^"]*"\s*\/>/g,
    `<meta name="twitter:description" content="${svc.metaDesc}" />`,
  );
  // og:url
  out = out.replaceAll(
    /<meta property="og:url" content="[^"]*"\s*\/>/g,
    `<meta property="og:url" content="https://www.makibakiglass.com/${svc.slug}.html" />`,
  );
  // og:image / twitter:image
  const heroAbs = `https://www.makibakiglass.com/${svc.heroImg}`;
  out = out.replaceAll(
    /<meta property="og:image" content="[^"]*"\s*\/>/g,
    `<meta property="og:image" content="${heroAbs}" />`,
  );
  out = out.replaceAll(
    /<meta name="twitter:image" content="[^"]*"\s*\/>/g,
    `<meta name="twitter:image" content="${heroAbs}" />`,
  );
  // Breadcrumb schema (Shower Enclosures → svc.title)
  out = out.replace(
    /"name": "Shower Enclosures", "item": "https:\/\/www\.makibakiglass\.com\/shower-enclosures\.html"/,
    `"name": "${svc.title}", "item": "https://www.makibakiglass.com/${svc.slug}.html"`,
  );
  // Service schema name/type/description
  out = out.replace(
    /"serviceType": "Shower Enclosure Installation", "name": "Shower Enclosures", "description": "[^"]*"/,
    `"serviceType": "${svc.serviceType}", "name": "${svc.schemaName}", "description": "${svc.schemaDesc}"`,
  );
  // FAQ schema — replace whole FAQPage block
  const faqSchema = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: svc.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  })}</script>`;
  out = out.replace(
    /<script type="application\/ld\+json">\{"@context": "https:\/\/schema\.org", "@type": "FAQPage"[\s\S]*?<\/script>/,
    faqSchema,
  );
  // Breadcrumb visual + hero
  out = out.replace(
    /<span class="here">Shower Enclosures<\/span>/,
    `<span class="here">${svc.crumb}</span>`,
  );
  out = out.replace(
    /<span class="eyebrow" data-reveal>Shower Enclosures<\/span>/,
    `<span class="eyebrow" data-reveal>${svc.eyebrow}</span>`,
  );
  out = out.replace(
    /<h1 data-reveal data-delay="1">Custom <span class='accent'>Shower Enclosures<\/span><\/h1>/,
    `<h1 data-reveal data-delay="1">${svc.h1Lead} <span class='accent'>${svc.h1Accent}</span></h1>`,
  );
  out = out.replace(
    /<p class="lede" data-reveal data-delay="2">Full corner and multi-panel glass enclosures engineered to your exact walls, slope and tile\.<\/p>/,
    `<p class="lede" data-reveal data-delay="2">${svc.lede}</p>`,
  );
  // hero image
  out = out.replace(
    /<img class="g-img" src="images\/enclosure-travertine-walkin\.jpg"[^>]*>/,
    `<img class="g-img" src="${svc.heroImg}" alt="${svc.heroAlt}" fetchpriority="high" onerror="this.remove()">`,
  );
  // Features section: replace heading + grid
  const featsHtml = svc.features
    .map(
      (f, i) => `      <article class="svc" data-reveal data-delay="${(i % 3) + 1}">
        <div class="svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${f.ico}</svg></div>
        <h3>${f.t}</h3><p>${f.d}</p>
      </article>`,
    )
    .join("\n");
  out = out.replace(
    /<h2>Shower Enclosures done right<\/h2>[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/,
    `<h2>${svc.featuresHead}</h2>
      <p>Custom-measured, professionally installed, and built from quality materials &mdash; for remodels, new construction and replacements across the Deerfield area.</p>
    </div>
    <div class="services-grid">
${featsHtml}
    </div>
  </div>
</section>`,
  );
  // Gallery heading + add default-cat data attr so JS can auto-filter
  out = out.replace(
    /<h2>Recent shower enclosures projects<\/h2>/,
    `<h2>${svc.galleryTitle}</h2>`,
  );
  out = out.replace(
    /<div class="gallery-grid" id="galleryGrid"><\/div>/,
    `<div class="gallery-grid" id="galleryGrid" data-default-cat="${svc.defaultCat}"></div>`,
  );
  // FAQ title
  out = out.replace(
    /<h2>Shower Enclosures FAQs<\/h2>/,
    `<h2>${svc.title} FAQs</h2>`,
  );
  // window.MAKI_FAQS injection — append a script block right before main.js
  const faqsJs = `<script>window.MAKI_FAQS=${JSON.stringify(svc.faqs.map((f) => ({ q: f.q, a: f.a })))};</script>`;
  out = out.replace(
    /<script src="assets\/main\.js"><\/script>/,
    `${faqsJs}\n<script src="assets/main.js"></script>`,
  );
  // Project type options — append before "Not sure yet"
  const opts = svc.projectTypes.map((t) => `                <option>${t}</option>`).join("\n");
  out = out.replace(
    /<option>Replacement Glass<\/option>\n\s*<option>Not sure yet<\/option>/,
    `<option>Replacement Glass</option>\n${opts}\n                <option>Not sure yet</option>`,
  );

  return out;
}

for (const svc of services) {
  const html = patch(svc);
  const out = `src/routes/_static/${svc.slug}.html`;
  writeFileSync(out, html);
  console.log("wrote", out);
}
