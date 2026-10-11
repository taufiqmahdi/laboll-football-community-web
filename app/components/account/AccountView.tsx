"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useAuth } from "@/app/components/auth/AuthProvider";
import OrderHistoryCard from "@/app/components/account/OrderHistoryCard";
import { FilterPill, PillSelect } from "@/app/components/SectionTemplate";
import {
  BadgeCheck,
  CalendarX,
  CircleCheck,
  Crown,
  Hourglass,
  LayoutGrid,
  LoaderCircle,
  LogOut,
  Mail,
  Phone,
  ReceiptText,
  SearchX,
  UserRound,
  type LucideIcon,
} from "@/app/components/icons";
import { formatDateLong, formatRupiah } from "@/app/lib/format";
import { orderStatus, ordersFor, subscribe, type Order, type OrderStatus } from "@/app/lib/orders";
import { formatPhone } from "@/app/lib/phone";
import { useNow } from "@/app/lib/useNow";

type StatusFilter = OrderStatus | "all";
type KindFilter = Order["kind"] | "all";

const kindOptions: { value: KindFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "jadwal", label: "Jadwal" },
  { value: "turnamen", label: "Turnamen" },
  { value: "member", label: "Membership" },
];

const noOrders: Order[] = [];

// formatRupiah shows 0 as "Gratis!" (right for a free GK slot); a running total of nothing is just "Rp 0".
const money = (amount: number) => (amount === 0 ? "Rp 0" : formatRupiah(amount));

export default function AccountView() {
  const { user, openAuth, logout } = useAuth();
  const now = useNow(); // null until the browser has taken over: accounts and orders only live there
  const orders = useSyncExternalStore(subscribe, () => (user ? ordersFor(user.email) : noOrders), () => noOrders);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [kind, setKind] = useState<KindFilter>("all");

  if (now === null) {
    return (
      <p className="flex items-center justify-center gap-2 py-24 text-slate-500" role="status">
        <LoaderCircle className="size-5 animate-spin" />
        Lagi buka akun kamu...
      </p>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-lg rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 sm:p-8">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <UserRound className="size-7" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-slate-900">Masuk dulu, ya</h2>
        <p className="mt-1 text-slate-600">Riwayat booking, pendaftaran turnamen, dan membership kamu ada di sini.</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="rounded-full border border-blue-500 bg-blue-500 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => openAuth("register")}
            className="rounded-full border border-blue-500 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Daftar
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Booking tanpa akun?{" "}
          <Link href="/#cek-pembayaran" className="font-semibold text-blue-600 hover:underline">
            Cek pakai booking ID
          </Link>
        </p>
      </section>
    );
  }

  const withStatus = orders.map((o) => ({ order: o, status: orderStatus(o, now) }));
  const count = (s: OrderStatus) => withStatus.filter((x) => x.status === s).length;
  const paid = withStatus.filter((x) => x.status === "paid").map((x) => x.order);
  const totalPaid = paid.reduce((sum, o) => sum + o.total, 0);
  const memberSavings = paid
    .flatMap((o) => o.lines)
    .filter((l) => l.label.startsWith("Diskon member"))
    .reduce((sum, l) => sum - l.amount, 0);

  const statusOptions: { value: StatusFilter; label: string; Icon: LucideIcon }[] = [
    { value: "all", label: `Semua ${orders.length}`, Icon: LayoutGrid },
    { value: "pending", label: `Belum bayar ${count("pending")}`, Icon: Hourglass },
    { value: "paid", label: `Lunas ${count("paid")}`, Icon: CircleCheck },
    { value: "expired", label: `Lewat ${count("expired")}`, Icon: CalendarX },
  ];

  const results = withStatus.filter(
    (x) => (status === "all" || x.status === status) && (kind === "all" || x.order.kind === kind),
  );
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-8">
      {/* ---------- Profile ---------- */}
      <section className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:p-6">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
          <ul className="mt-1 flex flex-col gap-x-5 gap-y-1 text-sm text-slate-600 sm:flex-row sm:flex-wrap">
            <li className="flex min-w-0 items-center gap-1.5">
              <Mail className="size-4 shrink-0 text-slate-400" />
              <span className="truncate">{user.email}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Phone className="size-4 shrink-0 text-slate-400" />
              +62 {formatPhone(user.phone)}
            </li>
          </ul>
          {user.isMember && user.membership ? (
            <Link
              href="/member"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 transition hover:bg-amber-200"
            >
              <BadgeCheck className="size-4" />
              Member aktif s/d {formatDateLong(user.membership.until)}
            </Link>
          ) : (
            <Link
              href="/member"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
            >
              <Crown className="size-4" />
              {user.membership ? "Membership berakhir · Aktifin lagi" : "Belum member · Gabung, hemat 10%"}
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center justify-center gap-2 self-start rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-600 sm:self-center"
        >
          <LogOut className="size-4" />
          Keluar
        </button>
      </section>

      {/* ---------- Summary ---------- */}
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Lunas" value={String(count("paid"))} />
        <Stat label="Belum dibayar" value={String(count("pending"))} highlight={count("pending") > 0} />
        <Stat label="Total dibayar" value={money(totalPaid)} wide />
        <Stat label="Hemat diskon member" value={money(memberSavings)} wide />
      </dl>

      {/* ---------- History ---------- */}
      <section aria-labelledby="riwayat">
        <h2 id="riwayat" className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <ReceiptText className="size-5 text-blue-600" />
          Riwayat booking
        </h2>

        {orders.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-600">Belum ada booking dari akun ini.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link href="/schedule" className="rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600">
                Cari Jadwal
              </Link>
              <Link
                href="/tournament"
                className="rounded-full border border-blue-500 px-5 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
              >
                Lihat Turnamen
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-500">Booking yang dibuat tanpa masuk akun nggak muncul di sini.</p>
          </div>
        ) : (
          <>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              {/* Wrapping pills (not a segmented control): the labels carry counts and must fit a 320px phone */}
              <div className="flex flex-wrap gap-2" role="group" aria-label="Status pembayaran">
                {statusOptions.map(({ value, label, Icon }) => (
                  <FilterPill key={value} active={status === value} onClick={() => setStatus(value)} icon={<Icon />}>
                    {label}
                  </FilterPill>
                ))}
              </div>
              <PillSelect label="Jenis" options={kindOptions} value={kind} onChange={setKind} />
            </div>

            {results.length === 0 ? (
              <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <SearchX className="size-8 text-slate-300" />
                <p className="mt-3 text-slate-500">Nggak ada booking yang cocok sama filter ini.</p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("all");
                    setKind("all");
                  }}
                  className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Tampilkan semua
                </button>
              </div>
            ) : (
              <ol className="mt-4 flex flex-col gap-4" aria-live="polite">
                {results.map(({ order, status: s }) => (
                  <li key={order.id}>
                    <OrderHistoryCard order={order} status={s} now={now} />
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-4 text-xs text-slate-500">
              Booking yang dibuat tanpa masuk akun nggak muncul di sini.{" "}
              <Link href="/#cek-pembayaran" className="font-semibold text-blue-600 hover:underline">
                Cek pakai booking ID
              </Link>
            </p>
          </>
        )}
      </section>
    </div>
  );
}

// `wide` gives money figures a full row on phones, so long amounts never wrap.
function Stat({ label, value, highlight, wide }: { label: string; value: string; highlight?: boolean; wide?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-4 shadow-sm ring-1 ${wide ? "col-span-2 sm:col-span-1" : ""} ${
        highlight ? "bg-amber-50 ring-amber-200" : "bg-white ring-slate-200"
      }`}
    >
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-extrabold text-slate-900 tabular-nums sm:text-xl">{value}</dd>
    </div>
  );
}
