# Design

Clean, modern, white. Green primary. Environmental photography. Restrained motion.

The audience is fleet maintenance staff, transit procurement, and OEM buyers. The page's
job is credibility — the owner already works directly with his clients. Nothing here
needs to sell; it needs to look like a real, competent manufacturer.

---

## Color

```css
@theme {
  --color-brand:       #0C7A52;  /* primary fill — buttons, category labels */
  --color-brand-hover: #0A6444;
  --color-brand-text:  #0A5238;  /* green text and links on white */
  --color-brand-tint:  #E8F5EF;  /* badges, quiet section backgrounds */

  --color-ink:         #111814;  /* headings */
  --color-body:        #5A625E;  /* body copy, secondary text */
  --color-line:        #E8EAE9;  /* hairline borders */
  --color-surface:     #F7F9F8;  /* alternating section background */
  --color-white:       #FFFFFF;  /* page ground */
}
```

**Note on the shade.** The mockup used `#0F8B5F`. It's nudged darker here to `#0C7A52`
so white button text clears AA at body size — `#0F8B5F` sits right at the 4.4:1 line and
fails on small labels. The difference is invisible side by side; the accessibility
difference is not.

Pairing rules, non-negotiable:

- White text only on `--color-brand` or darker. Never on `--color-brand-tint`.
- Green *text* on white uses `--color-brand-text`, never `--color-brand`.
- Text on `--color-brand-tint` uses `--color-brand-text`.
- Body copy is `--color-body` on white or `--color-surface`. Never on green.

Green appears in maybe six places on the whole page: the logo mark, the primary buttons,
the category labels, links, the badge, and card hover borders. Everything else is ink,
body, and hairlines. Restraint is what makes it read as clean rather than themed.

## Typography

**Inter Variable**, one family, whole site.

Clean and modern here means invisible typography that gets out of the way of the content
and the photos. A second display face would fight that. Self-host via Fontsource so the
CSP stays strict and there's no third-party request:

```bash
npm i @fontsource-variable/inter
```

Part numbers get `font-variant-numeric: tabular-nums` and `letter-spacing: 0.02em` rather
than a separate mono family — it keeps codes aligned in spec tables without a second font
download.

### Scale

| Role | Size | Weight | Notes |
|---|---|---|---|
| Hero heading | `clamp(2.25rem, 5vw, 3.5rem)` | 500 | `tracking-[-0.025em]`, `leading-[1.1]` |
| Page heading | `clamp(1.75rem, 3.5vw, 2.5rem)` | 500 | `tracking-[-0.02em]` |
| Section heading | `1.5rem` | 500 | `tracking-[-0.015em]` |
| Product name | `1.125rem` | 500 | |
| Part number | `0.875rem` | 500 | tabular-nums, `--color-brand-text` |
| Eyebrow / category | `0.6875rem` | 500 | uppercase, `tracking-[0.08em]`, `--color-brand` |
| Body | `1rem` | 400 | `leading-[1.7]`, max `65ch`, `--color-body` |
| Spec label | `0.8125rem` | 400 | `--color-body` |
| Spec value | `0.8125rem` | 500 | `--color-ink`, tabular-nums |

Weights are 400 and 500 only. Nothing bolder — 600 and 700 read heavy against this much
white space.

## Photography

**Environmental, not product.** Stock photography of a bus door chime does not exist.
Photography of the places these parts live does, and it does the credibility work better
than a generic switch photo would.

Four slots, that's all:

| Slot | Subject | Treatment |
|---|---|---|
| Home hero | Rail car or bus interior, empty, shot wide | Right half of a two-column hero |
| Home capabilities | Electronics assembly bench, wiring harness, hands at work | Full-bleed band, `max-h-[380px]` |
| Products page header | Circuit board or component close-up | Wide banner under the heading |
| Contact | Optional — transit exterior at a platform | Only if the section looks thin without it |

Sourcing: Unsplash and Pexels are free for commercial use with no attribution required.
Adobe Stock is worth ~$30 for one or two specific transit interiors if the free options
look too generic.

Rules: no visible competitor branding, no recognizable faces, no images that imply a
claim the company can't back. Keep a consistent treatment across all four — similar
exposure and a cool-neutral cast — so they read as one set rather than four stock picks.

Technical: WebP, max 1600px wide, target under 150KB each. Explicit `width` and `height`
attributes to prevent layout shift. `loading="lazy"` on everything below the fold, eager
on the hero. `object-cover` with `rounded-[10px]`.

Product cards use flat icon tiles on `--color-surface` — a Lucide icon at 40% opacity,
centered, aspect-ratio 16/10. Consistent across all five, so nothing reads as a missing
image.

## Layout

Two routes. Contact is a shared section at the bottom of both.

**`/` — Home**
```
Header (sticky)
Hero            two-column: copy left, photo right
Product teaser  three cards, "View all products" link to /products
Capabilities    full-bleed photo band + two-column prose
Contact         shared component
Footer
```

**`/products` — Products**
```
Header (sticky)
Page heading + banner photo
Five product blocks, stacked, all expanded:
  icon tile | name, part number, category, description, spec table
Contact         shared component
Footer
```

No per-product detail pages. Five products stacked on one page is faster to scan than
five clicks, and a client can be linked to `#cc-1042` directly if needed — anchor IDs on
each block cover the deep-link case without the routing.

Container `max-w-[72rem]`, `px-6` mobile / `px-8` desktop. Section padding
`py-20` desktop, `py-14` mobile. Sections alternate white and `--color-surface`; separate
with background change, not rules.

Grid: three columns desktop, two at tablet, one under 640px. Product blocks on
`/products` are always full width with the icon tile beside the content, stacking under
768px.

## Motion

Modern, not showy. Four behaviors total.

1. **Scroll reveal** — `opacity: 0 → 1`, `translateY(16px) → 0`, 500ms,
   `cubic-bezier(0.16, 1, 0.3, 1)`. Grid children stagger 80ms. One IntersectionObserver
   hook, `threshold: 0.15`, unobserve after firing.
2. **Card hover** — `translateY(-2px)`, border shifts from `--color-line` to
   `--color-brand` at 35% alpha, 180ms ease-out.
3. **Sticky header** — transparent at rest; after 24px of scroll, a white backdrop with
   blur and a bottom hairline fade in over 200ms.
4. **Button press** — `scale(0.98)` on active, 100ms.

No parallax, no counters ticking up, no gradient animation, no scroll-jacking, no
page-transition libraries. `@media (prefers-reduced-motion: reduce)` resolves all four to
final state instantly.

**No animation library.** A 20-line `use-reveal.ts` hook plus CSS transitions covers all
of it. Do not install Framer Motion, `motion`, GSAP, or AOS for this.

## Copy

Plain and specific. Say what the parts do and what vehicles they go in.

Avoid: "innovative", "cutting-edge", "solutions", "passionate", "industry-leading". Never
state a certification, compliance standard, founding year, or customer count that the
owner hasn't supplied — leave `TODO(sean)` visible instead. Fabricated compliance claims
on a manufacturer's site are a liability, not a placeholder.

## Quality floor

Responsive from 320px. Visible `focus-visible` rings in `--color-brand`, never
`outline: none`. Semantic landmarks and a skip link. All four photos have real alt text
describing the scene. AA contrast on every piece of meaningful text. Lighthouse
accessibility 100 before launch.
