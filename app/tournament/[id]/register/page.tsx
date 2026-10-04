import { notFound } from "next/navigation";
import ComingSoon from "@/app/components/ComingSoon";
import TournamentSummary from "@/app/components/TournamentSummary";
import { getTournament, tournaments } from "@/app/data/tournaments";

export function generateStaticParams() {
  return tournaments.map((t) => ({ id: t.id }));
}

export default async function TournamentRegisterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tournament = getTournament(id);
  if (!tournament) notFound();

  return (
    <ComingSoon
      title="Pendaftaran tim sebentar lagi bisa, nih!"
      message="Siapin dulu nama tim dan daftar pemainnya. Nanti kamu bisa daftar langsung dari sini."
      backHref="/#turnamen"
      backLabel="Balik ke turnamen"
    >
      <TournamentSummary tournament={tournament} />
    </ComingSoon>
  );
}
