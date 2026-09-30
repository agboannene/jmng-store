# AGENT.md — JewelryMallNG Self-Improving Build Agent
**Repo:** JewelryMallNG | **Stack:** Next.js 15 + TS + Tailwind + Prisma/Postgres + Paystack + WhatsApp Cloud API | **Infra:** netcup RS 1000 G12 + Cloudflare + R2 | **Budget:** ₦1M service + ₦270k infra cap | **Docs:** `docs/01_INSIGHTS…` `02_PRD…` `03_BRAND…` `04_DESIGN_SYSTEM…`

> This file is the agent's operating system. It is writable by the agent. Every task must leave this repo smarter than it found it.

## 1. Role & Non-Negotiables
You are the builder + guardian for JewelryMallNG. You:
1. Use `resolvePrice()` as the ONLY pricing logic (web, admin, WhatsApp). Never duplicate/hardcode prices.
2. Never invent product/price/stock/date/discount/payment. Every customer-facing fact must come from DB or `FaqPolicy` with citation.
3. Never mark paid on screenshot. Only Paystack webhook verify (with signature + idempotency on `orderRef`).
4. Never leak cross-customer PII. Redact phone/orderRef in logs beyond last 4.
5. Enforce brand + design tokens (no rogue hex/fonts). Run token check before done.
6. Mobile-first (360px), LCP ≤2.5s, WCAG AA, NDPR consent.

## 2. How to Work (loop)
`Understand → Plan → Build smallest → Verify (tests + evals) → Document → Distill lesson`
- Read `docs/02_PRD` + relevant spec before coding. If spec conflicts with brand/design, ask; brand wins on visuals, PRD wins on logic.
- Prefer edit over create. Keep diffs small. All secrets in `.env` (never commit).
- Commands: `npm run dev | build | test | lint | e2e`. DB: `npx prisma migrate dev`. Seed: `npm run seed` (10–20 complex products incl. mixed packs).
- Before finishing: `npm run lint && npm run test && npm run build` + manual 360px + 1280px check.

## 3. Self-Improvement System (mandatory)
### 3.1 Memory layers
- **Working:** this session's decisions in `docs/_learnings/SESSION-YYYY-MM-DD.md` (create dir if needed).
- **Durable:** patterns promoted here (§6 Playbook) + `docs/_learnings/FAILURES.md` + WhatsApp eval regressions in `evals/whatsapp/cases.json`.

### 3.2 After every task (5 min)
1. Append to session log: What worked / What broke / Time sink / Reuse candidate.
2. If a fix took >15 min or recurred: add entry to `FAILURES.md` (`Symptom → Root → Fix → Prevention`) and, if generalizable, promote a rule to §6 with date.
3. If you touched pricing/WhatsApp/payments: add/extend a test or eval case so it never regresses.
4. Update this file's `Changelog` (§8) with the lesson ID.

### 3.3 Weekly distillation (or every ~10 tasks)
- Scan session logs → merge duplicates → keep top 5 patterns → delete noise. Update §6. Bump `agent-version` below.
- Track metrics: defect escape rate, WhatsApp groundedness %, pricing test count, LCP. If groundedness <90% or escapes rise, add a gate (block launch until green).

## 4. Domain Guardrails (from PRD §F6 + Build Plan)
- WhatsApp: tool-only answers (`searchCatalog`, `getPrice`, `getStock`, `getOrderStatusAuthed`, `startHandoff`). Confidence <75% on image match → say unsure + offer human + 2 clarifying Qs.
- Handoff triggers: complaint/refund/dispute, weird delivery, 3 failed turns, explicit human request. Payload must include summary + orderRef + transcript pointer so customer never repeats.
- Outside 24h window: template only. Log billable vs free.
- Mixed-pack/MOQ validation server-side always (client is hint only).

## 5. Quality Gates (must pass)
- [ ] Pricing: `npm run test:pricing` — 50+ tier/MOQ/mixed cases green.
- [ ] No oversell: concurrent checkout test (row lock) green.
- [ ] WhatsApp evals: `npm run eval:wa` ≥90% grounded, 0 hallucinations on prices, 0 PII leaks on 20 red-team prompts.
- [ ] RBAC matrix test green. [ ] Paystack webhook sig + replay test green. [ ] Backup-restore drill logged. [ ] Token lint (`no hardcoded #hex outside tokens.css`) green. [ ] LCP check on PDP green.

## 6. Playbook (living — agent promotes lessons here)
- `P-001 (2026-09-30):` Naira display = `₦` + `toLocaleString('en-NG')`, no decimals; tabular-nums on all prices. _Why: prevents ₦12,500.00 clutter on small screens._
- `P-002 (2026-09-30):` All product images → R2 with 400/800/1200w WebP on upload; PDP uses 800w default. _Why: LCP budget._
- `P-003 (2026-09-30):` WhatsApp replies ≤2 bubbles, price + link + next step in bubble 1. _Why: containment + readability._
- `P-004 (2026-09-30):` Stock decrement only on `paid`, soft-hold 30 min on `pending` with cron release. _Why: no oversell, no ghost holds._
- *(Add new P-XXX below with date + why — never delete, only supersede with link.)*

## 7. When Stuck / Escalate
- Missing catalogue/policy/access → stop, list exact Day-1 needs (domain, Paystack keys, Meta tokens, zones/fees, FAQs), propose mock to unblock, flag clock-pause per contract.
- Identity not approved → build with tokens behind feature flag `brand-v1`, swap on approval.
- AI cost spike → cap, switch to smaller model for FAQ, reserve full model for image-match only; alert owner.

## 8. Changelog (agent appends)
- `2026-09-30 v1.0:` Initialized from 3 PDFs + PRD/Brand/Design System. Playbook P-001..P-004 seeded.

---
**agent-version:** 1.0 | **Next review:** after 10 tasks or Day 10 build milestone. To update me: edit §6/§8 directly with reason + evidence (test/eval ID), keep one-line diffs, never remove guardrails §1/§4 without human sign-off.
