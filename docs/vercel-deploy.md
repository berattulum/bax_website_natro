# Vercel + Sanity + Resend

Production stack for BaX Composites:

- **Vercel** — Next.js App Router
- **Sanity** — list CMS only (expertise, partners, memberships) + Studio at `/studio`
- **Static i18n JSON** — all page copy under `src/content/i18n/`
- **Resend** — contact form email delivery
- **Cloudflare Turnstile + Upstash** — form abuse protection

Page localization is not stored in Sanity. If Sanity env vars are missing, the site still renders from static JSON plus in-code list fallbacks.

## 1. Sanity project (lists only)

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage).
2. Dataset: `production`.
3. Create API tokens:
   - Viewer → `SANITY_API_READ_TOKEN` (draft preview)
   - Editor → `SANITY_API_WRITE_TOKEN` (seed only)
4. Set on Vercel / `.env`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET=production`
   - `SANITY_API_READ_TOKEN`
   - `SANITY_API_WRITE_TOKEN`
   - `SANITY_REVALIDATE_SECRET` (or reuse `REVALIDATION_SECRET`)

Seed list documents once:

```sh
pnpm seed:sanity
```

Studio: `https://your-domain/studio`

Webhook (document changes) → `POST /api/internal/revalidate` with header `x-revalidation-secret: <SANITY_REVALIDATE_SECRET>`.

## 2. Localization (static JSON)

Edit copy in `src/content/i18n/*.json` (site-settings, home-narratives, company-profile, capabilities, ecosystem, contact, founder, corporate-information, sustainability, site-content). Load via `src/lib/cms/i18n.ts`.

## 3. Resend (required for contact form)

1. Verify domain in Resend.
2. Set:
   - `RESEND_API_KEY`
   - `CONTACT_FROM_EMAIL` (e.g. `BaX Composites <noreply@baxcomposites.com>`)
   - `CONTACT_NOTIFY_EMAIL` (inbox that receives leads)

Missing Resend env → form returns **503**.

## 4. Vercel

1. Import the Git repo (project `bax-composites` already linked if you ran `vercel link`).
2. Framework: Next.js.
3. Build: `pnpm build` (see `vercel.json`).
4. Region: `fra1`.
5. Copy vars from [`.env.vercel.example`](../.env.vercel.example).
6. **Branches:** Production Branch = `main`. `develop` is for ongoing work (preview deployments only). Promote to production by merging `develop` → `main`.

Also set Turnstile + Upstash for the contact form.

## 5. Local

```sh
pnpm install
# fill .env from .env.example
pnpm dev
```

- Site: http://localhost:3000  
- Studio: http://localhost:3000/studio  

## 6. Checklist

- [ ] Sanity project + dataset + tokens
- [ ] `pnpm seed:sanity` (lists only)
- [ ] Confirm `src/content/i18n/` copy
- [ ] Resend domain + three contact env vars
- [ ] Turnstile + Upstash
- [ ] Webhook → `/api/internal/revalidate`
- [ ] `/` and `/studio` on preview URL
- [ ] Contact form sends email
- [ ] `ALLOW_INDEXING=true` only after acceptance
