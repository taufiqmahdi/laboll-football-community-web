import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import BrandAvatar from "@/app/components/BrandAvatar";
import { merchantCategoryIcon } from "@/app/components/merchants/categoryIcon";
import MerchantVoucher from "@/app/components/merchants/MerchantVoucher";
import {
  ArrowLeft,
  Check,
  Clock,
  Info,
  Instagram,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Ticket,
  TikTok,
  type LucideIcon,
} from "@/app/components/icons";
import { getMerchantDetail } from "@/app/data/merchantDetails";
import { getMerchant, merchantMapsLink, merchants } from "@/app/data/merchants";
import { formatPhone } from "@/app/lib/phone";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return merchants.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const merchant = getMerchant(id);
  if (!merchant) return {};
  return { title: `${merchant.name} · Merchant Partner Laboll`, description: merchant.description };
}

export default async function MerchantDetailPage({ params }: Props) {
  const { id } = await params;
  const merchant = getMerchant(id);
  const detail = getMerchantDetail(id);
  if (!merchant || !detail) notFound();

  const CategoryIcon = merchantCategoryIcon[merchant.category];
  const whatsappText = `Halo ${merchant.name}, aku member Laboll. Mau tanya-tanya, dong.`;

  const contacts: { label: string; detail: string; href: string; Icon: LucideIcon; external: boolean }[] = [
    { label: "Telepon", detail: `+62 ${formatPhone(merchant.phone)}`, href: `tel:+62${merchant.phone}`, Icon: Phone, external: false },
    {
      label: "WhatsApp",
      detail: `+62 ${formatPhone(merchant.phone)}`,
      href: `https://wa.me/62${merchant.phone}?text=${encodeURIComponent(whatsappText)}`,
      Icon: MessageCircle,
      external: true,
    },
    ...(merchant.instagram
      ? [
          {
            label: "Instagram",
            detail: `@${merchant.instagram}`,
            href: `https://www.instagram.com/${merchant.instagram}/`,
            Icon: Instagram,
            external: true,
          },
        ]
      : []),
    ...(detail.tiktok
      ? [
          {
            label: "TikTok",
            detail: `@${detail.tiktok}`,
            href: `https://www.tiktok.com/@${detail.tiktok}`,
            Icon: TikTok,
            external: true,
          },
        ]
      : []),
  ];

  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      <div className="mx-auto max-w-3xl px-4 pt-6 md:px-8 md:pt-10">
        <Link
          href="/merchants"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="size-4" />
          Balik ke merchant
        </Link>

        <article className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {/* ---------- Header ---------- */}
          <header>
            <div className="relative h-36 sm:h-52">
              <img src={merchant.image} alt="" className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </div>

            <div className="px-5 pb-6 sm:px-8 sm:pb-8">
              {/* Avatar ring (96 + 8px / 112 + 8px) overlaps the cover by exactly half */}
              <div className="relative -mt-13 w-fit rounded-full bg-white p-1 shadow-md sm:-mt-15">
                <BrandAvatar brand={merchant} size="2xl" />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  {merchant.name}
                </h1>
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  <CategoryIcon className="size-3.5 text-blue-600" />
                  {merchant.category}
                </span>
              </div>
              <p className="mt-1.5 text-slate-600">{merchant.description}</p>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <InfoRow Icon={MapPin}>{merchant.address}</InfoRow>
                <InfoRow Icon={Clock}>{detail.hours}</InfoRow>
              </ul>

              {/* Contacts and socials */}
              <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {contacts.map(({ label, detail: d, href, Icon, external }) => (
                  <a
                    key={label}
                    href={href}
                    title={d}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="flex items-center justify-center gap-2 rounded-full border border-blue-500 px-3 py-2.5 text-sm font-semibold whitespace-nowrap text-blue-600 transition hover:bg-blue-50 sm:px-4"
                  >
                    <Icon className="size-4 shrink-0" />
                    {label}
                    <span className="sr-only">
                      : {d}
                      {external && " (buka di tab baru)"}
                    </span>
                  </a>
                ))}
                <a
                  href={merchantMapsLink(merchant)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 rounded-full border border-blue-500 bg-blue-500 px-3 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition hover:border-blue-600 hover:bg-blue-600 sm:px-4 ${
                    contacts.length % 2 === 0 ? "col-span-2" : ""
                  }`}
                >
                  <Navigation className="size-4 shrink-0" />
                  Maps
                  <span className="sr-only"> {merchant.name} (buka di tab baru)</span>
                </a>
              </div>
            </div>
          </header>

          {/* ---------- About ---------- */}
          <section aria-labelledby="tentang" className="border-t border-slate-100 px-5 py-6 sm:px-8 sm:py-8">
            <SectionTitle id="tentang" Icon={Info}>
              Tentang {merchant.name}
            </SectionTitle>
            <div className="mt-3 space-y-3 leading-relaxed text-slate-700">
              {detail.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Keunggulan">
              {merchant.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                >
                  <Check className="size-4 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </section>

          {/* ---------- Voucher ---------- */}
          <section aria-labelledby="voucher" className="border-t border-slate-100 px-5 py-6 sm:px-8 sm:py-8">
            <SectionTitle id="voucher" Icon={Ticket}>
              Voucher Member
            </SectionTitle>
            <div className="mt-4">
              <MerchantVoucher merchantName={merchant.name} perk={merchant.perk} voucher={detail.voucher} />
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}

function InfoRow({ Icon, children }: { Icon: LucideIcon; children: ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-slate-400" />
      <span>{children}</span>
    </li>
  );
}

function SectionTitle({ id, Icon, children }: { id: string; Icon: LucideIcon; children: ReactNode }) {
  return (
    <h2 id={id} className="flex items-center gap-2 text-lg font-bold text-slate-900">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <Icon className="size-4" />
      </span>
      {children}
    </h2>
  );
}
