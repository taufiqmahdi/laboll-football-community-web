import Link from "next/link";
import { Section, SectionHeading, SeeAllLink, SwipeRow } from "@/app/components/SectionTemplate";
import { ArrowRight, Newspaper } from "@/app/components/icons";
import { news, type NewsArticle } from "@/app/data/news";
import { formatDate, formatDayMonth } from "@/app/lib/format";

// Swipe row below lg; from lg up the 3 newest sit in one row.
const cardVisibility = (i: number) => (i < 3 ? "flex" : "flex lg:hidden");

export default function NewsSection() {
  return (
    <Section id="berita" tone="plain">
      <SectionHeading
        Icon={Newspaper}
        title="Kabar dari Lapangan"
        subtitle="Info turnamen, cerita komunitas, sampai tips main. Biar kamu nggak ketinggalan apa-apa!"
      />

      <SwipeRow hint="Geser buat lihat berita lainnya →" count={news.length}>
        {news.map((article, i) => (
          <NewsCard key={article.slug} article={article} className={cardVisibility(i)} />
        ))}
      </SwipeRow>

      <SeeAllLink href="/news" label="Lihat Semua Berita" note="Ada kabar baru tiap minggu, jangan lupa mampir, ya!" />
    </Section>
  );
}

function NewsCard({ article: a, className }: { article: NewsArticle; className: string }) {
  const [day, month] = formatDayMonth(a.date).split(" ");

  return (
    <article
      className={`group relative w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md sm:w-[45%] lg:w-[calc(33.333%-16px)] ${className}`}
    >
      {/* Thumbnail with a calendar-style date tag */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={a.image}
          alt=""
          className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
        />
        <time
          dateTime={a.date}
          title={formatDate(a.date)}
          className="absolute top-3 left-3 flex w-12 flex-col items-center rounded-xl bg-white py-1.5 leading-none shadow-md"
        >
          <span className="text-xl font-black text-slate-900">{day}</span>
          <span className="mt-0.5 text-[11px] font-bold tracking-wide text-blue-600 uppercase">{month}</span>
        </time>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="line-clamp-2 text-lg leading-snug font-bold text-slate-900">{a.title}</h3>
        <p className="mb-2 line-clamp-3 text-sm text-slate-600">{a.excerpt}</p>
        <Link
          href={`/news/${a.slug}`}
          className="mt-auto flex items-center justify-center gap-1.5 rounded-full border border-blue-500 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          Baca Selengkapnya
          <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          <span className="sr-only">: {a.title}</span>
        </Link>
      </div>
    </article>
  );
}
