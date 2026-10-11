"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import AwaitingPayment from "@/app/components/payment/AwaitingPayment";
import CopyButton from "@/app/components/payment/CopyButton";
import MethodPicker from "@/app/components/payment/MethodPicker";
import {
  CalendarX,
  Check,
  CircleCheck,
  CircleX,
  LoaderCircle,
  MapPin,
  MessageCircle,
  RotateCcw,
  SearchX,
  Timer,
  type LucideIcon,
} from "@/app/components/icons";
import { whatsappLink } from "@/app/data/site";
import { formatCountdown, formatRupiah, formatTimestamp } from "@/app/lib/format";
import { orderCopy } from "@/app/lib/orderCopy";
import { changeMethod, getMethod, getOrder, orderStatus, subscribe, type Order } from "@/app/lib/orders";
import { useNow } from "@/app/lib/useNow";

const noOrder = () => undefined; // server render: we can't know yet (orders live in the browser)

export default function PaymentFlow({ id }: { id: string }) {
  const order = useSyncExternalStore(subscribe, () => getOrder(id), noOrder);
  const now = useNow();

  if (order === undefined || now === null) {
    return (
      <p className="flex items-center justify-center gap-2 py-24 text-slate-500" role="status">
        <LoaderCircle className="size-5 animate-spin" />
        Lagi buka pesanan kamu...
      </p>
    );
  }
  if (order === null) return <NotFound id={id} />;

  const status = orderStatus(order, now);
  const step = status === "paid" ? 3 : status === "expired" ? 0 : order.payment.step === "choose" ? 1 : 2;

  return (
    <div>
      <Stepper current={step} expired={status === "expired"} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        {/* Summary first on phones so the total and deadline are visible right away */}
        <aside className="lg:sticky lg:top-28 lg:order-2">
          <OrderSummary order={order} now={now} />
        </aside>
        <div className="min-w-0 lg:order-1">
          {status === "paid" ? (
            <PaymentSuccess order={order} />
          ) : status === "expired" ? (
            <PaymentExpired order={order} />
          ) : order.payment.step === "awaiting" ? (
            <AwaitingPayment order={order} method={order.payment.method} />
          ) : order.payment.step === "failed" ? (
            <PaymentFailed order={order} />
          ) : (
            <MethodPicker order={order} />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Progress ----------

function Stepper({ current, expired }: { current: number; expired: boolean }) {
  const steps = ["Pilih metode", "Bayar", "Selesai"];
  return (
    <ol className="flex items-center gap-2 text-xs font-semibold sm:text-sm" aria-label="Langkah pembayaran">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = !expired && n < current;
        const active = !expired && n === current;
        return (
          <li key={label} className="flex min-w-0 flex-1 items-center gap-2" aria-current={active ? "step" : undefined}>
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                done || (active && n === 3)
                  ? "bg-emerald-500 text-white"
                  : active
                    ? "bg-blue-500 text-white"
                    : "bg-slate-200 text-slate-500"
              }`}
            >
              {done || (active && n === 3) ? <Check className="size-4" /> : n}
            </span>
            {/* Phones show only the current step's label; the rest stay readable to screen readers. */}
            <span className={`truncate ${active ? "text-slate-900" : "sr-only text-slate-500 sm:not-sr-only"}`}>{label}</span>
            {n < steps.length && <span aria-hidden className={`h-0.5 min-w-3 flex-1 rounded ${done ? "bg-emerald-500" : "bg-slate-200"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

// ---------- Summary ----------

function OrderSummary({ order: o, now }: { order: Order; now: number }) {
  const status = orderStatus(o, now);
  const left = o.expiresAt - now;

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Booking ID</p>
            <p className="font-mono text-lg font-bold tracking-wider text-slate-900">{o.id}</p>
          </div>
          <CopyButton value={o.id} label="booking ID" />
        </div>
      </div>

      <div className="border-b border-slate-100 p-5">
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          {orderCopy(o).label}
        </p>
        <p className="mt-1 leading-snug font-bold text-slate-900">{o.title}</p>
        <p className="mt-0.5 text-sm text-slate-600">{o.subtitle}</p>
        {o.location && (
          <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-600">
            <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />
            {o.location}
          </p>
        )}
      </div>

      <div className="p-5">
        <dl className="space-y-2 text-sm">
          {o.lines.map((line) => (
            <div key={line.label} className="flex justify-between gap-4">
              <dt className="text-slate-600">{line.label}</dt>
              <dd className={`font-semibold ${line.amount < 0 ? "text-emerald-600" : "text-slate-900"}`}>
                {line.amount < 0 ? `− ${formatRupiah(-line.amount)}` : formatRupiah(line.amount)}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-slate-200 pt-4">
          <span className="font-semibold text-slate-900">Total</span>
          <span className="text-2xl font-extrabold text-slate-900">{formatRupiah(o.total)}</span>
        </div>

        {status === "pending" && (
          <p
            className={`mt-4 flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
              left < 5 * 60 * 1000 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"
            }`}
          >
            <span className="flex items-center gap-2">
              <Timer className="size-4" />
              Bayar dalam
            </span>
            <span className="font-mono tabular-nums" role="timer" aria-label={`Sisa waktu ${formatCountdown(left)}`}>
              {formatCountdown(left)}
            </span>
          </p>
        )}
        {status === "paid" && <StatusPill Icon={CircleCheck} tone="bg-emerald-50 text-emerald-700" text="Lunas" />}
        {status === "expired" && <StatusPill Icon={CalendarX} tone="bg-red-50 text-red-700" text="Kedaluwarsa" />}
      </div>
    </div>
  );
}

function StatusPill({ Icon, tone, text }: { Icon: LucideIcon; tone: string; text: string }) {
  return (
    <p className={`mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${tone}`}>
      <Icon className="size-4" />
      {text}
    </p>
  );
}

// ---------- Outcomes ----------

function Outcome({
  Icon,
  tone,
  title,
  message,
  children,
}: {
  Icon: LucideIcon;
  tone: string;
  title: string;
  message: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <span className={`flex size-16 items-center justify-center rounded-full ${tone}`}>
          <Icon className="size-8" />
        </span>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900">{title}</h2>
        <p className="mt-1 max-w-md text-slate-600">{message}</p>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

const primaryBtn =
  "flex flex-1 items-center justify-center gap-2 rounded-full border border-blue-500 bg-blue-500 py-3 text-sm font-semibold text-white transition hover:border-blue-600 hover:bg-blue-600";
const secondaryBtn =
  "flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-300 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600";

function PaymentSuccess({ order: o }: { order: Order }) {
  if (o.payment.step !== "paid") return null;
  const copy = orderCopy(o);

  return (
    <Outcome Icon={CircleCheck} tone="bg-emerald-100 text-emerald-600" title="Pembayaran berhasil!" message={copy.paidMessage}>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-xl bg-slate-50 p-4 text-sm">
        <dt className="text-slate-500">Metode</dt>
        <dd className="font-semibold text-slate-900">{getMethod(o.payment.method).label}</dd>
        <dt className="text-slate-500">Dibayar</dt>
        <dd className="font-semibold text-slate-900">{formatTimestamp(o.payment.paidAt)}</dd>
        <dt className="text-slate-500">Total</dt>
        <dd className="font-semibold text-slate-900">{formatRupiah(o.total)}</dd>
      </dl>

      <h3 className="mt-6 text-sm font-bold text-slate-900">Selanjutnya</h3>
      <ol className="mt-2 space-y-2">
        {copy.nextSteps.map((step, i) => (
          <li key={step} className="flex gap-3 text-sm text-slate-700">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Link href={copy.afterPaid.href} className={primaryBtn}>
          {copy.afterPaid.label}
        </Link>
        <Link href="/" className={secondaryBtn}>
          Balik ke Beranda
        </Link>
      </div>
    </Outcome>
  );
}

function PaymentFailed({ order: o }: { order: Order }) {
  if (o.payment.step !== "failed") return null;
  return (
    <Outcome
      Icon={CircleX}
      tone="bg-red-100 text-red-600"
      title="Pembayaran gagal"
      message={`Tenang, booking kamu masih aman sampai ${formatTimestamp(o.expiresAt)}. Coba lagi, boleh pakai metode lain.`}
    >
      <div className="rounded-xl bg-red-50 p-4 text-sm ring-1 ring-red-200">
        <p className="font-semibold text-red-800">{getMethod(o.payment.method).label}</p>
        <p className="mt-0.5 text-red-700">{o.payment.reason}</p>
      </div>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={() => changeMethod(o.id)} className={primaryBtn}>
          <RotateCcw className="size-4" />
          Coba Lagi
        </button>
        <a
          href={whatsappLink(`Halo admin, pembayaran booking ${o.id} gagal terus. Bisa bantu?`)}
          target="_blank"
          rel="noopener noreferrer"
          className={secondaryBtn}
        >
          <MessageCircle className="size-4" />
          Tanya Admin
        </a>
      </div>
    </Outcome>
  );
}

function PaymentExpired({ order: o }: { order: Order }) {
  const copy = orderCopy(o);
  return (
    <Outcome
      Icon={CalendarX}
      tone="bg-slate-100 text-slate-500"
      title="Waktu pembayaran habis"
      message={`Pesanan ini nggak dibayar sampai ${formatTimestamp(o.expiresAt)}, ${copy.expiredNote}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link href={copy.retry.href} className={primaryBtn}>
          {copy.retry.label}
        </Link>
        <Link href={copy.browse.href} className={secondaryBtn}>
          {copy.browse.label}
        </Link>
      </div>
    </Outcome>
  );
}

function NotFound({ id }: { id: string }) {
  return (
    <div className="mx-auto max-w-lg">
      <Outcome
        Icon={SearchX}
        tone="bg-slate-100 text-slate-500"
        title="Booking ID-nya nggak ketemu"
        message={`Kita nggak nemu pesanan ${id} di browser ini. Pesanan yang dibuat di HP atau browser lain belum bisa dibuka di sini.`}
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/#cek-pembayaran" className={primaryBtn}>
            Cek Status Pembayaran
          </Link>
          <Link href="/schedule" className={secondaryBtn}>
            Cari Jadwal
          </Link>
        </div>
      </Outcome>
    </div>
  );
}
