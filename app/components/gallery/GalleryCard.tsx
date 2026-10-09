import type { ReactNode } from "react";
import BrandAvatar from "@/app/components/BrandAvatar";
import {
  CalendarDays,
  Camera,
  Clock,
  ExternalLink,
  MapPin,
  SoccerBall,
  SoccerGoal,
  Swords,
  Trophy,
  Video,
  type LucideIcon,
} from "@/app/components/icons";
import type { GalleryItem } from "@/app/data/gallery";
import { communityById } from "@/app/data/schedules";
import { formatDate } from "@/app/lib/format";

/*
 * One past session or tournament with its documentation.
 * Phones: photo on top, details, then the two Drive buttons side by side.
 * sm: photo on the left. md+: Drive buttons stacked on the right.
 */
export default function GalleryCard({ item: g }: { item: GalleryItem }) {
  const organizer = communityById[g.communityId];
  const CategoryIcon = g.category === "Football" ? SoccerBall : SoccerGoal;
  const isTournament = g.kind === "turnamen";

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md sm:flex-row">
      {/* Thumbnail */}
      <div className="relative aspect-video shrink-0 sm:aspect-auto sm:w-52 lg:w-60">
        <img src={g.image} alt="" className="absolute inset-0 size-full object-cover" />
        <span
          className={`absolute top-3 left-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${
            isTournament ? "bg-amber-400 text-amber-950" : "bg-blue-500 text-white"
          }`}
        >
          {isTournament ? <Trophy className="size-3.5" /> : <CategoryIcon className="size-3.5" />}
          {isTournament ? "Turnamen" : "Jadwal"}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-center md:gap-6">
        {/* Details */}
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <BrandAvatar brand={organizer} size="xs" />
            <span className="truncate">{organizer.name}</span>
          </p>
          <h2 className="mt-1 text-lg leading-snug font-bold text-slate-900">{g.title}</h2>

          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4 shrink-0 text-slate-400" />
                <time dateTime={g.date}>{formatDate(g.date)}</time>
              </span>
              <span className="flex items-center gap-2">
                <Clock className="size-4 shrink-0 text-slate-400" />
                {g.startTime} – {g.endTime}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />
              <span>{g.venue}</span>
            </li>
            <li className="flex items-center gap-2">
              <Swords className="size-4 shrink-0 text-slate-400" />
              {g.category} · {g.activity}
            </li>
          </ul>

          {/* What documentation exists */}
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Dokumentasi tersedia">
            <MediaChip Icon={Camera} available={Boolean(g.photos)}>
              {g.photos ? `${g.photos.count} foto` : "Foto belum ada"}
            </MediaChip>
            <MediaChip Icon={Video} available={Boolean(g.video)}>
              {g.video ? `Video ${g.video.duration}` : "Video belum ada"}
            </MediaChip>
          </ul>
        </div>

        {/* Google Drive links */}
        <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 md:w-40 md:shrink-0 md:grid-cols-1 md:border-0 md:pt-0">
          <DriveButton href={g.photos?.driveUrl} Icon={Camera} label="Foto" title={g.title} />
          <DriveButton href={g.video?.driveUrl} Icon={Video} label="Video" title={g.title} />
        </div>
      </div>
    </article>
  );
}

function MediaChip({ Icon, available, children }: { Icon: LucideIcon; available: boolean; children: ReactNode }) {
  return (
    <li
      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        available ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-slate-100 text-slate-400"
      }`}
    >
      <Icon className="size-3.5" />
      {children}
    </li>
  );
}

// Opens the Drive folder in a new tab; a same-size disabled pill when that media doesn't exist.
function DriveButton({ href, Icon, label, title }: { href?: string; Icon: LucideIcon; label: string; title: string }) {
  const base = "flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold whitespace-nowrap";
  if (!href) {
    return (
      <span aria-disabled="true" className={`${base} cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400`}>
        <Icon className="size-4 shrink-0" />
        {label}
        <span className="sr-only"> belum ada</span>
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} border-blue-500 bg-blue-500 text-white transition hover:border-blue-600 hover:bg-blue-600`}
    >
      <Icon className="size-4 shrink-0" />
      {label}
      <ExternalLink className="size-3.5 shrink-0 opacity-80" />
      <span className="sr-only"> {title} di Google Drive (tab baru)</span>
    </a>
  );
}
