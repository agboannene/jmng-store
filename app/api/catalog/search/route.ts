import { NextRequest, NextResponse } from 'next/server';
// Minimal order-status + search stubs — replace with Prisma in Day 4-10 build.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';
  return NextResponse.json({ q, results: [{ slug: 'zaria-hoops', name: 'Zaria Hoops in 18k Gold Vermeil', price: 12500 }] });
}
