"use client";

import Link from "next/link";
import CopyButton from "@/app/components/payment/CopyButton";
import {
  CalendarDays,
  CalendarX,
  CircleCheck,
  CircleX,
  Crown,
  Hourglass,
  MapPin,
  Trophy,
  type LucideIcon,
} from "@/app/components/icons";
import { formatCountdown, formatRupiah, formatTimestamp } from "@/app/lib/format";
import { orderCopy } from "@/app/lib/orderCopy";
import { getMethod, type Order, type OrderStatus } from "@/app/lib/orders";

const kindIcon: Record<Order["kind"], LucideIcon> = { jadwal: CalendarDays, turnamen: Trophy, member: Crown };

const statusPill: Record<OrderStatus, { label: string; Icon: LucideIcon; tone: string }> = {
  paid: { label: "Lunas", Icon: CircleCheck, tone: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  pending: { label: "Menunggu bayar", Icon: Hourglass, tone: "bg-amber-50 text-amber-800 ring-amber-200" },
  expired: { label: "Kedaluwarsa", Icon: CalendarX, tone: "bg-slate-100 text-slate-600 ring-slate-200" },
};

const primary =
  "flex items-center justify-center rounded-full border border-blue-500 bg-blue-500 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white transition hover:border-blue-600 hover:bg-blue-600";
const secondary =
  "flex items-center justify-center rounded-full border border-blue-500 px-4 py-2 text-sm font-semibold whitespace-nowrap text-blue-600 transition hover:bg-blue-50";

// One order in the account history: what it was, where it stands, and the sensible next step.
export default function OrderHistoryCard({ order: o, status, now }: { order: Order; status: OrderStatus; now: number }) {
  const copy = orderCopy(o);
  const KindIcon = kindIcon[o.kind];
  const pill = statusPill[status];
  const failed = status === "pending" && o.payment.step === "failed";

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <KindIcon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
            <p className="text-xs text-slate-500">
              {copy.label} · {formatTimestamp(o.createdAt)}
            </p>
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${pill.tone}`}>
              <pill.Icon className="size-3.5" />
              {pill.label}
            </span>
          </div>
          <h3 className="mt-1 leading-snug font-bold text-slate-900">{o.title}</h3>
          <p className="text-sm text-slate-600">{o.subtitle}</p>
          {o.location && (
            <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-500">
              <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />
              {o.location}
            </p>
          )}

          {/* Payment detail lives here, not in the action row, so it never squeezes the buttons */}
          <p
            className={`mt-2 flex items-start gap-1.5 text-sm ${
              status === "paid" ? "text-slate-600" : status === "expired" ? "text-slate-500" : failed ? "text-red-600" : "text-amber-700"
            }`}
          >
            {status === "paid" ? (
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            ) : status === "expired" ? (
              <CalendarX className="mt-0.5 size-4 shrink-0 text-slate-400" />
            ) : failed ? (
              <CircleX className="mt-0.5 size-4 shrink-0" />
            ) : (
              <Hourglass className="mt-0.5 size-4 shrink-0" />
            )}
            <span>
              {o.payment.step === "paid" ? (
                <>
                  Dibayar via {getMethod(o.payment.method).label} · {formatTimestamp(o.payment.paidAt)}
                </>
              ) : status === "pending" ? (
                <>
                  {failed && "Pembayaran terakhir gagal · "}
                  Bayar dalam{" "}
                  <span className="font-mono font-semibold tabular-nums">{formatCountdown(o.expiresAt - now)}</span>
                </>
              ) : (
                <>Lewat batas bayar {formatTimestamp(o.expiresAt)}</>
              )}
            </span>
          </p>
        </div>
      </div>

      {/* ID + total on the left, actions on the right; on phones the actions go full width underneath */}
      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 md:flex-row md:items-center md:justify-between">
        <dl className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <dt className="sr-only">Booking ID</dt>
            <dd className="font-mono font-semibold tracking-wide text-slate-900">{o.id}</dd>
            <CopyButton value={o.id} label="booking ID" />
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="text-slate-500">Total</dt>
            <dd className="font-bold text-slate-900">{formatRupiah(o.total)}</dd>
          </div>
        </dl>

        <div className="grid gap-2 sm:flex sm:shrink-0 sm:justify-end">
          {status === "pending" && (
            <Link href={`/payment?booking=${o.id}`} className={primary}>
              {failed ? "Coba Bayar Lagi" : "Bayar Sekarang"}
            </Link>
          )}
          {status === "paid" && (
            <>
              <Link href={`/payment?booking=${o.id}`} className={secondary}>
                Lihat Bukti
              </Link>
              <Link href={copy.afterPaid.href} className={primary}>
                {copy.afterPaid.label}
              </Link>
            </>
          )}
          {status === "expired" && (
            <Link href={copy.retry.href} className={secondary}>
              {copy.retry.label}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
