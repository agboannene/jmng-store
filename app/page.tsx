import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-[1200px] px-4 pt-12 pb-8 text-center">
        <p className="inline-block rounded-full bg-emerald-tint text-emerald px-3 py-1 text-xs font-semibold">✓ Verified stock &amp; prices</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-4">Real Price. Real Stock.<br />Real Shine.</h1>
        <p className="mt-4 text-stone-muted max-w-xl mx-auto">Retail sparkle + wholesale muscle. See tier prices upfront, pay verified, track on WhatsApp.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/shop" className="rounded-full bg-gold px-6 py-3 font-semibold text-onyx min-h-[48px]">Shop bestsellers</Link>
          <Link href="/wholesale" className="rounded-full border border-onyx px-6 py-3 min-h-[48px]">Wholesale (12+ pcs)</Link>
        </div>
      </section>
      <section className="mx-auto max-w-[1200px] px-4 grid grid-cols-2 md:grid-cols-4 gap-4 pb-16">
        {['Zaria Hoops', 'Aso-Ebi Set', 'Lagos Chain', 'Detty Stack'].map(n => (
          <a key={n} href="/shop" className="rounded-lg bg-white shadow-card overflow-hidden">
            <div className="aspect-[4/5] bg-ivory-deep" />
            <div className="p-3">
              <p className="text-sm font-medium line-clamp-2">{n} in 18k Gold Vermeil</p>
              <p className="price mt-1">₦12,500 <span className="text-xs font-normal text-emerald">12+ at ₦10,800</span></p>
            </div>
          </a>
        ))}
      </section>
    </div>
  );
}
