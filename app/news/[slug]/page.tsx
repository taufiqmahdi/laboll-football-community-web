import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryIcon } from "@/app/components/news/NewsCard";
import ShareButton from "@/app/components/news/ShareButton";
import { SeeAllLink } from "@/app/components/SectionTemplate";
import { ArrowLeft, CalendarDays, Eye } from "@/app/components/icons";
import { getArticle, news } from "@/app/data/news";
import { getArticleContent } from "@/app/data/newsContent";
import { formatCount, formatDate, formatDateLong } from "@/app/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return { title: `${article.title} · Laboll`, description: article.excerpt };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const href = `/news/${article.slug}`;
  const CategoryIcon = categoryIcon[article.category];

  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      <div className="mx-auto max-w-3xl px-4 pt-6 md:px-8 md:pt-10">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="size-4" />
          Balik ke berita
        </Link>

        <article className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <img src={article.image} alt="" className="aspect-[16/9] w-full object-cover" />

          <div className="p-5 sm:p-8 md:p-10">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <Link
                href={`/news?kategori=${encodeURIComponent(article.category)}`}
                className="flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-600"
              >
                <CategoryIcon className="size-3.5" />
                {article.category}
              </Link>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4 text-slate-400" />
                <time dateTime={article.date}>{formatDate(article.date)}</time>
              </span>
              <span className="flex items-center gap-1.5" title={`${article.views} kali dibaca`}>
                <Eye className="size-4 text-slate-400" />
                {formatCount(article.views)} kali dibaca
              </span>
            </div>

            <h1 className="mt-4 text-2xl leading-tight font-extrabold tracking-tight text-balance text-slate-900 sm:text-4xl">
              {article.title}
            </h1>

            <div
              className="article-content mt-6 sm:mt-8"
              dangerouslySetInnerHTML={{ __html: getArticleContent(article.slug) }}
            />

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Dipublikasikan</p>
                <time dateTime={article.date} className="font-semibold text-slate-900">
                  {formatDateLong(article.date)}
                </time>
              </div>
              <ShareButton title={article.title} path={href} label="Bagikan" />
            </div>
          </div>
        </article>

        <SeeAllLink href="/news" label="Lihat Berita Lainnya" note="Ada kabar baru tiap minggu, jangan lupa mampir, ya!" />
      </div>
    </main>
  );
}
