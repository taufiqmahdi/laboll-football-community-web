"use client";

import { useEffect, useState } from "react";
import { FilterPill } from "@/app/components/SectionTemplate";
import { merchantCategoryIcon } from "@/app/components/merchants/categoryIcon";
import MerchantListCard from "@/app/components/merchants/MerchantListCard";
import { LayoutGrid, Search, SearchX, X } from "@/app/components/icons";
import { merchantCategories, merchants, type MerchantCategory } from "@/app/data/merchants";

export default function MerchantBrowser({
  initialQuery,
  initialCategory,
}: {
  initialQuery: string;
  initialCategory: MerchantCategory | null;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  // Keep the URL shareable without triggering a server round trip.
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("kategori", category);
    const search = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}`);
  }, [query, category]);

  // Every word has to appear somewhere: "kopi kemang" narrows, it doesn't widen.
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = merchants.filter((m) => {
    if (category && m.category !== category) return false;
    const haystack = [m.name, m.category, m.location, m.address, m.description, m.instagram ?? ""]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });

  const resetAll = () => {
    setQuery("");
    setCategory(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-full bg-white px-5 shadow-sm ring-1 ring-slate-200 transition focus-within:ring-2 focus-within:ring-blue-500">
          <Search className="size-5 shrink-0 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama merchant, menu, atau area..."
            aria-label="Cari merchant"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent py-3.5 text-slate-900 outline-none placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Hapus pencarian"
              className="-mr-2 flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Kategori merchant">
          <FilterPill active={!category} onClick={() => setCategory(null)} icon={<LayoutGrid />}>
            Semua
          </FilterPill>
          {merchantCategories.map((c) => {
            const Icon = merchantCategoryIcon[c];
            return (
              <FilterPill key={c} active={category === c} onClick={() => setCategory(c)} icon={<Icon />}>
                {c}
              </FilterPill>
            );
          })}
        </div>
      </div>

      <section aria-live="polite">
        <p className="text-sm text-slate-600">
          <span className="font-bold text-slate-900">{results.length} merchant</span>
          {category && <> di kategori {category}</>}
          {terms.length > 0 && <> buat &ldquo;{query.trim()}&rdquo;</>}
        </p>

        {results.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <SearchX className="size-8 text-slate-300" />
            <p className="mt-3 text-slate-500">Merchant yang kamu cari belum ketemu, nih.</p>
            <button type="button" onClick={resetAll} className="mt-3 text-sm font-semibold text-blue-600 hover:underline">
              Reset pencarian, yuk
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {results.map((m) => (
              <MerchantListCard key={m.id} merchant={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
