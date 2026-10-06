import type { Metadata } from "next";
import NewsBrowser from "@/app/components/news/NewsBrowser";
import { newsCategories } from "@/app/data/news";

export const metadata: Metadata = {
  title: "Kabar dari Lapangan · Laboll",
  description: "Info turnamen, cerita komunitas, tips main, sampai rilis merchandise terbaru dari Laboll.",
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { kategori } = await searchParams;
  const initialCategory = newsCategories.find((c) => c === kategori) ?? null;

  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Kabar dari Lapangan</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Info turnamen, cerita komunitas, sampai tips main. Biar kamu nggak ketinggalan apa-apa!
        </p>

        <div className="mt-8">
          <NewsBrowser initialCategory={initialCategory} />
        </div>
      </div>
    </main>
  );
}
