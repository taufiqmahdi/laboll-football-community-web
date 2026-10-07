import type { ReactNode } from "react";
import BrandAvatar from "@/app/components/BrandAvatar";
import { ListChecks, Ticket, Users } from "@/app/components/icons";
import type { Community, Schedule } from "@/app/data/schedules";
import { formatRupiah } from "@/app/lib/format";

// Compact summary card that overlaps the bottom of the hero.
export default function ScheduleStats({
  schedule: s,
  community,
  facilityCount,
}: {
  schedule: Schedule;
  community: Community;
  facilityCount: number;
}) {
  const percent = Math.round((s.slotsFilled / s.slotsTotal) * 100);

  return (
    <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 md:px-8">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 shadow-lg ring-1 ring-slate-200 sm:grid-cols-4">
        <Stat icon={<Users className="size-4" />} label="Pemain gabung">
          <p className="text-lg font-bold text-slate-900">
            {s.slotsFilled}
            <span className="text-sm font-medium text-slate-500">/{s.slotsTotal}</span>
          </p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${percent}%` }} />
          </div>
        </Stat>

        <Stat icon={<Ticket className="size-4" />} label="Harga">
          <p className="text-lg font-bold text-slate-900">{formatRupiah(s.playerFee)}</p>
          <p className="text-xs text-slate-500">GK {formatRupiah(s.gkFee)}</p>
        </Stat>

        <Stat icon={<ListChecks className="size-4" />} label="Fasilitas">
          <p className="text-lg font-bold text-slate-900">{facilityCount}</p>
          <p className="text-xs text-slate-500">paket + venue</p>
        </Stat>

        <Stat icon={<BrandAvatar brand={community} size="sm" />} label="Komunitas" iconless>
          <p className="truncate text-sm font-bold text-slate-900">{community.name}</p>
        </Stat>
      </div>
    </div>
  );
}

// `stacked` puts the icon above the text below lg, for values too long to sit beside it in a narrow cell.
export function Stat({
  icon,
  label,
  iconless,
  stacked,
  children,
}: {
  icon: ReactNode;
  label: string;
  iconless?: boolean;
  stacked?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`flex min-w-0 gap-3 bg-white p-4 ${iconless ? "items-center" : ""} ${stacked ? "flex-col lg:flex-row" : ""}`}>
      <div
        className={
          iconless ? "shrink-0" : "flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
        }
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500">{label}</p>
        {children}
      </div>
    </div>
  );
}
