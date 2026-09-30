import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Paystack webhook: verify signature, mark payment verified. Never trust client.
export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY ?? '';
  const raw = await req.text();
  const sig = req.headers.get('x-paystack-signature') ?? '';
  const expected = crypto.createHmac('sha512', secret).update(raw).digest('hex');
  if (sig !== expected) return NextResponse.json({ error: 'bad signature' }, { status: 401 });
  const evt = JSON.parse(raw);
  // TODO: lookup order by evt.data.reference, upsert Payment(providerRef, verified=true), append OrderEvent paid, decrement stock in tx
  return NextResponse.json({ ok: true, event: evt.event });
}
