import type { Metadata } from "next";
import ScheduleBrowser from "@/app/components/schedule-list/ScheduleBrowser";
import { todayInJakarta } from "@/app/lib/format";
import { parseFilters } from "@/app/lib/scheduleFilters";

export const metadata: Metadata = {
  title: "Semua Jadwal Main · Laboll",
  description: "Cari jadwal football dan mini soccer 30 hari ke depan, per tanggal atau per venue.",
};

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;

  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Semua Jadwal Main</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Cari jadwal yang pas buat kamu. Pilih kategori sama jenis mainnya, terus lihat per tanggal atau per venue
          favorit.
        </p>

        <div className="mt-8">
          <ScheduleBrowser today={todayInJakarta()} initialFilters={parseFilters(query)} />
        </div>
      </div>
    </main>
  );
}
