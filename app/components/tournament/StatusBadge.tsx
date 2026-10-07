import type { TournamentStatus } from "@/app/data/tournaments";

export default function StatusBadge({ status }: { status: TournamentStatus }) {
  if (status === "open") {
    return (
      <span className="flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        Pendaftaran dibuka
      </span>
    );
  }
  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
        status === "soon" ? "bg-amber-300 text-amber-950" : "bg-slate-900/80 text-white"
      }`}
    >
      {status === "soon" ? "Segera dibuka" : "Slot penuh"}
    </span>
  );
}
