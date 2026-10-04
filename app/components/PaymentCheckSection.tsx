"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Section, SectionHeading } from "@/app/components/SectionTemplate";
import {
  CalendarX,
  Circle,
  CircleCheck,
  CircleX,
  Clock,
  LoaderCircle,
  Mail,
  ReceiptText,
  Search,
  SearchX,
  type LucideIcon,
} from "@/app/components/icons";
import { findBooking, type Booking } from "@/app/data/bookings";
import { communityById, getSchedule } from "@/app/data/schedules";
import { BOOKING_ID_EXAMPLE, checkBookingId, formatBookingId, type CheckState } from "@/app/lib/bookingId";
import { formatDate, formatRupiah } from "@/app/lib/format";

type Result = { kind: "found"; booking: Booking } | { kind: "not-found"; id: string };

const checkIcon: Record<CheckState, { Icon: LucideIcon; className: string }> = {
  pending: { Icon: Circle, className: "text-slate-300" },
  ok: { Icon: CircleCheck, className: "text-emerald-500" },
  error: { Icon: CircleX, className: "text-red-500" },
};

export default function PaymentCheckSection() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const requestId = useRef(0); // ignore answers to an ID the user already changed

  const check = checkBookingId(value);
  const isValid = check.status === "valid";
  const isInvalid = check.status === "invalid";

  const updateValue = (next: string) => {
    setValue(formatBookingId(next));
    setResult(null);
    setLoading(false);
    requestId.current++;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;
    const current = ++requestId.current;
    setLoading(true);
    const booking = await findBooking(value);
    if (current !== requestId.current) return;
    setLoading(false);
    setResult(booking ? { kind: "found", booking } : { kind: "not-found", id: value });
  };

  return (
    <Section id="cek-pembayaran">
      <SectionHeading
        Icon={ReceiptText}
        title="Cek Status Pembayaran"
        subtitle="Udah booking? Masukin booking ID kamu buat cek pembayarannya udah masuk atau belum."
      />

      <div className="mx-auto mt-10 max-w-xl rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <form onSubmit={onSubmit} noValidate>
          <label htmlFor="booking-id" className="text-sm font-semibold text-slate-700">
            Booking ID
          </label>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <ReceiptText className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-slate-400 sm:left-4" />
              <input
                id="booking-id"
                value={value}
                onChange={(e) => updateValue(e.target.value)}
                placeholder={BOOKING_ID_EXAMPLE}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={15}
                aria-invalid={isInvalid}
                aria-describedby="booking-id-hint booking-id-checks"
                className={`w-full rounded-full border bg-white py-3 pr-10 pl-10 text-base tracking-wide text-slate-900 tabular-nums transition outline-none placeholder:text-slate-300 focus:ring-4 sm:py-3.5 sm:pr-11 sm:pl-12 sm:font-mono sm:tracking-wider ${
                  isInvalid
                    ? "border-red-400 focus:ring-red-100"
                    : isValid
                      ? "border-emerald-400 focus:ring-emerald-100"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
              {(isValid || isInvalid) && (
                <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 sm:right-4">
                  {isValid ? (
                    <CircleCheck className="size-5 text-emerald-500" />
                  ) : (
                    <CircleX className="size-5 text-red-500" />
                  )}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              className="flex items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 font-semibold whitespace-nowrap sm:py-3.5 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" />
                  Lagi ngecek...
                </>
              ) : (
                <>
                  <Search className="size-5" />
                  Cek Status
                </>
              )}
            </button>
          </div>

          {/* Live format feedback */}
          <p
            id="booking-id-hint"
            aria-live="polite"
            className={`mt-3 text-sm ${isInvalid ? "text-red-600" : isValid ? "text-emerald-600" : "text-slate-500"}`}
          >
            {check.message}
          </p>
          <ul id="booking-id-checks" className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
            {check.checks.map(({ label, state }) => {
              const { Icon, className } = checkIcon[state];
              return (
                <li key={label} className="flex items-center gap-1.5">
                  <Icon className={`size-4 ${className}`} />
                  <span className={state === "ok" ? "text-slate-900" : undefined}>{label}</span>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 flex items-start gap-2 text-xs text-slate-500">
            <Mail className="mt-px size-4 shrink-0" />
            Booking ID ada di email atau WhatsApp konfirmasi yang kamu terima setelah booking.
          </p>
        </form>

        <div aria-live="polite">{result && <ResultCard result={result} />}</div>
      </div>
    </Section>
  );
}

function ResultCard({ result }: { result: Result }) {
  if (result.kind === "not-found") {
    return (
      <ResultShell
        tone="bg-slate-50 ring-slate-200"
        Icon={SearchX}
        iconClass="text-slate-500"
        title="Booking ID-nya nggak ketemu, nih"
        message={`Kita nggak nemu booking dengan ID ${result.id}. Coba cek lagi di email konfirmasi kamu, ya.`}
      />
    );
  }

  const b = result.booking;
  const schedule = getSchedule(b.scheduleId);
  const community = schedule ? communityById[schedule.communityId] : null;

  const details = (
    <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
      <dt className="text-slate-500">Booking ID</dt>
      <dd className="font-mono font-semibold text-slate-900">{b.id}</dd>
      <dt className="text-slate-500">Nama</dt>
      <dd className="text-slate-900">
        {b.playerName} · {b.role}
      </dd>
      {schedule && community && (
        <>
          <dt className="text-slate-500">Jadwal</dt>
          <dd className="text-slate-900">
            {community.name} · {formatDate(schedule.date)}, {schedule.startTime} WIB
          </dd>
          <dt className="text-slate-500">Lokasi</dt>
          <dd className="text-slate-900">{schedule.location}</dd>
        </>
      )}
      <dt className="text-slate-500">Total</dt>
      <dd className="font-bold text-slate-900">{formatRupiah(b.amount)}</dd>
      {b.status === "paid" && (
        <>
          <dt className="text-slate-500">Dibayar</dt>
          <dd className="text-slate-900">
            {b.method} · {b.paidAt}
          </dd>
        </>
      )}
    </dl>
  );

  if (b.status === "paid") {
    return (
      <ResultShell
        tone="bg-emerald-50 ring-emerald-200"
        Icon={CircleCheck}
        iconClass="text-emerald-600"
        title="Pembayaran lunas!"
        message="Asik, slot kamu udah aman. Sampai ketemu di lapangan!"
      >
        {details}
      </ResultShell>
    );
  }

  if (b.status === "pending") {
    return (
      <ResultShell
        tone="bg-amber-50 ring-amber-200"
        Icon={Clock}
        iconClass="text-amber-600"
        title="Menunggu pembayaran"
        message={`Bayar sebelum ${b.payBefore} biar slot kamu nggak dilepas, ya.`}
      >
        {details}
        <Link
          href="/payment"
          className="mt-5 block rounded-full bg-blue-500 py-3 text-center font-semibold text-white transition hover:bg-blue-600"
        >
          Bayar Sekarang
        </Link>
      </ResultShell>
    );
  }

  return (
    <ResultShell
      tone="bg-red-50 ring-red-200"
      Icon={CalendarX}
      iconClass="text-red-600"
      title="Booking-nya udah kedaluwarsa"
      message="Waktu bayarnya udah lewat dan slotnya udah dilepas. Booking ulang, yuk!"
    >
      {details}
      <a
        href="#jadwal"
        className="mt-5 block rounded-full border border-blue-500 py-3 text-center font-semibold text-blue-600 transition hover:bg-blue-50"
      >
        Cari Jadwal Lain
      </a>
    </ResultShell>
  );
}

function ResultShell({
  tone,
  Icon,
  iconClass,
  title,
  message,
  children,
}: {
  tone: string;
  Icon: LucideIcon;
  iconClass: string;
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <div className={`mt-6 rounded-2xl p-5 ring-1 ${tone}`}>
      <div className="flex items-start gap-3">
        <Icon className={`size-6 shrink-0 ${iconClass}`} />
        <div>
          <p className="font-bold text-slate-900">{title}</p>
          <p className="mt-0.5 text-sm text-slate-600">{message}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
