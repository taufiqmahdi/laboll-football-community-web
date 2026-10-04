import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingCheckout from "@/app/components/booking/BookingCheckout";
import ComingSoon from "@/app/components/ComingSoon";
import { ArrowLeft } from "@/app/components/icons";
import { communityById, getSchedule } from "@/app/data/schedules";
import { formatDate } from "@/app/lib/format";
import { getDemoUser } from "@/app/lib/session";

const MAX_SLOTS_PER_BOOKING = 4;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const schedule = getSchedule(id);
  return schedule ? { title: `Booking ${schedule.title} · Laboll` } : {};
}

export default async function BookingPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = await searchParams;
  const schedule = getSchedule(id);
  if (!schedule) notFound();

  const slotsLeft = schedule.slotsTotal - schedule.slotsFilled;
  if (slotsLeft <= 0) {
    return (
      <ComingSoon
        title="Yah, slotnya udah penuh"
        message="Jadwal ini udah nggak ada slot kosong. Coba cari jadwal lain, yuk!"
        backHref={`/schedule/${schedule.id}`}
        backLabel="Balik ke detail jadwal"
      />
    );
  }

  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8 md:pt-10">
        <Link
          href={`/schedule/${schedule.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="size-4" />
          Balik ke detail jadwal
        </Link>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Booking Slot Main</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Isi data kamu, pilih posisi dan ukuran, terus lanjut bayar buat amankan slot di{" "}
          <span className="font-semibold text-slate-900">{schedule.title}</span> ({formatDate(schedule.date)}).
        </p>

        <div className="mt-8">
          <BookingCheckout
            schedule={schedule}
            community={communityById[schedule.communityId]}
            user={getDemoUser(query)}
            initialPosition={query.role === "gk" ? "GK" : "Player"}
            maxSlots={Math.min(MAX_SLOTS_PER_BOOKING, slotsLeft)}
            outfit={schedule.includes.includes("Rompi") ? "rompi" : "jersey"}
          />
        </div>
      </div>
    </main>
  );
}
