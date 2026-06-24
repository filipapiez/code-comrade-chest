## Plan: One buyer's guide per service

Right now every service page links to the same `frameless-vs-semi-frameless-shower-doors.html` article. I'll write a dedicated guide for each service and update that service's "Buyer's Guide" section to point to its own article.

### New guide articles (one per service)

Each will follow the same template/styling as the existing frameless-vs-semi-frameless guide (hero, comparison/sections, cost callout, CTA, related links, nav + footer).

| Service page | New guide file | Working title |
|---|---|---|
| shower-doors.html | `shower-door-buyers-guide.html` | Shower Doors Buyer's Guide: Styles, Glass & Cost |
| tub-doors.html | `tub-door-buyers-guide.html` | Tub Door Buyer's Guide: Sliding vs Pivot, Frame Options |
| shower-enclosures.html | `shower-enclosure-buyers-guide.html` | Shower Enclosure Buyer's Guide: Walk-in, Corner & Neo-Angle |
| custom-shower-glass.html | `custom-shower-glass-guide.html` | Custom Shower Glass: Design Options & What Drives Cost |
| bathroom-remodel-glass.html | `bathroom-remodel-glass-guide.html` | Bathroom Remodel Glass: Planning, Timing & Budget |
| replacement-glass.html | `replacement-glass-guide.html` | Replacement Glass Guide: When to Repair vs Replace |
| mirrors.html | `mirrors-buyers-guide.html` | Mirrors & Mirror Walls: Sizing, Edging & Installation |
| glass-railings.html | `glass-railings-buyers-guide.html` | Glass Railings: Framed, Semi-Frameless & Frameless Systems |
| wine-cigar-rooms.html | `wine-cigar-room-glass-guide.html` | Wine & Cigar Room Glass: Sealing, Thickness & Climate |
| office-partitions.html | `office-partitions-guide.html` | Office Glass Partitions: Layouts, Privacy & Acoustics |
| other-custom-glass.html | `other-custom-glass-guide.html` | Custom Glass Projects: What's Possible & How We Quote |

The existing `frameless-vs-semi-frameless-shower-doors.html` stays as a secondary related link on shower-door pages.

### Per-page updates

For each service page:
1. Update the "Buyer's Guide" CTA block — new headline, blurb, and link to its own guide.
2. Keep the frameless-vs-semi link in the "Related" section where it makes sense (shower-doors only).

### Technical bits

- Each new HTML file goes in `src/routes/_static/`.
- Each needs a matching route file in `src/routes/<name>[.]html.ts` (copy the existing pattern from `frameless-vs-semi-frameless-shower-doors[.]html.ts`).
- Reuse `assets/styles.css` — no new CSS needed.
- Include proper SEO: unique title, description, canonical, OG/Twitter, Article + BreadcrumbList JSON-LD.
- Add new guide URLs to `public/sitemap.xml`.

### Scope note

That's 11 new articles + 11 route files + 11 service-page edits + sitemap. It's a lot of content writing. I can either:
- **(a)** Do all 11 in one go (long turn, lots of generated copy), or
- **(b)** Start with the top 3–4 most important (shower doors, tub doors, shower enclosures, mirrors) and add the rest later.

Reply with **a** or **b** (or list which services to prioritize) and I'll build it.
