# Component Concepts, Inc. — Website

Static marketing site for Component Concepts, Inc. Five products, two pages, no backend.

Built with Vite + React + TypeScript + Tailwind. Hosted on S3 behind CloudFront in a
dedicated AWS account, provisioned with Terraform, deployed by GitHub Actions.

- **Production:** `TODO(sean): https://componentconcepts.com`
- **Architecture:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- **Design system:** [`docs/DESIGN.md`](docs/DESIGN.md)
- **Work backlog:** [`docs/TASKS.md`](docs/TASKS.md)
- **Agent instructions:** [`CLAUDE.md`](CLAUDE.md)

---

## Quick start

```bash
nvm use            # Node 22 LTS, see .nvmrc
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # -> dist/
npm run preview    # serve dist/ locally
npm run lint
npm run typecheck
```

## Editing product content

All five products live in `src/data/products.ts`, typed against
`src/types/product.ts`. Company details (address, phone, email, founding year) live in
`src/data/company.ts`. Neither requires touching a component.

Adding a product is one array entry. Nothing else needs to change — the teaser cards,
the expanded blocks, the icon tiles, and the spec tables all derive from the data.

Photos live in `public/images/` and are referenced from `src/data/company.ts`. There are
four of them and they are environmental, not product shots — see `docs/DESIGN.md`.

## Repository layout

```
.
├── CLAUDE.md                  Agent instructions — read before writing code
├── README.md
├── .nvmrc                     Node 22
├── package.json
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── components.json            shadcn/ui CLI config
├── index.html
│
├── docs/
│   ├── ARCHITECTURE.md        Infra, AWS account setup, CI/CD, decisions
│   ├── DESIGN.md              Color, type, photography, motion spec
│   └── TASKS.md               Sequenced backlog with acceptance criteria
│
├── public/
│   ├── favicon.svg
│   └── images/                Four environmental photos, WebP, <150KB each
│
├── src/
│   ├── main.tsx               Router setup
│   ├── App.tsx                Layout shell — Header, Outlet, Contact, Footer
│   ├── index.css              Tailwind import + @theme design tokens
│   │
│   ├── types/
│   │   └── product.ts         Product + Category types
│   │
│   ├── data/
│   │   ├── products.ts        The five SKUs — single source of truth
│   │   └── company.ts         Name, email, phone, address, founded
│   │
│   ├── pages/
│   │   ├── Home.tsx           Hero, teaser, capabilities
│   │   └── Products.tsx       All five products expanded
│   │
│   ├── components/
│   │   ├── ui/                shadcn-generated. Do not hand-edit.
│   │   ├── layout/
│   │   │   ├── Header.tsx     Wordmark, nav links, mobile Sheet
│   │   │   ├── Footer.tsx
│   │   │   ├── Contact.tsx    Shared — renders at the bottom of both pages
│   │   │   └── Section.tsx    Shared shell: eyebrow, heading, alt background
│   │   ├── product/
│   │   │   ├── ProductCard.tsx    Teaser card, home page
│   │   │   ├── ProductBlock.tsx   Full expanded block, products page
│   │   │   ├── IconTile.tsx       Flat category tile in place of a photo
│   │   │   └── SpecTable.tsx
│   │   └── media/
│   │       └── Photo.tsx      Wraps img with explicit dims + lazy loading
│   │
│   ├── hooks/
│   │   └── use-reveal.ts      IntersectionObserver scroll reveal
│   │
│   └── lib/
│       └── utils.ts           cn() — clsx + tailwind-merge
│
├── terraform/
│   ├── README.md              Bootstrap and apply order
│   ├── bootstrap/             One-time: state bucket (local state)
│   ├── backend.tf             S3 backend, use_lockfile = true
│   ├── providers.tf           Default region + aliased us-east-1
│   ├── variables.tf
│   ├── terraform.tfvars.example
│   ├── s3.tf                  Private site bucket + OAC bucket policy
│   ├── cloudfront.tf          Distribution, OAC, SPA error responses
│   ├── acm.tf                 Cert in us-east-1, DNS validation
│   ├── route53.tf             Hosted zone, A/AAAA alias, MX
│   ├── oidc.tf                GitHub OIDC provider + deploy role
│   └── outputs.tf             bucket name, distribution id, NS records
│
└── .github/workflows/
    ├── terraform.yml          plan on PR, apply on main (protected env)
    └── deploy.yml             build, two-pass S3 sync, invalidate
```

## Deploying

Pushes to `main` that touch `src/`, `public/`, or the build config trigger
`deploy.yml`. Pushes touching `terraform/` trigger `terraform.yml`, which plans on pull
requests and applies on `main` behind a GitHub Environment approval gate.

Nothing is deployed manually. There are no AWS credentials on any developer machine
beyond a local admin profile used once for bootstrap.

## Cost

Roughly $0.50/month — the Route 53 hosted zone. S3 storage, CloudFront transfer, and
CloudFront invalidations all round to zero at this traffic level.
