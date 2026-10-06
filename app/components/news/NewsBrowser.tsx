"use client";

import { useEffect, useState } from "react";
import { EmptyState, FilterPill } from "@/app/components/SectionTemplate";
import NewsCard, { categoryIcon } from "@/app/components/news/NewsCard";
import { LayoutGrid } from "@/app/components/icons";
import { news, newsCategories, type NewsCategory } from "@/app/data/news";

export default function NewsBrowser({ initialCategory }: { initialCategory: NewsCategory | null }) {
  const [category, setCategory] = useState(initialCategory);

  // Keep the URL shareable without triggering a server round trip.
  useEffect(() => {
    const query = category ? `?kategori=${encodeURIComponent(category)}` : "";
    window.history.replaceState(null, "", `${window.location.pathname}${query}`);
  }, [category]);

  const results = category ? news.filter((n) => n.category === category) : news;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Kategori berita">
        <FilterPill active={!category} onClick={() => setCategory(null)} icon={<LayoutGrid />}>
          Semua
        </FilterPill>
        {newsCategories.map((c) => {
          const Icon = categoryIcon[c];
          return (
            <FilterPill key={c} active={category === c} onClick={() => setCategory(c)} icon={<Icon />}>
              {c}
            </FilterPill>
          );
        })}
      </div>

      <section aria-live="polite">
        <p className="text-sm text-slate-600">
          <span className="font-bold text-slate-900">{results.length} berita</span>
          {category && <> di kategori {category}</>}
        </p>

        {results.length === 0 ? (
          <EmptyState>Belum ada berita di kategori ini, nih.</EmptyState>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
