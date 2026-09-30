# JewelryMallNG — Folder Review & Insights
**Date:** 30 Sep 2026 | **Analyst:** OpenCode | **Source:** `docx/` (3 PDFs by Hiddekel Studio)

## 1. What exists
Folder contains only pre-sales / planning docs, no code yet:
- `JewelryMallNG_Executive_Summary.pdf` (v1.0, JMNG-ES-0903) — 1-pager: what, cost, timeline.
- `JewelryMallNG_Build_Plan_and_Requirements.pdf` (v1.2, JMNG-BP-0903) — 7 pages: scope, journeys, WhatsApp rules, 3-week plan, costs.
- `JewelryMallNG_Infrastructure_Costs.pdf` (v1.2, JMNG-IC-0903) — 3 pages: server/domain/usage pricing with receipts.

No repo, no designs, no catalogue sample, no code. This is a greenfield build.

## 2. Project in one paragraph
Single source-of-truth commerce system for JewelryMallNG (Nigerian fashion jewelry, retail + wholesale): mobile-first storefront + staff dashboard + WhatsApp AI assistant sharing same product/price/stock/order data. Identity design included. 3-week delivery after preconditions. ₦1,000,000 service + ₦270,000 first-year infra = ₦1,270,000 total.

## 3. Scope clarity — good
**Included (9 areas):** identity, storefront (home, collections, search/filter, PDP, cart, checkout, policy pages), product families/variants/packs/quantity pricing, orders + verified online payment, stock/packing/delivery stages, WhatsApp AI (FAQ, catalogue links, image match, order guidance, status check, handoff), staff dashboard, attribution + sales/channel reports, testing/launch/training + 30-day support.
**Explicitly excluded:** Instagram/TikTok automation, ads, content creation, photography, packaging/printing, logistics ops, native app. Correct to exclude — prevents scope creep.

## 4. Money analysis
- Service payments: ₦500k start + ₦250k working-system review + ₦250k launch = ₦1M.
- Infra cap ₦270k: netcup RS 1000 G12 ~₦205k–₦244k ( €128.97–€153.48/yr depending on VAT), .com via Cloudflare ~₦15.7k budgeted at ₦20k, ₦5k launch buffer for R2/backup/transactions.
- Evidence-based budgeting (July 2026 receipt ₦197,682, Aug 2026 domain $10.46) — credible, no markup, unused refunded.
- **Variable costs at client's risk:** WhatsApp utility/template messages outside 24h window, AI tokens (example: 1,000 convos ≈ $3.20 on GPT-5.6 Luna), Paystack/Flutterwave fees (~1.5% + ₦100 capped in NG), R2 overage ($0.015/GB-mo), transactional email/SMS. Must set caps + alerts day one.

## 5. Timeline analysis — aggressive but feasible
Days 1-3 requirements+identity, 4-10 commerce, 8-15 WhatsApp (overlap), 16-19 testing, 20-21 launch. 21 calendar days.
**Critical dependencies:** 1 decision-maker with 24h feedback, 10–20 complex products sample day one, domain + Meta/Paystack access, delivery-fee + return/refund policies, FAQs + tone + escalation rules.
Any delay shifts date, not scope — contractually sound. Biggest risk: identity approval + catalogue data quality stall Days 1-3 and cascade.

## 6. Technical constraints & implications
- Single netcup RS 1000 G12 (4x AMD EPYC, 8GB DDR5, 256GB NVMe) must run storefront + dashboard + DB + WhatsApp webhook + AI workers + monitoring. No managed DB at launch. → Must use Docker, Postgres on-volume, nightly R2 backups + restore test, Cloudflare cache/CDN/WAF free tier.
- Mobile-first NG reality: low-end Android, 3G/4G, WhatsApp-first discovery via Instagram/TikTok links. → <200KB critical path, image optimization, Paystack inline + bank transfer fallback, UTM + `ref` attribution.
- WhatsApp safety rules are well-defined (no invented price/stock, no certainty on low-confidence image match, no refund approval, no cross-customer leak, human handoff with context). → Must be enforced in system prompt + tool permissions + evals.
- Complex pricing: variations (colour/finish/shape) × packs (fixed/mixed) × MOQ × retail/wholesale tiers. This is the hardest domain logic — needs a pricing engine, not hardcoded prices.

## 7. Gaps / decisions still open
1. Payment provider not named (recommend Paystack).
2. Domain name not selected / availability + premium risk.
3. AI model not locked (Luna pricing is example only).
4. WhatsApp provider: direct Meta Cloud API vs ISV (e.g., Twilio/Interakt) — affects fees.
5. Delivery zones/fees, pickup points, fulfilment stages undefined.
6. Staff roles/permissions undefined.
7. Catalogue photography quality unknown.
8. Post-30-day maintenance owner undefined.
9. No SLA for AI accuracy, no acceptance thresholds defined yet.
10. No mention of SEO, analytics (GA4/Pixel), NDPR compliance, refund verification flow.

## 8. Recommendations (best-value path)
- **Stack:** Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui, Prisma + PostgreSQL, NextAuth (staff RBAC), Paystack, Meta WhatsApp Cloud API, OpenAI (GPT-4o-mini / Luna-class) with tool-calling + pgvector for image/text match, BullMQ + Redis, Docker Compose + Caddy, R2 for images/backups, Sentry + Uptime Kuma. Single deploy on netcup. Why: one team, one repo, fastest 3-week delivery, fits 8GB RAM, Cloudflare-friendly.
- **Alternative rejected:** Medusa/Strapi + separate frontend — too heavy to customize pack/tier pricing in 3 weeks. Native app — correctly deferred to PWA.
- **Phase 0 (Day 0):** lock domain, Paystack, Meta Business, AI spend cap ₦5k/mo alert, get catalogue CSV + images.
- **Risk mitigations:** pricing-engine unit tests (50+ cases), WhatsApp eval set (100 Q&A + 30 image matches), backup-restore drill Day 17, feature-flag Instagram automation for Phase 2.
- **KPIs to track from Day 1:** conversion by channel, WhatsApp containment % vs handoff, order-to-paid %, stockout rate, image-match top-3 accuracy.

## 9. What I built from this
1. `docs/02_PRD_JewelryMallNG.md` — detailed, build-ready PRD.
2. `docs/03_BRAND_GUIDELINES_JewelryMallNG.md` — comprehensive brand doc.
3. `docs/04_DESIGN_SYSTEM_JewelryMallNG.md` — full design system + Tailwind tokens.
4. `AGENT.md` — self-improving agent operating file for this repo.
