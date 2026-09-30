import { NextRequest, NextResponse } from 'next/server';

// Meta WhatsApp Cloud API webhook: GET verify + POST incoming.
// Guardrails: tool-only answers, handoff on complaint/refund/low-confidence/human request.
export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const mode = u.searchParams.get('hub.mode');
  const token = u.searchParams.get('hub.verify_token');
  const challenge = u.searchParams.get('hub.challenge');
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? '', { status: 200 });
  }
  return NextResponse.json({ error: 'forbidden' }, { status: 403 });
}

const HANDOFF = [/human/i, /agent/i, /complaint/i, /refund/i, /dispute/i, /not delivered/i];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const msg = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const text: string = msg?.text?.body ?? '';
  const from: string = msg?.from ?? 'unknown';
  const needsHandoff = HANDOFF.some(r => r.test(text));
  // TODO: persist Conversation/Message, call searchCatalog/getPrice/getStock tools, send via Graph API
  return NextResponse.json({ ok: true, from, needsHandoff, reply: needsHandoff ? 'Bringing in our team — they have this chat, no need to repeat.' : 'Seen! Replying from our approved catalogue…' });
}
