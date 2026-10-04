import { notFound } from "next/navigation";
import ComingSoon from "@/app/components/ComingSoon";
import TournamentSummary from "@/app/components/TournamentSummary";
import { getTournament, tournaments } from "@/app/data/tournaments";

export function generateStaticParams() {
  return tournaments.map((t) => ({ id: t.id }));
}

export default async function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tournament = getTournament(id);
  if (!tournament) notFound();

  return (
    <ComingSoon
      title="Detail turnamennya lagi kita siapin"
      message="Jadwal pertandingan, bagan, dan aturan mainnya bakal muncul di sini. Sabar bentar, ya!"
      backHref="/#turnamen"
      backLabel="Balik ke turnamen"
    >
      <TournamentSummary tournament={tournament} />
    </ComingSoon>
  );
}
