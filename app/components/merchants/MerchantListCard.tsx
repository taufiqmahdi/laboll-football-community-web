import Link from "next/link";
import BrandAvatar from "@/app/components/BrandAvatar";
import { merchantCategoryIcon } from "@/app/components/merchants/categoryIcon";
import { BadgePercent, Instagram, MapPin, Navigation, Phone } from "@/app/components/icons";
import { merchantMapsLink, type Merchant } from "@/app/data/merchants";
import { formatPhone } from "@/app/lib/phone";

// Wide listing card for /merchants: avatar, then details, then actions (stacked under on phones).
export default function MerchantListCard({ merchant: m }: { merchant: Merchant }) {
  const CategoryIcon = merchantCategoryIcon[m.category];

  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md sm:flex-row sm:items-center sm:gap-6 sm:p-5">
      <div className="flex min-w-0 flex-1 items-start gap-4 sm:items-center">
        <BrandAvatar brand={m} size="xl" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="text-lg leading-snug font-bold text-slate-900">{m.name}</h2>
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
              <CategoryIcon className="size-3.5 text-blue-600" />
              {m.category}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
            <BadgePercent className="size-4 shrink-0" />
            {m.perk}
          </p>

          <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />
              <span>{m.address}</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
              <a
                href={`tel:+62${m.phone}`}
                className="flex items-center gap-2 transition hover:text-blue-600"
              >
                <Phone className="size-4 shrink-0 text-slate-400" />
                +62 {formatPhone(m.phone)}
              </a>
              {m.instagram && (
                <a
                  href={`https://www.instagram.com/${m.instagram}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition hover:text-blue-600"
                >
                  <Instagram className="size-4 shrink-0 text-slate-400" />@{m.instagram}
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="flex shrink-0 gap-2 border-t border-slate-100 pt-4 sm:w-36 sm:flex-col sm:border-0 sm:pt-0 md:w-auto md:flex-row">
        <Link
          href={`/merchants/${m.id}`}
          className="flex flex-1 items-center justify-center rounded-full border border-blue-500 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          Detail
          <span className="sr-only"> {m.name}</span>
        </Link>
        <a
          href={merchantMapsLink(m)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-blue-500 bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-blue-600 hover:bg-blue-600"
        >
          <Navigation className="size-4" />
          Maps
          <span className="sr-only"> {m.name} (buka di tab baru)</span>
        </a>
      </div>
    </article>
  );
}
