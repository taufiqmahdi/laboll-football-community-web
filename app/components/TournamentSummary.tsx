import { Trophy } from "@/app/components/icons";
import { totalPrize, type Tournament } from "@/app/data/tournaments";
import { formatDayMonth, formatJuta } from "@/app/lib/format";

export default function TournamentSummary({ tournament: t }: { tournament: Tournament }) {
  return (
    <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
        <Trophy className="size-6" />
      </div>
      <div className="min-w-0">
        <p className="font-bold text-slate-900">
          {t.name} · {t.edition}
        </p>
        <p className="text-sm text-slate-600">
          {formatDayMonth(t.startDate)} – {formatDayMonth(t.endDate)} · Hadiah Rp {formatJuta(totalPrize(t))}
        </p>
        <p className="truncate text-sm text-slate-500">{t.location}</p>
      </div>
    </div>
  );
}
