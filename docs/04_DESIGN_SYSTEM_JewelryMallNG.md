# JewelryMallNG — Full Design System (v1.0)
**Stack target:** Next.js 15 + Tailwind CSS + shadcn/ui | **Brand source:** `03_BRAND_GUIDELINES` | **Mobile-first**

## 1. Principles
1. Price clarity beats decoration — tier + stock always visible without scroll on PDP.
2. Thumb-first: primary actions ≥48px, bottom-anchored on mobile (sticky ATC bar).
3. One truth: `resolvePrice()` drives every price UI (web, dashboard, WhatsApp cards).
4. Calm luxury: ivory space, onyx text, gold sparingly for action/value.
5. Offline-tolerant: skeletons, optimistic cart, queued checkout retry.

## 2. Tokens
### 2.1 Color (Tailwind extend)
```js
// tailwind.config.js
colors: {
  onyx: { DEFAULT:'#121014', soft:'#1D1A22' },
  ivory:{ DEFAULT:'#FAF7F1', deep:'#F1EAD F'.replace(' ','') }, // -> '#F1EADF'
  gold: { light:'#F1E3C3', DEFAULT:'#C6A15B', deep:'#9A7B2E' },
  emerald:{ DEFAULT:'#0E5E4A', tint:'#DFF0E8' },
  blush:  { DEFAULT:'#F6D9D0', deep:'#C98A7A' },
  clay:   { DEFAULT:'#B4432F', tint:'#FBE7E1' },
  stone:  { border:'#E8E2D6', muted:'#6E675C' }
}
```
Corrected: `ivory.deep: '#F1EADF'`. Focus ring: `gold.DEFAULT` 2px + offset 2px. Dark BG: onyx, text ivory, CTA gold.

### 2.2 Typography
- Display: `Fraunces, Playfair Display, serif`; Body: `Inter, system-ui`. Scale (px/rem): `display-lg 40/2.5rem 600 -0.01em`, `display 32`, `h1 32/40`, `h2 24/32`, `h3 20/28`, `body 16/26`, `small 14/22`, `caption 12/18`. Prices: `font-variant-numeric: tabular-nums; font-weight:600`.
- Naira format: `₦12,500` (no decimals, `₦` + en-NG grouping). Tier table: `1–11 ₦12,500 • 12–49 ₦10,800 • 50+ ₦9,200` with active tier highlighted champagne.

### 2.3 Spacing / Radius / Shadow / Breakpoints
- Spacing 4pt base (`1=4,2=8,3=12,4=16,6=24,8=32,12=48`). Container max 1200px, gutters 16 mobile / 24 desktop.
- Radius: `sm 8, md 12, lg 16, xl 24, full 999`. Cards `lg`, CTAs `full` (mobile) / `md` (desktop admin), images `md`.
- Shadows: `card: 0 1px 2px rgba(18,16,20,.06), 0 8px 24px -12px rgba(18,16,20,.18)`; `pop: 0 12px 40px -12px rgba(18,16,20,.3)`.
- Breakpoints: `sm 640, md 768, lg 1024, xl 1280`. Design mobile 360px first, then 768, 1200.

## 3. Components (spec + states + a11y)

### 3.1 Buttons
- **Primary (gold):** bg gold, onyx text, hover deep-gold bg + white text, disabled stone, loading spinner. Heights 48 (mobile) / 44 desktop. Label: verb + value — "Add to Cart • ₦12,500".
- **Secondary (onyx outline):** 1px onyx, hover fill onyx→ivory text. **Ghost:** text-only + underline offset. **Danger:** clay. **WhatsApp:** emerald bg + white + chat icon.
- A11y: focus-visible ring, `aria-disabled`, min contrast 4.5:1, no colour-only meaning.

### 3.2 Badges / Stock pills
`Verified ✓` (emerald tint), `Only N left` (champagne + onyx), `Out of stock` (stone), `Wholesale -15%` (onyx bg gold text), `Sale` (blush). Uppercase 11px tracking 0.06em.

### 3.3 Product Card (PLP)
Image 4:5 WebP (800w), hover second image, wishlist heart top-right, badge top-left, title 2-line clamp 14px, price row (current semibold 16 + compare strikethrough muted), tier hint "12+ at ₦10,800" caption emerald, stock dot. Skeleton shimmer while loading.

### 3.4 PDP Composition (mobile order)
1 Gallery (swipe + dots + pinch) 2 Title + verified ticks 3 Price hero (28px) + tier table (radio rows) 4 Variant swatches (colour circles with name, finish chips, shape pills — selected = 2px gold ring) 5 Pack selector (cards: Single / Fixed 6pc / Build Mixed → stepper grid) 6 Qty stepper + live total + savings 7 Sticky ATC bar (total + Add) 8 Delivery estimator (zone select → fee + ETA) 9 Accordions (Details, Shipping, Returns) 10 Reviews 11 Related. Desktop: 2-col (gallery left sticky, config right).

### 3.5 Cart Drawer / Checkout Steps
Drawer right-slide, free-shipping progress bar (gold fill), MOQ warnings inline (clay) block checkout. Checkout: 1 Details → 2 Delivery (Lagos zones radio + pickup FREE cards) → 3 Review → 4 Pay (Paystack button + transfer-upload fallback). Order ref `ORD-2026-XXXX` shown + copied + WhatsApp-track button.

### 3.6 Order Timeline + Packing List
Timeline dots (pending stone → paid emerald → packing gold → shipped onyx → delivered emerald), timestamps + actor. Admin packing PDF: table SKU/variant/qty/bin/✓.

### 3.7 Search / Filters
Search bar with instant dropdown (thumb, name, price), filters bottom-sheet on mobile (chips + range slider for ₦), sort select, result count, clear-all. Empty: illustration + "Chat on WhatsApp" emerald CTA.

### 3.8 Chat / WhatsApp Cards (web + inbox mirror)
Bubbles: customer white right, AI ivory left with gold left-border if price cited, staff onyx left. Product card in chat: 64px thumb + name + price + [View] gold button. Image-match result: 3 candidates with % confidence bar (emerald ≥85, gold 75-84, stone <75 → "Not sure — talk to human" auto-offer). Handoff banner: "Adaeze (human) joined • has full context".

### 3.9 Admin (dashboard)
Dense tables (14px, sticky header, row hover ivory-deep, status pills), KPI cards (sales today, paid %, low-stock count, handoff queue), low-stock banner (clay tint + Reorder button), audit log drawer. Forms: labels 12px uppercase muted, inputs 44px border stone → focus gold border, inline errors clay + icon.

### 3.10 Forms / Feedback
Toasts top-center (mobile) / bottom-right desktop, auto-dismiss 4s, action undo. Skeletons for cards/images. 404/empty-order illustrations in line-gem style + CTA.

## 4. Patterns
- **Pricing display:** never show price without qty context + stock. Wholesale unlocked only if `qty ≥ MOQ` → show emerald "Wholesale applied".
- **Mixed-pack builder:** grid of variants with +/- steppers, live count `8/12 min`, progress gold bar, validation blocks ATC.
- **Attribution:** every shared link appends `?ref={code}&utm_source={ch}`; short `/r/{code}` 302s with logging.
- **Motion:** 150-200ms ease-out, image fade-in, drawer slide, number count-up on total. `prefers-reduced-motion` disables. Preloader: mono gem draw 800ms max.

## 5. Accessibility & Performance Budgets
- WCAG 2.2 AA: 44px targets, visible focus, labels on all inputs, alt `"{Product} in {Colour}, {view}"`, colour never sole signal (icon + text).
- Budgets: PDP critical JS ≤180KB, images AVIF/WebP `srcset 400/800/1200`, ISR 60s PLP / 300s PDP, Cloudflare cache `s-maxage` + stale-while-revalidate.

## 6. Implementation Snippets
```tsx
// Price hero — single source resolvePrice()
const q = await resolvePrice({ familyId, packId, qty });
<TierTable tiers={q.tiers} activeMin={q.appliedMin} savings={q.savingsVsRetail} />
<StockPill level={variant.stock} threshold={variant.lowAt} />
<StickyBar total={q.total} onAdd={addToCart} disabled={!q.meetsMOQ} />
```
```css
:root{ --c-onyx:#121014; --c-ivory:#FAF7F1; --c-gold:#C6A15B; --c-gold-deep:#9A7B2E; }
.price{ font-variant-numeric:tabular-nums; font-weight:600 }
```

## 7. File Map (when building)
`app/(shop)/, components/product/*, components/checkout/*, components/chat/*, app/admin/*, styles/tokens.css, lib/pricing.ts, lib/format-naira.ts`

## 8. QA Checklist per Component
Renders 360px without h-scroll, keyboard reachable, screen-reader name, loading/empty/error states, dark-footer contrast, LCP impact <100ms, matches brand tokens (no rogue hex).
