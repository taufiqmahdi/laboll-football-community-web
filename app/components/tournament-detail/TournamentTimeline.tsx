"use client";

import { Check } from "@/app/components/icons";
import type { TimelineStep } from "@/app/data/tournamentDetails";
import { formatDate } from "@/app/lib/format";
import { useToday } from "@/app/lib/useToday";

// Vertical list of key dates. Once the browser knows today's date, past steps are ticked and the next one is highlighted.
export default function TournamentTimeline({ steps }: { steps: TimelineStep[] }) {
  const today = useToday();
  const nextIndex = today ? steps.findIndex((s) => s.date >= today) : -1;

  return (
    <ol>
      {steps.map((step, i) => {
        const done = today !== null && step.date < today;
        const next = i === nextIndex;
        const last = i === steps.length - 1;
        return (
          <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
            {/* connector to the next step, centred under the dot */}
            {!last && (
              <span
                aria-hidden
                className={`absolute top-7 bottom-0 left-3.5 w-0.5 -translate-x-1/2 ${done ? "bg-blue-500" : "bg-slate-200"}`}
              />
            )}
            <span
              className={`relative flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                done
                  ? "bg-blue-500 text-white"
                  : next
                    ? "bg-white text-blue-600 ring-2 ring-blue-500"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              {done ? <Check className="size-4" /> : i + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className={`text-sm font-semibold ${done ? "text-slate-500" : "text-slate-900"}`}>
                {step.label}
                {next && (
                  <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                    Berikutnya
                  </span>
                )}
              </p>
              <p className="text-sm text-slate-500">
                <time dateTime={step.date}>{formatDate(step.date)}</time>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
