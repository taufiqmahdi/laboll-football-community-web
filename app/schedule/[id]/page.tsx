import { notFound } from "next/navigation";
import ComingSoon from "@/app/components/ComingSoon";
import ScheduleSummary from "@/app/components/ScheduleSummary";
import { getSchedule, schedules } from "@/app/data/schedules";

export function generateStaticParams() {
  return schedules.map((s) => ({ id: s.id }));
}

export default async function ScheduleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const schedule = getSchedule(id);
  if (!schedule) notFound();

  return (
    <ComingSoon title="Detail jadwalnya lagi kita siapin" message="Sabar bentar, ya! Info lengkapnya bakal muncul di sini.">
      <ScheduleSummary schedule={schedule} />
    </ComingSoon>
  );
}
