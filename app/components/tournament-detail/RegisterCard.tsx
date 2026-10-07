"use client";

import Link from "next/link";
import { MessageCircle } from "@/app/components/icons";
import { whatsappLink } from "@/app/data/site";
import type { Tournament } from "@/app/data/tournaments";
import { formatDate, formatRupiah } from "@/app/lib/format";
import { countdownLabel, registrationState, type RegistrationState } from "@/app/lib/tournamentStatus";
import { useToday } from "@/app/lib/useToday";

const copy: Record<RegistrationState, { title: string; cta: string; whatsapp: string }> = {
  open: { title: "Daftarin timmu, yuk!", cta: "Daftar Tim", whatsapp: "Tanya admin via WhatsApp" },
  soon: { title: "Pendaftaran segera dibuka", cta: "Segera Dibuka", whatsapp: "Ingetin aku via WhatsApp" },
  full: { title: "Yah, slotnya udah penuh", cta: "Slot Penuh", whatsapp: "Masuk waiting list via WhatsApp" },
  closed: { title: "Pendaftaran udah ditutup", cta: "Pendaftaran Ditutup", whatsapp: "Tanya admin via WhatsApp" },
};

export default function RegisterCard({ tournament: t }: { tournament: Tournament }) {
  const { state, daysLeft } = registrationState(t, useToday());
  const left = t.teamsTotal - t.teamsRegistered;
  const text = copy[state];

  const note =
    state === "open"
      ? `Sisa ${left} slot tim lagi, daftar sebelum ${formatDate(t.registrationDate)}.`
      : state === "soon"
        ? `Pendaftaran dibuka ${formatDate(t.registrationDate)}.`
        : state === "full"
          ? "Masuk waiting list biar dikabarin kalau ada tim yang mundur."
          : "Pantau terus turnamen lainnya, ya.";

  const message =
    state === "soon"
      ? `Halo admin, ingetin aku pas pendaftaran ${t.name} ${t.edition} dibuka, ya.`
      : state === "full"
        ? `Halo admin, aku mau masuk waiting list ${t.name} ${t.edition}.`
        : `Halo admin, mau tanya soal ${t.name} ${t.edition}.`;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <h2 className="font-bold text-slate-900">{text.title}</h2>
      <p className={`mt-1 text-sm ${state === "open" && left <= 3 ? "text-orange-600" : "text-slate-600"}`}>{note}</p>

      <dl className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-600">Biaya daftar</dt>
          <dd className="font-bold text-slate-900">
            {formatRupiah(t.entryFee)}
            <span className="font-medium text-slate-500">/tim</span>
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-600">Slot tim</dt>
          <dd className="font-bold text-slate-900">
            {t.teamsRegistered}/{t.teamsTotal} terisi
          </dd>
        </div>
        {state === "open" && daysLeft !== null && (
          <div className="flex justify-between gap-4">
            <dt className="text-slate-600">Pendaftaran tutup</dt>
            <dd className="font-bold text-red-600">{countdownLabel(daysLeft)}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex flex-col gap-2">
        {state === "open" ? (
          <Link
            href={`/tournament/${t.id}/register`}
            className="rounded-full bg-blue-500 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            {text.cta}
          </Link>
        ) : (
          <span className="cursor-not-allowed rounded-full bg-slate-200 py-3 text-center text-sm font-semibold text-slate-500">
            {text.cta}
          </span>
        )}
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <MessageCircle className="size-4" />
          {text.whatsapp}
        </a>
      </div>
    </section>
  );
}
