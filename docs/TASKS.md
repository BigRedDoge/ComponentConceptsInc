# Tasks

Sequenced backlog. Phases are ordered by dependency — do not start a phase until the
prior one meets its acceptance criteria. Within a phase, tasks can be done in any order.

Read `CLAUDE.md` before starting anything.

---

## Phase 0 — Owner inputs (blocks everything downstream)

Only Sean can supply these. Agents must not invent them.

- [ ] Exact domain string, and whether apex or `www` is canonical
- [ ] The five SKUs: part number, name, category, one-line summary, longer description,
      spec key/value pairs
- [ ] Company facts: founding year, city/state, whether the street address goes public
- [ ] Contact email to publish, and whether it's a custom-domain address yet
- [ ] Phone number, if one should be listed
- [ ] Existing logo/wordmark files, or confirmation to set the wordmark in type
- [ ] Any certifications or compliance standards genuinely held
- [ ] GitHub repo location — personal account or a business org

Until these land, build against placeholder data that is obviously placeholder.

## Phase 1 — Project skeleton

- [ ] `npm create vite@latest` — React + TypeScript. Node 22, pinned in `.nvmrc`.
- [ ] Tailwind v4 via `@tailwindcss/vite`. Config is CSS-first — the `@theme` block in
      `src/index.css`, not a `tailwind.config.ts`.
- [ ] Drop the color tokens from `docs/DESIGN.md` into `@theme` verbatim.
- [ ] `npm i @fontsource-variable/inter`, import in `main.tsx`, wire `--font-sans`.
- [ ] `shadcn init`, then add only: `button`, `separator`, `sheet`.
- [ ] React Router: `/` and `/products`, plus a catch-all redirecting to `/`.
- [ ] ESLint + `tsc --noEmit` scripts; TypeScript `strict: true`.
- [ ] `src/lib/utils.ts` with `cn()`.

**Done when:** both routes render placeholder content, Inter loads from the local bundle,
and there are zero network requests to third-party domains.

## Phase 2 — Data layer

- [ ] `src/types/product.ts`:

```ts
export type Category = 'chime' | 'alarm' | 'lighting';

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  code: string;          // e.g. "CC-1042" — also the anchor id, lowercased
  name: string;
  category: Category;
  summary: string;       // one line, used on the teaser card
  description: string;   // 2-3 sentences, used on the products page
  specs: Spec[];
  datasheetUrl?: string;
  images?: string[];     // reserved — empty today, populated if photos ever exist
}
```

- [ ] `src/data/products.ts` — five entries typed as `Product[]`, placeholders marked
      `TODO(sean)` until Phase 0 lands.
- [ ] `src/data/company.ts` — name, email, phone, address, founded, tagline, and the
      four photo paths.
- [ ] A `CATEGORY_META` map from `Category` to `{ label, icon }` so components never
      branch on category strings inline.

**Done when:** every string on the site traces to one of these two files. No copy is
hardcoded in a component.

## Phase 3 — Shared layout

- [ ] `Section.tsx` — shell taking `eyebrow`, `heading`, `alt` (toggles the
      `--color-surface` background), children.
- [ ] `Header.tsx` — wordmark, links to `/` and `/products`, contact button. Transparent
      at rest, white backdrop with blur and a hairline after 24px of scroll. Mobile
      collapses to a `Sheet`.
- [ ] `Contact.tsx` — shared. Heading, one line of copy, `mailto:` as the primary green
      button, phone and address beside it. Renders at the bottom of both pages.
- [ ] `Footer.tsx` — legal name, year, nothing else.
- [ ] `Photo.tsx` — wraps `img` with required `alt`, explicit `width`/`height`, and a
      `priority` prop switching `loading` between eager and lazy.
- [ ] `App.tsx` — Header, `<Outlet />`, Contact, Footer.

**Done when:** both routes share one shell, the header transition is smooth, and the
contact section is identical on both pages.

## Phase 4 — Product components

- [ ] `IconTile.tsx` — flat `--color-surface` tile, aspect 16/10, centered Lucide icon at
      40% opacity. Identical treatment for all five so nothing reads as a missing image.
- [ ] `ProductCard.tsx` — teaser for the home page. Icon tile, category eyebrow, name,
      part number, one-line summary. Hover lifts 2px and shifts the border toward green.
- [ ] `SpecTable.tsx` — two-column definition list, labels in `--color-body`, values in
      `--color-ink` with tabular numerals.
- [ ] `ProductBlock.tsx` — full expanded block for `/products`. Icon tile beside content,
      stacking under 768px. Carries `id={code.toLowerCase()}` for deep links.

## Phase 5 — Pages

- [ ] `Home.tsx` — two-column hero (copy left, photo right), three-card teaser with a
      "View all products" link, capabilities section with a full-bleed photo band.
- [ ] `Products.tsx` — page heading, banner photo, five `ProductBlock`s stacked.
- [ ] Anchor scrolling: landing on `/products#cc-1042` scrolls to that block with the
      sticky header offset accounted for.

**Done when:** the full site scrolls cleanly at 320px, 768px, and 1440px; anchor links
land correctly; tab order is sane on both pages.

## Phase 6 — Photography

- [ ] Source four environmental photos per the slot table in `docs/DESIGN.md`. Unsplash
      or Pexels; Adobe Stock if the free options look generic.
- [ ] Convert to WebP, max 1600px wide, under 150KB each.
- [ ] Write real alt text describing each scene.
- [ ] Verify no competitor branding, no recognizable faces, consistent color cast.

## Phase 7 — Motion and polish

- [ ] `use-reveal.ts` — IntersectionObserver, `threshold: 0.15`, unobserve after firing.
- [ ] Section fade-and-rise, 16px, 500ms, `cubic-bezier(0.16, 1, 0.3, 1)`. Grid children
      stagger 80ms.
- [ ] Card hover and button press per `docs/DESIGN.md`.
- [ ] `prefers-reduced-motion` short-circuits everything to final state.
- [ ] Focus-visible rings in `--color-brand` on every interactive element.
- [ ] Skip link. Favicon. `<title>`, description, and Open Graph tags hand-written in
      `index.html` — for link previews, not SEO.
- [ ] Lighthouse: accessibility 100, no CLS from images.

## Phase 8 — Infrastructure

Follow `docs/ARCHITECTURE.md` for rationale; this is the execution order.

- [ ] Open the dedicated AWS account. Root MFA on, admin IAM user created, root retired.
- [ ] Budget alert at $5/month.
- [ ] `terraform/bootstrap/` — state bucket, versioned, encrypted, public access blocked.
      Apply once with local state.
- [ ] `backend.tf` with `use_lockfile = true`; `terraform init -migrate-state`.
- [ ] `providers.tf` — default provider plus an `alias = "us_east_1"` provider.
- [ ] `s3.tf` — private site bucket, all four public-access blocks on, versioning on.
- [ ] `route53.tf` — hosted zone. Apply, then read the `name_servers` output.
- [ ] `acm.tf` — cert in `us-east-1`, DNS validation records in the zone.
- [ ] `cloudfront.tf` — OAC, `PriceClass_100`, compression, HTTP/3, `CachingOptimized`,
      strict response-headers policy, **and the 403/404 → `/index.html` 200 custom error
      responses with `error_caching_min_ttl = 0`**. The `/products` route does not work
      without them.
- [ ] Bucket policy allowing only this distribution's ARN.
- [ ] `oidc.tf` — GitHub OIDC provider, deploy role with `sub` scoped to the exact
      `repo:<org>/<repo>:ref:refs/heads/main`. Verify before applying.
- [ ] `outputs.tf` — bucket name, distribution ID, name servers.

**Done when:** the site loads over HTTPS on the `*.cloudfront.net` domain **and a direct
visit to `/products` returns the app rather than an XML error**. The real domain is still
untouched at this point.

## Phase 9 — CI/CD

- [ ] `deploy.yml` — `id-token: write`, OIDC role assume, build, two-pass S3 sync (hashed
      assets first with immutable caching, `index.html` last with `no-cache`), then a
      CloudFront invalidation of `/*`.
- [ ] `terraform.yml` — fmt/validate/plan on PR with the plan as a comment; apply on
      `main` behind a GitHub Environment approval gate.
- [ ] Confirm no AWS access keys exist in repository secrets.
- [ ] Push a trivial copy change and watch it reach production end to end.

## Phase 10 — Cutover

- [ ] Update nameservers at GoDaddy to the four Route 53 servers.
- [ ] Wait for delegation. Re-apply so ACM validation completes.
- [ ] Confirm apex and `www` both resolve, non-canonical redirecting.
- [ ] Confirm HTTPS, HSTS, and the security headers with an external scanner.
- [ ] Re-test direct navigation to `/products` on the real domain.
- [ ] Business email: MX, SPF, DKIM into Route 53; send and receive a test.
- [ ] Update the `mailto:` in `company.ts` to the custom-domain address.

## Later, if ever

Not scheduled. Listed so nobody treats them as oversights.

- Real product photography, and the `images` field going live
- Datasheet PDFs in `public/datasheets/`
- Per-product detail pages — deliberately rejected; anchors cover deep-linking. Only
  worth revisiting past ~15 SKUs.
- A contact form — only if `mailto:` proves inadequate, which it probably won't
