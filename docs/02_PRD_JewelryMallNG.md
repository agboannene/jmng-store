# JewelryMallNG — Product Requirements Document (PRD)
**Version:** 1.0 | **Date:** 30 Sep 2026 | **Owner:** Hiddekel Studio for JewelryMallNG
**Sources:** JMNG-ES-0903 v1.0, JMNG-BP-0903 v1.2, JMNG-IC-0903 v1.2
**Status:** Build-ready for 3-week delivery | **Total budget:** ₦1,270,000 (service ₦1M + infra cap ₦270k)

---

## 1. Vision & Objectives
**Vision:** One trusted system where website, staff dashboard, and WhatsApp assistant share the same approved product, price, stock, order, and policy data — so a customer from Instagram, TikTok, or WhatsApp can find, price, pay, and track jewelry without confusion, retail or wholesale.

**Objectives (measurable):**
| # | Objective | Target (90 days post-launch) |
|---|-----------|------------------------------|
| O1 | Mobile conversion (visit → paid order) | ≥2.5% retail, ≥8% wholesale quote-to-paid |
| O2 | WhatsApp containment (resolved without staff) | ≥60%, handoff <40%, CSAT ≥4.4/5 |
| O3 | Pricing/stock accuracy (no wrong price charged, no oversell) | 100% on approved catalogue |
| O4 | Page performance (Moto G4 / 4G, Lagos) | LCP ≤2.5s, INP ≤200ms, PDP ≤180KB critical JS |
| O5 | Attribution coverage (orders with known source) | ≥85% |
| O6 | Operational: order paid → packed ≤24h, stockout rate | <5% on top 20 SKUs |

## 2. Users & Personas
- **P1 Ada (Retail, 22-34, Lagos/Abuja):** discovers via IG/TikTok, buys 1-3 pieces, pays with Paystack (card/transfer/USSD), wants delivery fee upfront, tracks on WhatsApp.
- **P2 Mrs. O (Wholesaler, reseller):** buys 20-100 pcs mixed packs, needs tier pricing + MOQ + packing list, repeats monthly, wants invoice + pickup option.
- **P3 Staff — Ops/Admin:** manages products, prices, stock, orders, payments, customers, sees reports. Roles: `superadmin`, `manager`, `fulfilment`, `support`, `viewer`.
- **P4 WhatsApp AI (system actor):** answers only from approved data, hands off with summary.

## 3. Scope
### 3.1 In scope (maps to Build Plan §2)
F1 Identity applied to web. F2 Storefront. F3 Products & pricing engine. F4 Orders & Paystack verification. F5 Stock/packing/delivery. F6 WhatsApp AI. F7 Staff dashboard + RBAC. F8 Tracking & reports. F9 Testing/launch/training + 30-day support.
### 3.2 Out of scope
IG/TikTok inbox automation, ads, ongoing content, photography, packaging print, rider logistics, native app. Log as Phase 2 backlog (§12).

## 4. Functional Requirements

### F2 — Storefront (mobile-first, SEO, NDPR)
- **FR-201 Home:** hero, shop by collection, bestsellers, wholesale CTA, reviews, IG strip, FAQ teaser. CMS-editable.
- **FR-202 PLP/Collections:** filters (collection, colour, finish, shape, price, pack-type, availability), sort (popular, newest, price), pagination, empty state with WhatsApp CTA.
- **FR-203 Search:** instant suggest (name, SKU, colour), typo tolerance, recent searches, no-result → top-5 alternatives + WhatsApp link.
- **FR-204 PDP:** gallery (zoom, swipe), variant selectors (colour/finish/shape), pack selector (single / fixed pack / mixed pack builder), quantity stepper with tier-price table (e.g., 1-11 ₦X, 12-49 ₦Y, 50+ ₦Z), live stock badge (`In stock`, `Only N left`, `Out of stock`), delivery estimator by zone, wholesale MOQ notice, related items, share link with `?ref=`.
- **FR-205 Cart:** line = family + variant + pack + qty, validates MOQ/stock on every change, shows savings vs retail, persists (localStorage + DB if logged in).
- **FR-206 Checkout:** guest + optional account; fields: name, phone (WhatsApp-validated NG format), email (optional), zone → delivery/pickup point → fee; order notes; T&C + return policy checkbox; creates `ORD-YYYY-XXXX` reservation with 30-min stock hold.
- **FR-207 Policy pages:** contact, shipping/delivery, returns/exchange/refund, privacy (NDPR), terms, FAQ. All CMS-editable, versioned, surfaced to WhatsApp AI as approved corpus.
- **FR-208 Attribution:** capture `utm_source/medium/campaign`, `ref`, `gclid/ttclid`, landing page, persist to order + WhatsApp session. Short links `/r/{code}` for IG bio/TikTok.

### F3 — Products & Pricing Engine (hardest logic — must be exact)
- **Data model:** `Family` → `Variant` (colour/finish/shape, SKU, barcode, images, weight) → `PackDef` (single | fixed {components} | mixed {min/max per variant}) → `PriceTier` (minQty, retailPrice, wholesalePrice, channel).
- **FR-301:** Admin creates family once, adds variants as matrix, uploads images per variant.
- **FR-302 Pricing resolver (pseudo):** `price = lookup(family, pack, qty) → tier where qty >= minQty ORDER BY minQty DESC; if wholesale flag + meets MOQ → wholesalePrice else retailPrice; mixed pack pro-rates by component weights.` Must be single server function `resolvePrice()` used by web, dashboard, and WhatsApp — no duplicate logic.
- **FR-303:** MOQ enforcement per family/pack; mixed-pack validation (e.g., min 12 pcs, max 3 per colour).
- **FR-304:** Scheduled sales (`compareAtPrice`, start/end) with approval log; never auto-discount without approval.
- **Acceptance:** 50+ unit tests covering tier boundaries, mixed-pack math, MOQ rejects, currency rounding (₦ whole naira, no kobo decimals on display).

### F4 — Orders & Payments
- **FR-401 Order states:** `pending → paid → packing → ready → shipped/delivered | picked_up → completed` + `cancelled/refunded`. Every transition logged (who/when/note).
- **FR-402 Paystack:** initialize with `orderRef`, verify server-side via webhook + polling fallback, never mark paid on screenshot alone. Support card, bank transfer, USSD. Fees deducted by provider (selling cost).
- **FR-403 Customer comms:** SMS/WhatsApp/email on `paid`, `shipped` (with tracking note), `ready_for_pickup`. Templates approved in advance.
- **FR-404 Proof-of-payment upload:** image stored to R2, flagged `unverified` until staff confirms + Paystack reconciliation.
- **Acceptance:** test-mode + live ₦100 test, webhook replay test, double-spend prevention (idempotency key = orderRef).

### F5 — Stock, Packing, Delivery
- **FR-501:** Stock per variant SKU, decrement on `paid` (not on cart add; cart holds soft-reserve 30 min), increment on cancel/restock with reason.
- **FR-502:** `StockLedger` append-only (delta, reason, actor, orderRef). Low-stock threshold per SKU → dashboard banner + WhatsApp alert to manager.
- **FR-503:** Packing list PDF per order (SKU, variant, qty, bin, check-boxes). Delivery stages configurable: `Lagos 1-2d ₦X, Outside Lagos 2-5d ₦Y, Pickup FREE (Ikeja)`.
- **Acceptance:** oversell impossible under 50 concurrent checkouts (row-level lock test).

### F6 — WhatsApp AI (Meta Cloud API)
- **FR-601 Capabilities:** approved FAQ/policy answers with citation link, live catalogue search → product/cart link, image-match (customer photo vs catalogue, return top-3 with confidence %, never claim certainty <75%), order guidance (how to order/pay), safe order-status check only after phone + orderRef match, handoff summary to staff.
- **FR-602 Guardrails (must):** no invented product/price/stock/date/discount/payment; no refund/credit approval; no cross-customer data; screenshot ≠ proof; low-confidence → ask clarifying Q + offer human; every AI answer logged with sources + tools used.
- **FR-603 Handoff triggers:** complaint, refund/dispute, unusual delivery, low confidence, explicit "human" request, 3 failed turns. Payload: transcript summary, intent, orderRef, suggested reply. Staff resumes in same thread (dashboard → WhatsApp).
- **FR-604 24h window awareness:** inside window = free-form service; outside = approved template only. Cost dashboard shows billable vs free.
- **Acceptance:** 100-question eval (≥90% grounded), 30-image eval (top-3 hit ≥75%), red-team 20 jailbreaks (0 leaks / 0 false prices).

### F7 — Staff Dashboard + RBAC
- Modules: Products, Pricing, Stock, Orders, Payments, Customers, Conversations (WhatsApp inbox + AI transcripts + take-over), Discounts, Content/FAQs, Staff & Roles, Reports, Settings.
- **FR-701:** Every mutation requires reason + audit log. Bulk CSV import/export for catalogue. Image bulk upload to R2 with auto-resize (800/1200/1600w WebP).
- **FR-702 Permissions matrix:** e.g., `fulfilment` can advance packing but cannot edit price; `support` can reply WhatsApp but cannot refund; only `manager+` can approve refund.
- **Acceptance:** permission tests for all roles × all mutations.

### F8 — Tracking & Reports
- Dashboards: sales (by day/channel/collection/SKU), WhatsApp (sessions, containment, handoff reason, response time), inventory (stockout, slow movers), payment (success rate, method split). Export CSV. UTM + ref attribution on every order.

## 5. Non-Functional Requirements
- **NFR-Perf:** LCP ≤2.5s on 4G, image CDN via Cloudflare + R2, ISR for PLP/PDP, Postgres indexes on SKU/slug/orderRef.
- **NFR-Security:** OWASP top-10, rate-limit auth/webhook, Paystack webhook signature verify, Meta webhook verify, NDPR consent + data export/delete, staff 2FA, secrets in env vault, PII redaction in logs.
- **NFR-Reliability:** Docker Compose on netcup RS 1000 G12, daily Postgres dump + WAL to R2, restore drill Day 17, Uptime Kuma + Sentry, 99.5% monthly target (single-node acknowledged).
- **NFR-A11y/SEO:** WCAG 2.2 AA, semantic HTML, JSON-LD Product/Offer, sitemap, OG images, canonical URLs.
- **NFR-i18n:** en-NG primary, WhatsApp tone allows light Pidgin only from approved phrases.

## 6. Data Model (core tables)
`BrandAsset, Collection, Family, Variant(SKU), PackDef, PackComponent, PriceTier, Inventory, StockLedger, Customer, Order, OrderItem, Payment, Fulfilment, Coupon, Conversation, Message, ImageMatch, Attribution, FaqPolicy, StaffUser, AuditLog`

Key constraints: `Variant.sku UNIQUE`, `PriceTier(familyId, packId, minQty) UNIQUE`, `Order.ref UNIQUE`, `Payment(orderId, providerRef) UNIQUE`, FK cascades restricted on paid orders.

## 7. API Surface (Next.js Route Handlers / tRPC-style)
`GET /api/catalog/search?q=&filters`, `GET /api/products/[slug]`, `POST /api/cart/price` (resolvePrice), `POST /api/orders`, `POST /api/payments/initialize`, `POST /api/webhooks/paystack`, `POST /api/webhooks/whatsapp`, `POST /api/whatsapp/handoff`, `GET /api/orders/[ref]/status`, `GET/POST /api/admin/*` (RBAC), `GET /api/reports/*`

## 8. Milestones (21-day clock starts after deposit + infra + access + catalogue sample + decision-maker)
- **D1-3 Requirements & Identity:** confirm catalogue/policies/access; brand brief; 2 identity directions → pick 1. Exit: signed checklist + identity choice.
- **D4-10 Commerce & Ops:** tokens → storefront → pricing engine → cart/checkout/Paystack → stock/orders → dashboard RBAC. Exit: working-system demo, ₦250k milestone.
- **D8-15 WhatsApp AI (overlap):** Cloud API + knowledge sync + image match + guardrails + inbox. Exit: eval pass.
- **D16-19 Full-system test:** mobile/desktop, test payments, permissions, fulfilment, speed, backup-restore, 100-QA eval. Exit: defect list.
- **D20-21 Launch & handover:** fix agreed defects, DNS cutover, training, creds + source + brand files after final ₦250k, 30-day support starts.

## 9. Acceptance Checklist (attached to agreement)
Catalogue pricing (20 complex products), Paystack live test, stock ledger + low-stock alert, RBAC matrix, fulfilment E2E, WhatsApp groundedness + handoff, mobile layout, LCP, backup-restore proof, training completion.

## 10. Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Catalogue data late/poor images | Day-1 sample gate; launch load limited to agreed N products, rest Phase 2 |
| Identity feedback >24h | Clock pauses; async Loom reviews |
| Meta/Paystack approval delay | Mock webhooks + test mode; go-live flag |
| AI hallucination | Tool-only prices, confidence thresholds, eval gate blocks launch |
| Single-server outage | Daily R2 backups, Cloudflare Always Online (static), runbook |
| Naira/Euro FX drift | Infra cap reconciled to receipts; usage billed at cost |

## 11. Costs (locked)
Service ₦1M (500+250+250). Infra cap ₦270k (server ~₦245k, domain ₦20k, buffer ₦5k). Usage (WhatsApp/AI/gateway/R2 overage) pay-as-you-go with weekly review + hard caps.

## 12. Phase 2 Backlog
IG/TikTok automation, loyalty/wholesale credit, advanced search (vector + filters), Hausa/Yoruba/Igbo templates, rider integration (Gokada/Kwik), PWA push, ads/pixel optimization, subscription restock boxes.

## 13. Open Decisions Needed Day 1
Domain string, Paystack vs Flutterwave, Meta BSP direct vs ISV, AI model + monthly cap, delivery zones/fees, pickup address/hours, return window (recommend 48h inspection, no earring returns for hygiene), staff list + roles, FAQ/tone approval, catalogue CSV owner.

---
**Sign-off:** Decision-maker __________  Hiddekel Studio __________  Date ______
