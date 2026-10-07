"use client";

import { useState } from "react";
import {
  EmptyState,
  Section,
  SectionHeading,
  SeeAllLink,
  SegmentedFilter,
  SwipeRow,
} from "@/app/components/SectionTemplate";
import TournamentCard from "@/app/components/tournament/TournamentCard";
import { LayoutGrid, Ticket, Timer, Trophy, type LucideIcon } from "@/app/components/icons";
import { tournaments, type TournamentStatus } from "@/app/data/tournaments";

const statusOptions: { value: TournamentStatus | "all"; label: string; Icon: LucideIcon }[] = [
  { value: "all", label: "Semua", Icon: LayoutGrid },
  { value: "open", label: "Buka", Icon: Ticket },
  { value: "soon", label: "Segera", Icon: Timer },
];

// Swipe row below lg; from lg up only the first two show, side by side.
const cardVisibility = (i: number) => (i < 2 ? "flex" : "flex lg:hidden");

export default function TournamentSection() {
  const [status, setStatus] = useState<TournamentStatus | "all">("all");

  const filtered = tournaments.filter((t) => status === "all" || t.status === status);
  const openCount = tournaments.filter((t) => t.status === "open").length;

  return (
    <Section id="turnamen" tone="dark">
      <SectionHeading
        Icon={Trophy}
        title="Siap Angkat Piala?"
        subtitle="Kumpulin timmu, daftar turnamen, terus rebut hadiahnya. Nggak harus jago, yang penting kompak!"
      />

      <div className="mt-10 text-center">
        <p className="mb-3 text-sm font-semibold text-slate-400">Mau ikut yang mana?</p>
        <SegmentedFilter options={statusOptions} value={status} onChange={setStatus} />
      </div>

      {filtered.length > 0 ? (
        <SwipeRow hint="Geser buat lihat turnamen lainnya →" count={filtered.length}>
          {filtered.map((t, i) => (
            <TournamentCard
              key={t.id}
              tournament={t}
              tone="dark"
              className={`w-[88%] shrink-0 snap-start sm:w-[85%] md:w-[78%] lg:w-[calc(50%-12px)] ${cardVisibility(i)}`}
            />
          ))}
        </SwipeRow>
      ) : (
        <EmptyState>Belum ada turnamen, nih.</EmptyState>
      )}

      <SeeAllLink
        href="/tournament"
        label="Lihat Semua Turnamen"
        note={
          <>
            <span className="font-bold text-blue-300">{openCount} turnamen</span> lagi buka pendaftaran. Gas ajak
            timmu!
          </>
        }
      />
    </Section>
  );
}
