import { Stat } from "@/app/components/schedule-detail/ScheduleStats";
import RegistrationStat from "@/app/components/tournament-detail/RegistrationStat";
import { themes } from "@/app/components/tournament/theme";
import { Ticket, Timer, Trophy, Users } from "@/app/components/icons";
import { totalPrize, type Tournament } from "@/app/data/tournaments";
import { formatJuta, formatRupiah } from "@/app/lib/format";

// Compact summary card that overlaps the bottom of the hero (same layout as the schedule detail page).
export default function TournamentStats({ tournament: t }: { tournament: Tournament }) {
  const percent = Math.round((t.teamsRegistered / t.teamsTotal) * 100);

  return (
    <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 md:px-8">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 shadow-lg ring-1 ring-slate-200 sm:grid-cols-4">
        <Stat stacked icon={<Trophy className="size-4" />} label="Total hadiah">
          <p className="text-base font-bold text-slate-900 sm:text-lg">Rp {formatJuta(totalPrize(t))}</p>
          <p className="text-xs text-slate-500">Buat juara 1–3</p>
        </Stat>

        <Stat stacked icon={<Users className="size-4" />} label="Slot tim">
          <p className="text-base font-bold text-slate-900 sm:text-lg">
            {t.teamsRegistered}
            <span className="text-sm font-medium text-slate-500">/{t.teamsTotal}</span>
          </p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${themes[t.theme].slot}`} style={{ width: `${percent}%` }} />
          </div>
        </Stat>

        <Stat stacked icon={<Ticket className="size-4" />} label="Biaya daftar">
          <p className="text-base font-bold text-slate-900 sm:text-lg">{formatRupiah(t.entryFee)}</p>
          <p className="text-xs text-slate-500">per tim</p>
        </Stat>

        <Stat stacked icon={<Timer className="size-4" />} label="Pendaftaran">
          <RegistrationStat tournament={t} />
        </Stat>
      </div>
    </div>
  );
}
