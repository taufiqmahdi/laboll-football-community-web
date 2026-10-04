import BrandAvatar from "@/app/components/BrandAvatar";
import { communityById, type Schedule } from "@/app/data/schedules";
import { formatDate } from "@/app/lib/format";

export default function ScheduleSummary({ schedule: s }: { schedule: Schedule }) {
  const community = communityById[s.communityId];

  return (
    <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200">
      <BrandAvatar brand={community} size="md" />
      <div className="min-w-0">
        <p className="font-bold text-slate-900">
          {community.name} · {s.category}
        </p>
        <p className="text-sm text-slate-600">
          {formatDate(s.date)}, {s.startTime} – {s.endTime} WIB
        </p>
        <p className="truncate text-sm text-slate-500">{s.location}</p>
      </div>
    </div>
  );
}
