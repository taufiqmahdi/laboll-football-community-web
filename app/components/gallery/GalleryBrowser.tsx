"use client";

import { useEffect, useState } from "react";
import GalleryCard from "@/app/components/gallery/GalleryCard";
import { PillSelect } from "@/app/components/SectionTemplate";
import { Search, SearchX, X } from "@/app/components/icons";
import { galleryItems } from "@/app/data/gallery";
import { communityById } from "@/app/data/schedules";
import { formatDateLong } from "@/app/lib/format";
import { galleryFiltersToQuery, galleryVenues, type GalleryFilters } from "@/app/lib/galleryFilters";
import { slugify } from "@/app/lib/scheduleFilters";

const venueOptions = [
  { value: "all", label: `Semua venue (${galleryItems.length})` },
  ...galleryVenues.map((v) => ({ value: v.slug, label: `${v.venue} (${v.count})` })),
];

// The words a visitor might type: session name, organizer, venue, category, type, and the full date
// (so "agu" or "agustus" both find August).
const searchWords = Object.fromEntries(
  galleryItems.map((g) => [
    g.id,
    [g.title, communityById[g.communityId].name, g.venue, g.category, g.activity, g.kind, formatDateLong(g.date)]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
  ]),
);

// A search term matches the start of a word, so "agu" finds "Agustus" but not "League".
const matches = (id: string, term: string) => searchWords[id].some((w) => w.startsWith(term));

export default function GalleryBrowser({ initialFilters }: { initialFilters: GalleryFilters }) {
  const [query, setQuery] = useState(initialFilters.query);
  const [venue, setVenue] = useState(initialFilters.venue ?? "all");

  // Keep the URL shareable without triggering a server round trip.
  useEffect(() => {
    const filters = { query, venue: venue === "all" ? null : venue };
    window.history.replaceState(null, "", `${window.location.pathname}${galleryFiltersToQuery(filters)}`);
  }, [query, venue]);

  // Every word has to match: "fun kemang" narrows, it doesn't widen.
  const terms = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const results = galleryItems.filter(
    (g) => (venue === "all" || slugify(g.venue) === venue) && terms.every((t) => matches(g.id, t)),
  );
  const filtered = terms.length > 0 || venue !== "all";

  const resetAll = () => {
    setQuery("");
    setVenue("all");
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
            placeholder="Cari nama sesi, komunitas, atau venue..."
            aria-label="Cari dokumentasi"
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

        <PillSelect label="Venue" options={venueOptions} value={venue} onChange={setVenue} />
      </div>

      <section aria-live="polite">
        <p className="text-sm text-slate-600">
          Menampilkan <span className="font-bold text-slate-900">{results.length}</span> dari {galleryItems.length}{" "}
          dokumentasi
          {filtered && results.length > 0 && (
            <>
              {" · "}
              <button type="button" onClick={resetAll} className="font-semibold text-blue-600 hover:underline">
                Reset
              </button>
            </>
          )}
        </p>

        {results.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <SearchX className="size-8 text-slate-300" />
            <p className="mt-3 text-slate-500">Dokumentasi yang kamu cari belum ketemu, nih.</p>
            <button type="button" onClick={resetAll} className="mt-3 text-sm font-semibold text-blue-600 hover:underline">
              Reset pencarian, yuk
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {results.map((g) => (
              <GalleryCard key={g.id} item={g} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
