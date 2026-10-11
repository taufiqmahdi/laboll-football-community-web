import type { Metadata } from "next";
import Link from "next/link";
import MemberCard from "@/app/components/member/MemberCard";
import MemberCta from "@/app/components/member/MemberCta";
import SavingsCalculator from "@/app/components/member/SavingsCalculator";
import {
  ArrowRight,
  BadgeCheck,
  BadgePercent,
  ChevronDown,
  Crown,
  Lock,
  ShoppingBag,
  Ticket,
  UserRound,
  type LucideIcon,
} from "@/app/components/icons";
import { MEMBER_DISCOUNT as MERCH_DISCOUNT } from "@/app/data/merchandise";
import { merchants } from "@/app/data/merchants";
import { schedules } from "@/app/data/schedules";
import { formatRupiah } from "@/app/lib/format";
import { MEMBERSHIP_PRICE } from "@/app/lib/membership";
import { MEMBER_DISCOUNT as MATCH_DISCOUNT } from "@/app/lib/pricing";

export const metadata: Metadata = {
  title: "Member Laboll",
  description: `Cuma ${formatRupiah(MEMBERSHIP_PRICE)} setahun: diskon ${MATCH_DISCOUNT * 100}% tiap booking, diskon merchandise, dan voucher di merchant partner.`,
};

const pct = (n: number) => `${Math.round(n * 100)}%`;
const averageFee = Math.round(schedules.reduce((sum, s) => sum + s.playerFee, 0) / schedules.length / 1000) * 1000;

// Every benefit here is something the site actually applies today.
const benefits: { Icon: LucideIcon; title: string; body: string; link?: { href: string; label: string } }[] = [
  {
    Icon: BadgePercent,
    title: `Diskon ${pct(MATCH_DISCOUNT)} tiap booking`,
    body: "Kepasang otomatis di semua jadwal, buat semua slot dalam satu booking. Masih bisa digabung sama voucher.",
    link: { href: "/schedule", label: "Cari jadwal" },
  },
  {
    Icon: ShoppingBag,
    title: `Diskon ${pct(MERCH_DISCOUNT)} merchandise`,
    body: "Harga member langsung muncul di semua jersey, hoodie, sampai training tee.",
    link: { href: "/merchandise", label: "Lihat merchandise" },
  },
  {
    Icon: Ticket,
    title: `Voucher di ${merchants.length} merchant partner`,
    body: "Kode voucher kebuka di halaman tiap merchant: makan, minum, sewa lapangan, sampai bikin jersey.",
    link: { href: "/merchants", label: "Lihat merchant" },
  },
  {
    Icon: BadgeCheck,
    title: "Kartu member digital",
    body: "Ada nama dan member ID kamu. Tunjukin ke kasir merchant partner pas pakai voucher.",
  },
];

const steps: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: UserRound, title: "Masuk atau daftar", body: "Pakai akun Laboll kamu. Belum punya? Bikin cuma semenit." },
  { Icon: Lock, title: `Bayar ${formatRupiah(MEMBERSHIP_PRICE)}`, body: "Pakai QRIS, virtual account, atau e-wallet." },
  { Icon: Crown, title: "Langsung aktif", body: "Semua benefit nyala setahun penuh sejak pembayaran masuk." },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "Berapa lama membership berlaku?",
    a: "Setahun penuh sejak pembayaran masuk. Kalau kamu perpanjang sebelum habis, tambahan setahunnya dihitung dari tanggal berakhir, jadi nggak ada hari yang kebuang.",
  },
  {
    q: "Diskonnya berlaku buat teman yang aku booking-in juga?",
    a: `Iya. Diskon ${pct(MATCH_DISCOUNT)} dihitung dari total semua slot dalam satu booking, asal booking-nya pakai akun member.`,
  },
  {
    q: "Bisa digabung sama kode voucher?",
    a: "Bisa. Diskon member dipotong duluan, terus voucher dihitung dari harga setelah diskon member.",
  },
  {
    q: "Diskon member berlaku buat daftar turnamen?",
    a: "Belum. Diskon member cuma buat booking jadwal dan merchandise. Biaya daftar turnamen tetap harga normal.",
  },
  {
    q: "Bayarnya pakai apa aja?",
    a: "QRIS, virtual account (BCA, Mandiri, BNI, BRI), atau e-wallet (GoPay, OVO, DANA, ShopeePay). Semuanya tanpa biaya tambahan.",
  },
  {
    q: "Gimana kalau membership-ku habis?",
    a: "Benefitnya berhenti sehari setelah tanggal berakhir. Kamu bisa aktifin lagi kapan aja dari halaman ini, member ID-nya tetap sama.",
  },
];

export default function MemberPage() {
  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      {/* ---------- Hero ---------- */}
      <section className="bg-blue-600 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_60%)] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:px-8 md:py-16 lg:grid-cols-[1fr_24rem] lg:gap-16">
          <div>
            <p className="flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold ring-1 ring-white/25">
              <Crown className="size-4" />
              Member Laboll
            </p>
            <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
              Main lebih hemat, setahun penuh
            </h1>
            <p className="mt-3 max-w-xl text-lg text-blue-100">
              Diskon tiap booking, harga member di merchandise, dan voucher di {merchants.length} merchant partner.
            </p>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold">{formatRupiah(MEMBERSHIP_PRICE)}</span>
              <span className="text-blue-100">/ tahun</span>
            </p>
            <div className="mt-6">
              <MemberCta />
            </div>
          </div>
          <MemberCard />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* ---------- Benefits ---------- */}
        <section aria-labelledby="benefit" className="mt-12 md:mt-16">
          <h2 id="benefit" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Yang kamu dapet
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ Icon, title, body, link }) => (
              <li key={title} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <span className="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
                <p className="mt-1 flex-1 text-sm text-slate-600">{body}</p>
                {link && (
                  <Link
                    href={link.href}
                    className="mt-4 flex w-fit items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                  >
                    {link.label}
                    <ArrowRight className="size-4" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Savings ---------- */}
        <section aria-labelledby="hitung" className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-[20rem_1fr] lg:items-start lg:gap-10">
          <div>
            <h2 id="hitung" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Hitung hematnya
            </h2>
            <p className="mt-2 text-slate-600">
              Geser sesuai seberapa sering kamu main. Diskon booking aja udah cukup buat balik modal kalau rutin main.
            </p>
          </div>
          <SavingsCalculator averageFee={averageFee} discount={MATCH_DISCOUNT} />
        </section>

        {/* ---------- How it works ---------- */}
        <section aria-labelledby="cara" className="mt-12 md:mt-16">
          <h2 id="cara" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Cara gabung
          </h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map(({ Icon, title, body }, i) => (
              <li key={title} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Langkah {i + 1}</p>
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="mt-0.5 text-sm text-slate-600">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- FAQ ---------- */}
        <section aria-labelledby="faq" className="mt-12 md:mt-16">
          <h2 id="faq" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Pertanyaan yang sering muncul
          </h2>
          <div className="mt-6 divide-y divide-slate-200 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group px-5 py-4 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown className="size-5 shrink-0 text-slate-400 transition group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ---------- Closing CTA ---------- */}
        <section className="mt-12 rounded-3xl bg-blue-600 p-6 text-white sm:p-10 md:mt-16">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Siap main lebih hemat?</h2>
          <p className="mt-2 text-blue-100">Sekali bayar {formatRupiah(MEMBERSHIP_PRICE)}, benefitnya kepake setahun.</p>
          <div className="mt-6">
            <MemberCta />
          </div>
        </section>
      </div>
    </main>
  );
}
