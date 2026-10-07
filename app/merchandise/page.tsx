import type { Metadata } from "next";
import MerchandiseBrowser from "@/app/components/merchandise/MerchandiseBrowser";
import { parseMerchFilters } from "@/app/lib/merchFilters";

export const metadata: Metadata = {
  title: "Merchandise · Laboll",
  description: "Jersey home, away, third, edisi kolaborasi, sampai hoodie spesial. Member hemat 10% buat semua merchandise.",
};

export default async function MerchandisePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;

  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Merchandise Laboll</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Jersey home, away, third, sampai edisi kolaborasi dan spesial. Member hemat{" "}
          <span className="font-bold text-blue-600">10%</span> buat semua merchandise, lho!
        </p>

        <div className="mt-8">
          <MerchandiseBrowser initialFilters={parseMerchFilters(query)} />
        </div>
      </div>
    </main>
  );
}
