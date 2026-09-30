import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resolvePrice } from '@/lib/pricing';

const Body = z.object({
  tiers: z.array(z.object({ minQty: z.number(), retailPrice: z.number(), wholesalePrice: z.number(), packId: z.string().nullable().optional() })),
  qty: z.number().int().min(1).max(10000),
  packId: z.string().nullable().optional(),
  wholesaleMin: z.number().optional(),
  moq: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const r = resolvePrice(parsed.data as never);
    return NextResponse.json(r);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
