"use client";

import { useState } from "react";
import {
  EmptyState,
  Section,
  SectionHeading,
  SeeAllLink,
  SegmentedFilter,
  showFrom,
  type Breakpoint,
} from "@/app/components/SectionTemplate";
import ProductCard, { statusInfo } from "@/app/components/merchandise/ProductCard";
import { LayoutGrid, ShoppingBag, type LucideIcon } from "@/app/components/icons";
import { products, type MerchStatus } from "@/app/data/merchandise";

// 2 cards on phones, 3 on tablets, 4 on desktop.
const ROW: Breakpoint[] = ["base", "base", "md", "lg"];

const statusOptions: { value: MerchStatus | "all"; label: string; Icon: LucideIcon }[] = [
  { value: "all", label: "Semua", Icon: LayoutGrid },
  { value: "ready", ...statusInfo.ready },
  { value: "preorder", ...statusInfo.preorder },
];

export default function MerchandiseSection() {
  const [status, setStatus] = useState<MerchStatus | "all">("all");

  const filtered = products.filter((p) => status === "all" || p.status === status);

  return (
    <Section id="merchandise">
      <SectionHeading
        Icon={ShoppingBag}
        title="Merchandise Laboll"
        subtitle="Jersey home, away, third, sampai edisi kolaborasi dan spesial. Pakai di lapangan, pakai juga buat nongkrong!"
      />

      {/* Status filter */}
      <div className="mt-10 text-center">
        <p className="mb-3 text-sm font-semibold text-slate-500">Mau yang langsung dikirim atau ikut PO?</p>
        <SegmentedFilter options={statusOptions} value={status} onChange={setStatus} />
      </div>

      {/* Cards (one row only): 2 even on phones, like a shop grid */}
      {filtered.length > 0 ? (
        <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-6">
          {filtered.slice(0, ROW.length).map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              className={`w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] ${showFrom[ROW[i]]}`}
            />
          ))}
        </div>
      ) : (
        <EmptyState>Belum ada produk, nih.</EmptyState>
      )}

      <SeeAllLink
        href="/merchandise"
        label="Lihat Semua Merchandise"
        note={
          <>
            Member hemat <span className="font-bold text-blue-600">10%</span> buat semua merchandise, lho!
          </>
        }
      />
    </Section>
  );
}
