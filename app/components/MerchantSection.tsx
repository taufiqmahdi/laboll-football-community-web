"use client";

import { useState } from "react";
import Link from "next/link";
import BrandAvatar from "@/app/components/BrandAvatar";
import {
  EmptyState,
  Section,
  SectionHeading,
  SeeAllLink,
  showFrom,
  type Breakpoint,
} from "@/app/components/SectionTemplate";
import {
  Coffee,
  Handshake,
  LandPlot,
  LayoutGrid,
  Shirt,
  UtensilsCrossed,
  type LucideIcon,
} from "@/app/components/icons";
import { merchantCategories, merchants, type Merchant, type MerchantCategory } from "@/app/data/merchants";

const categoryIcon: Record<MerchantCategory, LucideIcon> = {
  Makanan: UtensilsCrossed,
  Minuman: Coffee,
  "Sport Center": LandPlot,
  Apparel: Shirt,
};

// One row: 3 on phones, 4 on tablets, 6 on desktop.
const ROW: Breakpoint[] = ["base", "base", "base", "sm", "lg", "lg"];

const categoryOptions: { value: MerchantCategory | "all"; label: string; Icon: LucideIcon }[] = [
  { value: "all", label: "Semua", Icon: LayoutGrid },
  ...merchantCategories.map((c) => ({ value: c, label: c, Icon: categoryIcon[c] })),
];

export default function MerchantSection() {
  const [category, setCategory] = useState<MerchantCategory | "all">("all");

  const filtered = merchants.filter((m) => category === "all" || m.category === category);

  return (
    <Section id="merchant" tone="plain">
      <SectionHeading
        Icon={Handshake}
        title="Merchant Partner Kita"
        subtitle="Dari makan, minum, sewa lapangan, sampai bikin jersey tim, semua ada partnernya. Member dapet promo spesial, lho!"
      />

      {/* Category filter */}
      <div className="mt-10 text-center">
        <p className="mb-3 text-sm font-semibold text-slate-500">Lagi butuh apa, nih?</p>
        <div className="flex flex-wrap justify-center gap-2">
          {categoryOptions.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold ring-1 transition sm:px-4 ${
                category === value
                  ? "bg-blue-500 text-white ring-blue-500"
                  : "bg-white text-slate-600 ring-slate-200 hover:text-blue-600 hover:ring-blue-300"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards (one row only) */}
      {filtered.length > 0 ? (
        <div className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-3 sm:gap-4">
          {filtered.slice(0, ROW.length).map((m, i) => (
            <MerchantCard key={m.id} merchant={m} className={showFrom[ROW[i]]} />
          ))}
        </div>
      ) : (
        <EmptyState>Belum ada merchant, nih.</EmptyState>
      )}

      <SeeAllLink
        href="/merchants"
        label="Lihat Semua Merchant"
        note={
          <>
            Ada <span className="font-bold text-blue-600">{merchants.length} merchant partner</span> yang siap dukung
            kamu main!
          </>
        }
      />
    </Section>
  );
}

function MerchantCard({ merchant: m, className }: { merchant: Merchant; className: string }) {
  return (
    <article
      className={`w-[calc(33.333%-8px)] flex-col gap-2 rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md sm:w-[calc(25%-12px)] sm:p-2.5 lg:w-[calc(16.666%-14px)] ${className}`}
    >
      <BrandAvatar brand={m} size="box" />
      <p className="line-clamp-2 flex-1 text-center text-xs leading-snug font-bold text-slate-900 sm:text-sm">{m.name}</p>
      <Link
        href={`/merchants/${m.id}`}
        className="rounded-full border border-blue-500 py-1.5 text-center text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
      >
        Lihat<span className="hidden sm:inline"> Merchant</span>
      </Link>
    </article>
  );
}
