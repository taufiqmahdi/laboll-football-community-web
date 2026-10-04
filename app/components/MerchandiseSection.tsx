"use client";

import { useState } from "react";
import Link from "next/link";
import {
  EmptyState,
  Section,
  SectionHeading,
  SeeAllLink,
  SegmentedFilter,
  showFrom,
  type Breakpoint,
} from "@/app/components/SectionTemplate";
import { Hourglass, LayoutGrid, PackageCheck, ShoppingBag, type LucideIcon } from "@/app/components/icons";
import { memberPrice, products, type MerchStatus, type Product } from "@/app/data/merchandise";
import { formatRupiah } from "@/app/lib/format";

// 2 cards on phones, 3 on tablets, 4 on desktop.
const ROW: Breakpoint[] = ["base", "base", "md", "lg"];

const statusInfo: Record<MerchStatus, { label: string; Icon: LucideIcon; badge: string }> = {
  ready: { label: "Ready Stock", Icon: PackageCheck, badge: "bg-emerald-500 text-white" },
  preorder: { label: "Pre-order", Icon: Hourglass, badge: "bg-amber-400 text-amber-950" },
};

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
            <ProductCard key={p.id} product={p} className={showFrom[ROW[i]]} />
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

function ProductCard({ product: p, className }: { product: Product; className: string }) {
  const [photo, setPhoto] = useState(0);
  const status = statusInfo[p.status];

  return (
    <article
      className={`w-[calc(50%-8px)] flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] ${className}`}
    >
      {/* Photos */}
      <div className="relative aspect-square bg-slate-100">
        {p.images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${p.name}, foto ${i + 1}`}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${
              i === photo ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <span
          className={`absolute top-2 left-2 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold sm:top-3 sm:left-3 sm:text-xs ${status.badge}`}
        >
          <status.Icon className="size-3.5" />
          {status.label}
        </span>

        {p.images.length > 1 && (
          <div className="absolute inset-x-0 bottom-1 flex justify-center">
            {p.images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPhoto(i)}
                aria-label={`Lihat foto ${i + 1}`}
                aria-pressed={i === photo}
                className="p-1.5"
              >
                <span
                  className={`block h-2 rounded-full shadow ring-1 ring-black/10 transition-all ${
                    i === photo ? "w-5 bg-white" : "w-2 bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <h3 className="leading-snug font-bold text-slate-900 sm:text-lg">{p.name}</h3>

        <div>
          <p className="text-lg font-extrabold text-slate-900 sm:text-xl">{formatRupiah(p.price)}</p>
          <p className="text-xs font-semibold text-blue-600">Member {formatRupiah(memberPrice(p.price))}</p>
        </div>

        <Link
          href={`/merchandise/${p.id}`}
          className="mt-auto rounded-full bg-blue-500 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          {p.preorder ? "Ikut Pre-order" : "Beli Sekarang"}
        </Link>
      </div>
    </article>
  );
}
