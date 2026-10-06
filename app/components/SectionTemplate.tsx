import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, type LucideIcon } from "@/app/components/icons";

// Shared layout for homepage sections: icon + title + subtitle, content, then a big "see all" button.

const tones = {
  muted: "bg-slate-50",
  plain: "bg-white",
  dark: "bg-slate-950 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.22),transparent_60%)]",
};

// Text inside a dark section flips via the `group-data-[tone=dark]/section` variant.
export function Section({
  id,
  tone = "muted",
  children,
}: {
  id: string;
  tone?: "muted" | "plain" | "dark";
  children: ReactNode;
}) {
  return (
    <section id={id} data-tone={tone} className={`group/section w-full scroll-mt-26 py-12 md:py-16 ${tones[tone]}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">{children}</div>
    </section>
  );
}

export function SectionHeading({ Icon, title, subtitle }: { Icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-data-[tone=dark]/section:bg-blue-500/15 group-data-[tone=dark]/section:text-blue-300">
        <Icon className="size-7" />
      </div>
      <h2 className="mt-4 text-3xl font-bold text-slate-900 group-data-[tone=dark]/section:text-white md:text-4xl">
        {title}
      </h2>
      <p className="mt-2 max-w-xl text-slate-600 group-data-[tone=dark]/section:text-slate-300">{subtitle}</p>
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
      {children}
    </div>
  );
}

export function SeeAllLink({ href, label, note }: { href: string; label: string; note?: ReactNode }) {
  return (
    <div className="mt-12 flex flex-col items-center gap-3">
      <Link
        href={href}
        className="flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-4 text-base font-semibold whitespace-nowrap text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600 sm:px-8 sm:text-lg"
      >
        {label}
        <ArrowRight className="size-5" />
      </Link>
      <p className="min-h-5 text-center text-sm text-balance text-slate-600 group-data-[tone=dark]/section:text-slate-300">
        {note}
      </p>
    </div>
  );
}

// Cards only ever fill one row: each card lists the breakpoint from which it's shown,
// so extra cards drop out as the screen narrows instead of wrapping to a second row.
export const showFrom = {
  base: "flex",
  sm: "hidden sm:flex",
  md: "hidden md:flex",
  lg: "hidden lg:flex",
  xl: "hidden xl:flex",
} as const;

export type Breakpoint = keyof typeof showFrom;

// Pill-style single-choice filter. Labels never wrap; icons drop on very narrow phones so it fits.
export function SegmentedFilter<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; Icon: LucideIcon }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex max-w-full rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
      {options.map(({ value: v, label, Icon }) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-semibold whitespace-nowrap transition sm:px-5 ${
            value === v ? "bg-blue-500 text-white" : "text-slate-600 hover:text-blue-600"
          }`}
        >
          <Icon className="size-4 shrink-0 max-[359px]:hidden" />
          {label}
        </button>
      ))}
    </div>
  );
}

// Toggle pill for multi-option filter rows (wraps freely, unlike SegmentedFilter).
export function FilterPill({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap ring-1 transition [&_svg]:size-4 ${
        active
          ? "bg-blue-500 text-white ring-blue-500"
          : "bg-white text-slate-600 ring-slate-200 hover:text-blue-600 hover:ring-blue-300"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

// Phones/tablets: one swipeable row that bleeds to the screen edge (cards should be `shrink-0 snap-start`).
// Desktop (lg+): a normal centered row; the section decides which cards stay visible there.
export function SwipeRow({ hint, count, children }: { hint: string; count: number; children: ReactNode }) {
  return (
    <>
      <div className="relative -mx-4 mt-7 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pt-1 pb-3 [scrollbar-width:none] md:-mx-8 md:scroll-px-8 md:px-8 lg:mx-0 lg:snap-none lg:flex-wrap lg:justify-center lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
      {count > 1 && <p className="mt-1 text-center text-xs text-slate-400 lg:hidden">{hint}</p>}
    </>
  );
}
