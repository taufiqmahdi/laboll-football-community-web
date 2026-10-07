"use client";

import type { Tournament } from "@/app/data/tournaments";
import { formatDayMonth } from "@/app/lib/format";
import { countdownLabel, registrationState } from "@/app/lib/tournamentStatus";
import { useToday } from "@/app/lib/useToday";

// The "Pendaftaran" figure in the stats strip, with a live countdown once the browser knows today's date.
export default function RegistrationStat({ tournament: t }: { tournament: Tournament }) {
  const { state, daysLeft } = registrationState(t, useToday());

  if (state === "soon") {
    return (
      <>
        <p className="text-base font-bold text-slate-900 sm:text-lg">Buka {formatDayMonth(t.registrationDate)}</p>
        <p className="text-xs text-amber-700">Segera dibuka</p>
      </>
    );
  }
  if (state === "open") {
    return (
      <>
        <p className="text-base font-bold text-slate-900 sm:text-lg">Tutup {formatDayMonth(t.registrationDate)}</p>
        <p className="min-h-4 text-xs font-semibold text-red-600">{daysLeft !== null && countdownLabel(daysLeft)}</p>
      </>
    );
  }
  return (
    <>
      <p className="text-base font-bold text-slate-900 sm:text-lg">Ditutup</p>
      <p className="text-xs text-slate-500">{state === "full" ? "Slot udah penuh" : `Sejak ${formatDayMonth(t.registrationDate)}`}</p>
    </>
  );
}
