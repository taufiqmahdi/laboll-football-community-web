import { notFound } from "next/navigation";
import ComingSoon from "@/app/components/ComingSoon";
import { getArticle, news } from "@/app/data/news";
import { formatDate } from "@/app/lib/format";

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <ComingSoon
      title="Artikelnya lagi kita rapihin"
      message="Isi lengkap beritanya bakal muncul di sini. Sabar bentar, ya!"
      backHref="/#berita"
      backLabel="Balik ke berita"
    >
      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-200">
        <img src={article.image} alt="" className="size-16 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0">
          <p className="line-clamp-2 font-bold text-slate-900">{article.title}</p>
          <p className="text-sm text-slate-500">{formatDate(article.date)}</p>
        </div>
      </div>
    </ComingSoon>
  );
}
