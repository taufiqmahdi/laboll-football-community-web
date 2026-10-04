import { notFound } from "next/navigation";
import BrandAvatar from "@/app/components/BrandAvatar";
import ComingSoon from "@/app/components/ComingSoon";
import { getMerchant, merchants } from "@/app/data/merchants";

export function generateStaticParams() {
  return merchants.map((m) => ({ id: m.id }));
}

export default async function MerchantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const merchant = getMerchant(id);
  if (!merchant) notFound();

  return (
    <ComingSoon
      title="Halaman merchant lagi kita siapin"
      message="Menu, promo, dan info lengkapnya bakal muncul di sini. Sabar bentar, ya!"
      backHref="/#merchant"
      backLabel="Balik ke merchant"
    >
      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200">
        <BrandAvatar brand={merchant} size="md" />
        <div className="min-w-0">
          <p className="font-bold text-slate-900">{merchant.name}</p>
          <p className="text-sm text-slate-600">
            {merchant.category} · {merchant.perk}
          </p>
          <p className="truncate text-sm text-slate-500">{merchant.location}</p>
        </div>
      </div>
    </ComingSoon>
  );
}
