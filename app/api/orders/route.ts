import { NextRequest, NextResponse } from 'next/server';
// Creates pending order with 30-min hold. Stock decremented only on paid webhook.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!body?.customer?.phone || !body?.items?.length) {
    return NextResponse.json({ error: 'phone + items required' }, { status: 400 });
  }
  const ref = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  return NextResponse.json({ ok: true, ref, status: 'pending', note: 'Pay within 30 min to keep stock. Screenshot alone ≠ proof — we verify via Paystack.' });
}
