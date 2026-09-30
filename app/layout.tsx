import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JewelryMallNG — Shine, Verified',
  description: 'Real price. Real stock. Real shine. Retail + wholesale fashion jewelry with WhatsApp concierge.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <body>
        <header className="sticky top-0 z-40 bg-onyx text-ivory">
          <div className="mx-auto max-w-[1200px] px-4 h-16 flex items-center justify-between">
            <a href="/" className="font-display text-xl font-bold">JewelryMall<span className="ml-1 rounded-full bg-gold px-2 py-0.5 text-xs text-onyx">NG</span></a>
            <nav className="hidden md:flex gap-6 text-sm">
              <a href="/shop" className="hover:text-gold">Shop</a>
              <a href="/wholesale" className="hover:text-gold">Wholesale</a>
              <a href="/track" className="hover:text-gold">Track order</a>
            </nav>
            <div className="flex gap-2">
              <a href="/track" className="rounded-full border border-ivory/30 px-4 py-2 text-sm">Track</a>
              <a href="/shop" className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-onyx">Shop now</a>
            </div>
          </div>
        </header>
        <main className="min-h-[70vh]">{children}</main>
        <footer className="bg-onyx text-ivory mt-16">
          <div className="mx-auto max-w-[1200px] px-4 py-10 text-sm flex flex-col md:flex-row justify-between gap-6">
            <p className="font-display text-lg">Shine, Verified.</p>
            <p className="text-ivory/60">Real price • Real stock • WhatsApp support Mon–Sat 9–6</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
