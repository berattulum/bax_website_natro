# Vercel production deploy

Primary production path for BaX Composites is **Vercel + Neon Postgres + Cloudflare R2 + Payload CMS**.

Natro Docker compose (`compose.production.yml`, `docs/natro-*.md`) remains in the repo as a **legacy VPS path** and is not required for Vercel.

## Architecture

```
Browser → Vercel (Next.js + Payload)
                ├─ Neon Postgres (DATABASE_URL)
                ├─ Cloudflare R2 (S3_* env, media collection)
                └─ public/assets (static marketing media)
```

Local SQLite (`bax.db`) is **not** used on Vercel. Content is edited in Payload admin (`/admin`) and stored in Neon.

## 1. Neon Postgres

1. Create a Neon project (region close to `fra1`, e.g. Frankfurt).
2. Copy the pooled connection string.
3. Set on Vercel:
   - `DATABASE_PROVIDER=postgres`
   - `DATABASE_URL=postgresql://...neon.tech/bax?sslmode=require`

Migrations run on every Vercel build via `vercel.json` → `pnpm migrate && pnpm build`.

## 2. Cloudflare R2 (required)

Vercel’s filesystem is ephemeral. Local `media/` uploads will not persist.

Set all of:

- `S3_BUCKET`
- `S3_ENDPOINT` (e.g. `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`)
- `S3_REGION=auto`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`

Payload enables `@payloadcms/storage-s3` when these are present. On Vercel production, missing S3 config throws at startup.

### One-time media upload

```sh
# Inventory local CMS media
pnpm media:r2:inventory

# Sync into the R2 bucket under the media/ prefix
rclone copy ./media r2:BUCKET/media --checksum
# or
aws s3 sync ./media s3://BUCKET/media --endpoint-url "$S3_ENDPOINT"
```

Marketing files under `public/assets` deploy with the Next.js build; they do not need R2 unless you choose to move them later.

## 3. Vercel project

1. Import this Git repository.
2. Framework: Next.js (auto).
3. Install: `pnpm install --frozen-lockfile` (see `vercel.json`).
4. Build: `pnpm migrate && pnpm build`.
5. Region: `fra1` (configured in `vercel.json`).
6. Copy env vars from [`.env.vercel.example`](../.env.vercel.example).

Required secrets:

| Variable | Purpose |
|----------|---------|
| `PAYLOAD_SECRET` | Payload encryption (≥32 chars) |
| `NEXT_PUBLIC_SITE_URL` / `APP_URL` | Canonical site URL |
| `REVALIDATION_SECRET` / `PREVIEW_SECRET` | Cache / draft preview |
| `DATABASE_URL` | Neon |
| `S3_*` | R2 media |
| Turnstile + Upstash | Contact form + rate limits |

Keep `ALLOW_INDEXING=false` until launch acceptance, then set `true`.

## 4. First content seed

After the first successful deploy (schema migrated):

```sh
# Point local .env at Neon + R2, then:
pnpm seed
pnpm seed:managed-pages
pnpm check:managed-pages
```

Managed page globals seeded:

- `home-page` — homepage narratives (LOCO3, capability transition, sectors, verification, engineering cards)
- `company-profile-page`
- `founder-page`, `corporate-information-page`, `sustainability-page`
- `capabilities-page`
- `ecosystem-page` (partnerships + networks chrome)
- `contact-page`

Collections `expertise-items`, `partners`, `memberships` come from `pnpm seed`.

Code defaults remain as fallbacks if a global is empty.

## 5. Admin

- Public site: `https://your-domain`
- CMS: `https://your-domain/admin`
- Create the first user via Payload’s first-run flow (or seed users if you extend `scripts/seed.ts`).

## 6. Local development

```sh
pnpm db:up          # local Docker Postgres (optional)
# or use a Neon branch DATABASE_URL in .env
pnpm dev
```

Docker standalone builds still work with `DOCKER_BUILD=1` / `OUTPUT_STANDALONE=1` (see `Dockerfile`).

## 7. Checklist

- [ ] Neon `DATABASE_URL` on Vercel Production + Preview
- [ ] All `S3_*` R2 variables set
- [ ] `PAYLOAD_SECRET`, revalidation/preview secrets set
- [ ] First build completes (`migrate` + `build`)
- [ ] `pnpm seed` + `pnpm seed:managed-pages` against Neon
- [ ] Media synced to R2
- [ ] `/admin` login works
- [ ] Homepage + company + capabilities render CMS content
- [ ] Contact form Turnstile + Upstash configured
- [ ] `ALLOW_INDEXING=true` only after acceptance
