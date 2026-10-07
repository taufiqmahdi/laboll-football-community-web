"use client";

import { useEffect, useState } from "react";
import { EmptyState, PillSelect, SegmentedFilter } from "@/app/components/SectionTemplate";
import ProductCard, { statusInfo } from "@/app/components/merchandise/ProductCard";
import { LayoutGrid, type LucideIcon } from "@/app/components/icons";
import { products, type MerchStatus } from "@/app/data/merchandise";
import { merchFiltersToQuery, sortOptions, type MerchFilters } from "@/app/lib/merchFilters";

const statusOptions: { value: MerchStatus | "all"; label: string; Icon: LucideIcon }[] = [
  { value: "all", label: "Semua", Icon: LayoutGrid },
  { value: "ready", ...statusInfo.ready },
  { value: "preorder", ...statusInfo.preorder },
];

export default function MerchandiseBrowser({ initialFilters }: { initialFilters: MerchFilters }) {
  const [status, setStatus] = useState(initialFilters.status);
  const [sort, setSort] = useState(initialFilters.sort);

  // Keep the URL shareable without triggering a server round trip.
  useEffect(() => {
    window.history.replaceState(null, "", `${window.location.pathname}${merchFiltersToQuery({ status, sort })}`);
  }, [status, sort]);

  const filtered = products.filter((p) => status === "all" || p.status === status);
  // "Rekomendasi" is the curated data order (the same one the homepage shows).
  const results =
    sort === "rekomendasi" ? filtered : [...filtered].sort((a, b) => (sort === "termurah" ? a.price - b.price : b.price - a.price));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <SegmentedFilter options={statusOptions} value={status} onChange={setStatus} />

        <PillSelect label="Urutkan" options={sortOptions} value={sort} onChange={setSort} />
      </div>

      <section aria-live="polite">
        <p className="text-sm text-slate-600">
          <span className="font-bold text-slate-900">{results.length} produk</span>
          {status !== "all" && <> {statusInfo[status].label.toLowerCase()}</>}
        </p>

        {results.length === 0 ? (
          <EmptyState>Belum ada produk, nih.</EmptyState>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} className="flex" showPreorderInfo />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
