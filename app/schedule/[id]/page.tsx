import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FacilitiesPanel, LineupPanel, OverviewPanel, RulesPanel } from "@/app/components/schedule-detail/Panels";
import ScheduleHero from "@/app/components/schedule-detail/ScheduleHero";
import ScheduleStats from "@/app/components/schedule-detail/ScheduleStats";
import Tabs from "@/app/components/schedule-detail/Tabs";
import { Info, ListChecks, ShieldCheck, Users } from "@/app/components/icons";
import { getLineup, getRules, getVenue } from "@/app/data/scheduleDetails";
import { communityById, getSchedule, schedules } from "@/app/data/schedules";
import { formatDate } from "@/app/lib/format";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return schedules.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const schedule = getSchedule(id);
  if (!schedule) return {};
  return {
    title: `${schedule.title} · Laboll`,
    description: `${schedule.activity} ${schedule.category} di ${schedule.location}, ${formatDate(schedule.date)} jam ${schedule.startTime} WIB.`,
  };
}

export default async function ScheduleDetailPage({ params }: Props) {
  const { id } = await params;
  const schedule = getSchedule(id);
  if (!schedule) notFound();

  const community = communityById[schedule.communityId];
  const venue = getVenue(schedule);
  const facilityCount = schedule.includes.length + venue.facilities.length;

  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      <ScheduleHero schedule={schedule} community={community} />
      <ScheduleStats schedule={schedule} community={community} facilityCount={facilityCount} />

      <div className="mx-auto mt-10 max-w-7xl px-4 md:px-8">
        <Tabs
          label="Detail jadwal"
          items={[
            {
              id: "overview",
              label: "Overview",
              icon: <Info className="size-4" />,
              content: <OverviewPanel schedule={schedule} venue={venue} />,
            },
            {
              id: "lineup",
              label: "Line Up",
              icon: <Users className="size-4" />,
              content: <LineupPanel schedule={schedule} teams={getLineup(schedule)} />,
            },
            {
              id: "fasilitas",
              label: "Fasilitas",
              icon: <ListChecks className="size-4" />,
              content: <FacilitiesPanel schedule={schedule} venue={venue} />,
            },
            {
              id: "peraturan",
              label: "Peraturan",
              icon: <ShieldCheck className="size-4" />,
              content: <RulesPanel groups={getRules(schedule)} />,
            },
          ]}
        />
      </div>
    </main>
  );
}
