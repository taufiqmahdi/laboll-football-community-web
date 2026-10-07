import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ComingSoon from "@/app/components/ComingSoon";
import TournamentRegistration from "@/app/components/tournament-register/TournamentRegistration";
import TournamentSummary from "@/app/components/TournamentSummary";
import { ArrowLeft } from "@/app/components/icons";
import { getTournamentDetail } from "@/app/data/tournamentDetails";
import { getTournament, tournaments } from "@/app/data/tournaments";
import { formatDate } from "@/app/lib/format";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return tournaments.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const t = getTournament(id);
  return t ? { title: `Daftar ${t.name} ${t.edition} · Laboll` } : {};
}

export default async function TournamentRegisterPage({ params }: Props) {
  const { id } = await params;
  const tournament = getTournament(id);
  const detail = getTournamentDetail(id);
  if (!tournament || !detail) notFound();

  // Registration isn't possible: explain why instead of showing a form that can't be sent.
  if (tournament.status !== "open" || tournament.teamsRegistered >= tournament.teamsTotal) {
    const soon = tournament.status === "soon";
    return (
      <ComingSoon
        title={soon ? "Pendaftarannya belum dibuka" : "Yah, slot timnya udah penuh"}
        message={
          soon
            ? `Pendaftaran dibuka ${formatDate(tournament.registrationDate)}. Siapin dulu nama tim dan daftar pemainnya, ya!`
            : "Semua slot udah terisi. Kamu masih bisa masuk waiting list lewat halaman turnamennya."
        }
        backHref={`/tournament/${tournament.id}`}
        backLabel="Balik ke detail turnamen"
      >
        <TournamentSummary tournament={tournament} />
      </ComingSoon>
    );
  }

  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8 md:pt-10">
        <Link
          href={`/tournament/${tournament.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="size-4" />
          Balik ke detail turnamen
        </Link>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Daftarin Tim Kamu</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Isi data tim dan kontak kapten, terus lanjut bayar buat amankan slot di{" "}
          <span className="font-semibold text-slate-900">
            {tournament.name} {tournament.edition}
          </span>
          .
        </p>

        <div className="mt-8">
          <TournamentRegistration
            tournament={tournament}
            takenNames={detail.teams}
            minPlayers={detail.minPlayers}
            maxPlayers={detail.maxPlayers}
            technicalMeeting={detail.technicalMeeting}
          />
        </div>
      </div>
    </main>
  );
}
