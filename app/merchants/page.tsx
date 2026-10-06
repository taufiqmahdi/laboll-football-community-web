import type { Metadata } from "next";
import MerchantBrowser from "@/app/components/merchants/MerchantBrowser";
import { merchantCategories } from "@/app/data/merchants";

export const metadata: Metadata = {
  title: "Merchant Partner · Laboll",
  description: "Tempat makan, minum, sewa lapangan, sampai bikin jersey tim. Member Laboll dapet promo spesial.",
};

export default async function MerchantsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { q, kategori } = await searchParams;

  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Merchant Partner Kita</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Dari makan, minum, sewa lapangan, sampai bikin jersey tim, semua ada partnernya. Tunjukin kartu member buat
          dapet promonya!
        </p>

        <div className="mt-8">
          <MerchantBrowser
            initialQuery={typeof q === "string" ? q : ""}
            initialCategory={merchantCategories.find((c) => c === kategori) ?? null}
          />
        </div>
      </div>
    </main>
  );
}
