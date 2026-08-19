# Front-End Refactor Plan

Complete replacement of the dark industrial "dataplate" aesthetic with the clean/modern/white design
specified in `docs/DESIGN.md` and `docs/TASKS.md`.

---

## What's Being Replaced

The current build is an entirely different design system — a dark industrial aesthetic
(graphite/black, amber/red accents, Barlow Condensed + DM Mono, no routing, no layout shell).
The target is clean/modern/white with a green primary, Inter Variable, and a full two-route site.
Nothing in the current component tree survives intact.

---

## Step 1 — Dependencies

**Remove (3 font packages, no longer needed):**
```
@fontsource/barlow
@fontsource/barlow-condensed
@fontsource/dm-mono
```

**Add:**
```
@fontsource-variable/inter     # replaces the three above
react-router                   # not yet installed — needed for / and /products routes
```

shadcn/ui, lucide-react, radix-ui, tailwind-merge, clsx, class-variance-authority all stay.

---

## Step 2 — `src/index.css`

Full replacement of the `@theme` block. The existing dark tokens (graphite, plate, etch, legend,
chime, alarm, lamp) and the font vars (font-display, font-mono) go away entirely.

In goes the exact palette from DESIGN.md:
```css
@theme {
  --color-brand:       #0C7A52;
  --color-brand-hover: #0A6444;
  --color-brand-text:  #0A5238;
  --color-brand-tint:  #E8F5EF;
  --color-ink:         #111814;
  --color-body:        #5A625E;
  --color-line:        #E8EAE9;
  --color-surface:     #F7F9F8;
  --color-white:       #FFFFFF;
  --font-sans: "Inter Variable", sans-serif;
}
```

The `@theme inline` semantic slots for shadcn get remapped to the new tokens
(background → white, foreground → ink, primary → brand, ring → brand, etc.).

The `body` base style switches to white ground with `--color-ink` text.

The `.lamp-indicator` block is deleted entirely.

Motion CSS is added:
- `.reveal` initial state: `opacity: 0; transform: translateY(16px)`
- `.reveal.visible`: `opacity: 1; transform: none; transition: 500ms cubic-bezier(0.16, 1, 0.3, 1)`
- Stagger via `--stagger-index` CSS variable and `transition-delay`
- `@media (prefers-reduced-motion: reduce)` zeroes all transitions

---

## Step 3 — `src/main.tsx`

- Remove the three Barlow/DM Mono font imports
- Add `import '@fontsource-variable/inter'`
- Wrap the root render in `<BrowserRouter>`

---

## Step 4 — `src/data/category-meta.ts`

The `colorVar` field is gone (color-per-category was a dark-theme concept). Replaced with a
Lucide `icon` reference:

```ts
interface CategoryMeta {
  label: string;
  icon: LucideIcon;
}
```

Icon assignments: `Bell` → chime, `ShieldAlert` → alarm, `Lightbulb` → lighting.

---

## Step 5 — `src/App.tsx`

Replaces the current `<main>/<ProductGrid>` shell with the layout shell and route config:

```
BrowserRouter (in main.tsx)
  Routes
    Route path="/"  element={<Layout />}   ← App.tsx
      Route index  → <Home />
      Route "products" → <Products />
    Route path="*"  → <Navigate to="/" />
```

`<Layout>` renders: `<Header />`, `<Outlet />`, `<Contact />`, `<Footer />`.

---

## Step 6 — Shared Layout Components (all new)

**`src/components/layout/Section.tsx`**
Props: `eyebrow`, `heading`, `alt` (boolean — toggles `--color-surface` bg), `children`.
The repeating shell that every page section uses.

**`src/components/layout/Header.tsx`**
Wordmark, `/` and `/products` nav links, "Contact" button. Starts transparent; after 24px
scroll a white backdrop with blur and a bottom hairline fades in (200ms). Mobile collapses
to a shadcn `<Sheet>`.

**`src/components/layout/Contact.tsx`**
Heading, one line of copy, `mailto:` as the primary green button, phone and address beside it.
Shared — rendered at the bottom of both pages.

**`src/components/layout/Footer.tsx`**
Legal name, year, nothing else.

---

## Step 7 — Product Components (all new or full rewrites)

**Delete:** `Dataplate.tsx`, `ProductGrid.tsx`

**`src/components/product/IconTile.tsx`** *(new)*
Flat `--color-surface` tile, aspect-ratio 16/10, Lucide icon centered at 40% opacity.

**`src/components/product/ProductCard.tsx`** *(new)*
Teaser card for the Home page: `<IconTile>` + category eyebrow + name + part number + summary.
Hover: `translateY(-2px)`, border shifts toward green at 35% alpha, 180ms ease-out.

**`src/components/product/SpecTable.tsx`** *(rewrite)*
Labels in `--color-body` 0.8125rem/400, values in `--color-ink` 0.8125rem/500 tabular-nums.

**`src/components/product/ProductBlock.tsx`** *(new)*
Full expanded block for `/products`. `<IconTile>` beside content (stacks under 768px),
carries `id={product.code.toLowerCase()}` for anchor deep-links.

---

## Step 8 — Media Component

**`src/components/media/Photo.tsx`** *(new)*
Thin wrapper around `<img>` with required `alt`, explicit `width`/`height`, and a `priority`
prop that switches `loading` between `"eager"` and `"lazy"`. `object-cover rounded-[10px]`.

---

## Step 9 — Scroll Reveal Hook

**`src/hooks/use-reveal.ts`** *(new)*
IntersectionObserver, `threshold: 0.15`, unobserves after firing.
Returns a ref to attach to a container.
`prefers-reduced-motion` check short-circuits to final state.

---

## Step 10 — Pages

**`src/pages/Home.tsx`** *(new)*
- Two-column hero: copy left, `<Photo>` right (priority/eager)
- Three-card `<ProductCard>` grid with "View all products" link
- Capabilities section: full-bleed `<Photo>` band at `max-h-[380px]`
- Uses `<Section>` for alternating backgrounds

**`src/pages/Products.tsx`** *(new)*
- Page heading + banner `<Photo>` under the heading
- Five `<ProductBlock>` components stacked
- `scroll-margin-top` on each block to offset the sticky header

---

## Step 11 — `index.html`

Hand-write `<title>`, `<meta name="description">`, and Open Graph tags.
No third-party library.

---

## Execution Order

```
1  Install/remove deps (inter, react-router; uninstall barlow/dm-mono)
2  index.css — full token + motion replacement
3  main.tsx — font imports + BrowserRouter
4  category-meta.ts — colorVar → icon
5  App.tsx — layout shell + route config
6  Section.tsx, Header.tsx, Footer.tsx, Contact.tsx
7  IconTile.tsx → ProductCard.tsx → SpecTable.tsx rewrite → ProductBlock.tsx
8  Photo.tsx
9  use-reveal.ts
10 Home.tsx
11 Products.tsx
12 index.html metadata
13 npm run build + npm run lint clean-up pass
```

Steps 6–9 can be parallelized (no interdependencies). Steps 10–11 depend on 6–9 being complete.

---

## Files Summary

| Action | File |
|---|---|
| Delete | `src/components/product/Dataplate.tsx` |
| Delete | `src/components/product/ProductGrid.tsx` |
| Full rewrite | `src/index.css` |
| Full rewrite | `src/App.tsx` |
| Full rewrite | `src/main.tsx` |
| Full rewrite | `src/data/category-meta.ts` |
| Rewrite | `src/components/product/SpecTable.tsx` |
| New | `src/components/layout/Section.tsx` |
| New | `src/components/layout/Header.tsx` |
| New | `src/components/layout/Contact.tsx` |
| New | `src/components/layout/Footer.tsx` |
| New | `src/components/product/IconTile.tsx` |
| New | `src/components/product/ProductCard.tsx` |
| New | `src/components/product/ProductBlock.tsx` |
| New | `src/components/media/Photo.tsx` |
| New | `src/hooks/use-reveal.ts` |
| New | `src/pages/Home.tsx` |
| New | `src/pages/Products.tsx` |
| Edit | `index.html` |
