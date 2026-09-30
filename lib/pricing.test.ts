import { describe, it, expect } from 'vitest';
import { resolvePrice } from './pricing';

const tiers = [
  { minQty: 1, retailPrice: 12500, wholesalePrice: 11500 },
  { minQty: 12, retailPrice: 10800, wholesalePrice: 9800 },
  { minQty: 50, retailPrice: 9200, wholesalePrice: 8400 },
];

describe('resolvePrice', () => {
  it('retail single', () => {
    const r = resolvePrice({ tiers, qty: 1 });
    expect(r.unitPrice).toBe(12500); expect(r.isWholesale).toBe(false); expect(r.meetsMOQ).toBe(true);
  });
  it('wholesale at 12', () => {
    const r = resolvePrice({ tiers, qty: 12 });
    expect(r.unitPrice).toBe(9800); expect(r.isWholesale).toBe(true); expect(r.appliedMin).toBe(12);
  });
  it('tier boundary 49 vs 50', () => {
    expect(resolvePrice({ tiers, qty: 49 }).unitPrice).toBe(9800);
    expect(resolvePrice({ tiers, qty: 50 }).unitPrice).toBe(8400);
  });
  it('MOQ enforcement', () => {
    expect(resolvePrice({ tiers, qty: 5, moq: 12 }).meetsMOQ).toBe(false);
  });
  it('savings calc', () => {
    const r = resolvePrice({ tiers, qty: 12 });
    expect(r.savingsVsRetail).toBe(12500 * 12 - 9800 * 12);
  });
  it('rejects empty tiers and bad qty', () => {
    expect(() => resolvePrice({ tiers: [], qty: 1 })).toThrow();
    expect(() => resolvePrice({ tiers, qty: 0 })).toThrow();
  });
});
