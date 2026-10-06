import Link from "next/link";
import ShareButton from "@/app/components/news/ShareButton";
import { ArrowRight, CalendarDays, Clock, Lightbulb, Shirt, Swords, Trophy, Users, type LucideIcon } from "@/app/components/icons";
import type { NewsArticle, NewsCategory } from "@/app/data/news";
import { formatDate } from "@/app/lib/format";

export const categoryIcon: Record<NewsCategory, LucideIcon> = {
  Turnamen: Trophy,
  Komunitas: Users,
  Tips: Lightbulb,
  "Hasil Laga": Swords,
  Merchandise: Shirt,
};

// Grid card for /news.
export default function NewsCard({ article: a }: { article: NewsArticle }) {
  const href = `/news/${a.slug}`;
  const CategoryIcon = categoryIcon[a.category];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      {/* Thumbnail */}
      <Link href={href} tabIndex={-1} aria-hidden className="relative aspect-[16/10] overflow-hidden">
        <img
          src={a.image}
          alt=""
          className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
          <CategoryIcon className="size-3.5" />
          {a.category}
        </span>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5 text-slate-400" />
            <time dateTime={a.date}>{formatDate(a.date)}</time>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5 text-slate-400" />
            {a.readMinutes} menit baca
          </span>
        </p>
        <h2 className="line-clamp-2 text-lg leading-snug font-bold text-slate-900">
          <Link href={href} className="transition hover:text-blue-600">
            {a.title}
          </Link>
        </h2>
        <p className="mb-2 line-clamp-3 text-sm text-slate-600">{a.excerpt}</p>

        <div className="mt-auto flex items-center gap-2">
          <Link
            href={href}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-blue-500 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Baca Selengkapnya
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            <span className="sr-only">: {a.title}</span>
          </Link>
          <ShareButton title={a.title} path={href} />
        </div>
      </div>
    </article>
  );
}
