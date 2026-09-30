# JewelryMallNG — Shine, Verified
Next.js + Prisma/Postgres + Tailwind. Retail + wholesale jewelry with WhatsApp concierge.

## Deploy: GitHub → Vercel (no netcup needed)
Yes, this works. Vercel hosts the Next.js app + API routes (Paystack/WhatsApp webhooks).
You only need a hosted Postgres (Vercel can't run `docker-compose` Postgres).

**1. Database (free, 2 min) — Neon (recommended for Prisma + Vercel):**
- Sign up at neon.tech → New project `jewelrymallng` (region: US East) → copy **pooled** connection string.
- It looks like: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/jewelrymallng?sslmode=require`

**2. Push to GitHub:**
```bash
git init && git add -A && git commit -m "JewelryMallNG foundation"
gh repo create jewelrymallng --private --source=. --push
# or: create repo on github.com manually, then:
# git remote add origin https://github.com/YOU/jewelrymallng.git && git push -u origin main
```

**3. Vercel:**
- vercel.com → Add New Project → Import `jewelrymallng` → Framework: Next.js (auto).
- Build command (already in `vercel.json`): `prisma generate && next build`.
- Env vars (copy from `.env.example`, use **Neon pooled URL** for `DATABASE_URL`):
  `DATABASE_URL`, `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`,
  `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
  `WHATSAPP_VERIFY_TOKEN`, `OPENAI_API_KEY`, `NEXT_PUBLIC_SITE_URL` (= your vercel URL).
- Deploy → run once against prod DB: `prisma migrate deploy` (via Vercel → Storage → or locally with prod URL).

**4. Point Meta + Paystack webhooks at Vercel:**
- WhatsApp verify: `https://YOUR.vercel.app/api/webhooks/whatsapp` (GET verify token = `WHATSAPP_VERIFY_TOKEN`).
- Paystack webhook: `https://YOUR.vercel.app/api/webhooks/paystack`.

## What changes vs netcup plan
| netcup RS 1000 | Vercel path |
|---|---|
| Postgres on server | Neon/Supabase hosted (free tier fine for launch) |
| Docker Compose | Not used on Vercel (kept for later netcup move) |
| R2 backups | Neon auto-backups + `pg_dump` to R2 (same script) |
| Always-on workers (BullMQ) | Vercel Cron + serverless; Upstash Redis later if needed |

Move back to netcup anytime: `docker compose up -d` still works — no code change, just `DATABASE_URL`.

## Dev
```bash
npm install
cp .env.example .env   # fill Neon URL for shared dev, or local postgres
npx prisma migrate dev
npm run dev
```
