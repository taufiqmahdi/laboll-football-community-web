import type { Metadata } from "next";
import TournamentBrowser from "@/app/components/tournament/TournamentBrowser";
import { parseTournamentFilters } from "@/app/lib/tournamentFilters";

export const metadata: Metadata = {
  title: "Turnamen · Laboll",
  description: "Daftar turnamen football dan mini soccer Laboll: hadiah, jadwal, slot tim, sampai biaya daftarnya.",
};

export default async function TournamentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;

  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Siap Angkat Piala?</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Kumpulin timmu, daftar turnamen, terus rebut hadiahnya. Nggak harus jago, yang penting kompak!
        </p>

        <div className="mt-8">
          <TournamentBrowser initialFilters={parseTournamentFilters(query)} />
        </div>
      </div>
    </main>
  );
}
