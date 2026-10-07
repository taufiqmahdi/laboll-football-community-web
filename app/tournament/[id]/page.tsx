import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RulesPanel } from "@/app/components/schedule-detail/Panels";
import Tabs from "@/app/components/schedule-detail/Tabs";
import { OverviewPanel, PrizesPanel, TeamsPanel } from "@/app/components/tournament-detail/Panels";
import TournamentHero from "@/app/components/tournament-detail/TournamentHero";
import TournamentStats from "@/app/components/tournament-detail/TournamentStats";
import { Info, ShieldCheck, Trophy, Users } from "@/app/components/icons";
import { getTournamentDetail } from "@/app/data/tournamentDetails";
import { getTournament, totalPrize, tournaments } from "@/app/data/tournaments";
import { formatDayMonth, formatJuta } from "@/app/lib/format";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return tournaments.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const t = getTournament(id);
  if (!t) return {};
  return {
    title: `${t.name} ${t.edition} · Laboll`,
    description: `${t.category}, ${t.teamsTotal} tim, ${formatDayMonth(t.startDate)} – ${formatDayMonth(t.endDate)} di ${t.location}. Total hadiah Rp ${formatJuta(totalPrize(t))}.`,
  };
}

export default async function TournamentDetailPage({ params }: Props) {
  const { id } = await params;
  const tournament = getTournament(id);
  const detail = getTournamentDetail(id);
  if (!tournament || !detail) notFound();

  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      <TournamentHero tournament={tournament} />
      <TournamentStats tournament={tournament} />

      <div className="mx-auto mt-10 max-w-7xl px-4 md:px-8">
        <Tabs
          label="Detail turnamen"
          items={[
            {
              id: "overview",
              label: "Overview",
              icon: <Info className="size-4" />,
              content: <OverviewPanel tournament={tournament} detail={detail} />,
            },
            {
              id: "hadiah",
              label: "Hadiah",
              icon: <Trophy className="size-4" />,
              content: <PrizesPanel tournament={tournament} detail={detail} />,
            },
            {
              id: "tim",
              label: "Tim",
              icon: <Users className="size-4" />,
              content: <TeamsPanel tournament={tournament} detail={detail} />,
            },
            {
              id: "peraturan",
              label: "Peraturan",
              icon: <ShieldCheck className="size-4" />,
              content: <RulesPanel groups={detail.rules} />,
            },
          ]}
        />
      </div>
    </main>
  );
}
