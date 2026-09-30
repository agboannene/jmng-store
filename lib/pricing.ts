// Single source of truth for ALL pricing — web, admin, WhatsApp must call this.
export interface Tier { minQty: number; retailPrice: number; wholesalePrice: number; packId?: string | null }
export interface ResolveInput {
  tiers: Tier[];
  qty: number;
  packId?: string | null;
  wholesaleMin?: number;
  moq?: number;
}
export interface ResolveResult {
  unitPrice: number; total: number; appliedMin: number;
  isWholesale: boolean; meetsMOQ: boolean; savingsVsRetail: number;
}
export function resolvePrice({ tiers, qty, packId = null, wholesaleMin = 12, moq = 1 }: ResolveInput): ResolveResult {
  if (!tiers.length) throw new Error('No price tiers');
  if (qty <= 0) throw new Error('Qty must be > 0');
  const pool = tiers.filter(t => (t.packId ?? null) === (packId ?? null));
  if (!pool.length) throw new Error('No tiers for pack');
  const sorted = [...pool].sort((a, b) => a.minQty - b.minQty);
  let active = sorted[0];
  for (const t of sorted) if (qty >= t.minQty) active = t;
  const isWholesale = qty >= wholesaleMin;
  const unitPrice = isWholesale ? active.wholesalePrice : active.retailPrice;
  const total = unitPrice * qty;
  const baseTotal = sorted[0].retailPrice * qty;
  return { unitPrice, total, appliedMin: active.minQty, isWholesale, meetsMOQ: qty >= moq, savingsVsRetail: baseTotal - total };
}
export function formatNaira(n: number): string {
  return '₦' + Math.round(n).toLocaleString('en-NG');
}
