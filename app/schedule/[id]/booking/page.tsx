import { notFound } from "next/navigation";
import ComingSoon from "@/app/components/ComingSoon";
import ScheduleSummary from "@/app/components/ScheduleSummary";
import { getSchedule, schedules } from "@/app/data/schedules";

export function generateStaticParams() {
  return schedules.map((s) => ({ id: s.id }));
}

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const schedule = getSchedule(id);
  if (!schedule) notFound();

  return (
    <ComingSoon title="Booking-nya sebentar lagi bisa, nih!" message="Halaman booking lagi kita beresin. Nanti kamu bisa langsung amankan slot di sini.">
      <ScheduleSummary schedule={schedule} />
    </ComingSoon>
  );
}
