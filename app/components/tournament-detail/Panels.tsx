import Link from "next/link";
import BrandAvatar from "@/app/components/BrandAvatar";
import { Card } from "@/app/components/schedule-detail/Panels";
import RegisterCard from "@/app/components/tournament-detail/RegisterCard";
import TournamentTimeline from "@/app/components/tournament-detail/TournamentTimeline";
import { medalColors } from "@/app/components/tournament/theme";
import {
  CalendarDays,
  Flag,
  Handshake,
  Info,
  MapPin,
  Medal,
  Navigation,
  ShieldCheck,
  SoccerBall,
  SoccerGoal,
  Sparkles,
  Swords,
  Timer,
  UserRound,
  Users,
  type LucideIcon,
} from "@/app/components/icons";
import {
  getTimeline,
  getTournamentVenue,
  venueMapsLink,
  type TournamentDetail,
} from "@/app/data/tournamentDetails";
import { totalPrize, type Tournament } from "@/app/data/tournaments";
import { formatDate, formatRupiah } from "@/app/lib/format";

// ---------- Overview ----------

export function OverviewPanel({ tournament: t, detail }: { tournament: Tournament; detail: TournamentDetail }) {
  const venue = getTournamentVenue(detail);
  const CategoryIcon = t.category === "Football" ? SoccerBall : SoccerGoal;
  const dates = t.startDate === t.endDate ? formatDate(t.startDate) : `${formatDate(t.startDate)} – ${formatDate(t.endDate)}`;

  const info: { label: string; value: string; Icon: LucideIcon }[] = [
    { label: "Kategori", value: t.category, Icon: CategoryIcon },
    { label: "Format", value: t.format, Icon: Swords },
    { label: "Jumlah tim", value: `${t.teamsTotal} tim`, Icon: Users },
    { label: "Pemain per tim", value: detail.squad, Icon: UserRound },
    { label: "Durasi laga", value: detail.matchLength, Icon: Timer },
    { label: "Tanggal", value: dates, Icon: CalendarDays },
    ...(detail.minAge ? [{ label: "Usia minimal", value: `${detail.minAge} tahun`, Icon: ShieldCheck }] : []),
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      {/* Registration first on phones, sticky sidebar on desktop */}
      <div className="lg:order-2">
        <div className="lg:sticky lg:top-28">
          <RegisterCard tournament={t} />
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-6 lg:order-1">
        <Card title="Tentang turnamen" icon={<Info className="size-5" />}>
          <div className="space-y-3 leading-relaxed text-slate-700">
            {detail.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Card>

        <Card title="Info turnamen" icon={<Flag className="size-5" />}>
          <dl className="grid gap-4 sm:grid-cols-2">
            {info.map(({ label, value, Icon }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Icon className="size-4" />
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="text-sm font-semibold text-slate-900">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Timeline" icon={<CalendarDays className="size-5" />}>
          <TournamentTimeline steps={getTimeline(t, detail)} />
        </Card>

        <Card title="Venue" icon={<MapPin className="size-5" />}>
          <p className="font-bold text-slate-900">{venue.name}</p>
          <p className="mt-0.5 text-sm text-slate-600">{venue.address}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={venueMapsLink(venue)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-blue-500 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              <Navigation className="size-4" />
              Buka di Google Maps
            </a>
            {venue.merchantId && (
              <Link
                href={`/merchants/${venue.merchantId}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
              >
                <Handshake className="size-4" />
                Lihat merchant
              </Link>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------- Prizes ----------

const placeStyles = ["bg-amber-50 ring-amber-200", "bg-slate-50 ring-slate-200", "bg-orange-50 ring-orange-200"];

export function PrizesPanel({ tournament: t, detail }: { tournament: Tournament; detail: TournamentDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-bold text-slate-900">Hadiah juara</h2>
          <p className="text-sm text-slate-600">
            Total <span className="font-bold text-slate-900">{formatRupiah(totalPrize(t))}</span>
          </p>
        </div>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          {t.prizes.map((prize, i) => (
            <li key={i} className={`flex items-center gap-3 rounded-xl p-4 ring-1 ${placeStyles[i]}`}>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <Medal className={`size-6 ${medalColors[i]}`} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-600">Juara {i + 1}</p>
                <p className="text-lg font-extrabold text-slate-900">{formatRupiah(prize)}</p>
                <p className="text-xs text-slate-500">+ trofi & medali</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <h2 className="font-bold text-slate-900">Penghargaan individu</h2>
        <p className="mt-0.5 text-sm text-slate-500">Di luar total hadiah juara.</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {detail.awards.map((a) => (
            <li key={a.title} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Sparkles className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                <p className="text-xs text-slate-600">{a.reward}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// ---------- Teams ----------
// Team tiles carry a transparent 2px border so they're exactly as tall as the dashed empty-slot tiles.

const teamColors = [
  "bg-blue-500",
  "bg-emerald-600",
  "bg-orange-500",
  "bg-violet-600",
  "bg-red-500",
  "bg-teal-600",
  "bg-amber-600",
  "bg-pink-500",
  "bg-indigo-600",
  "bg-lime-600",
  "bg-slate-700",
  "bg-cyan-600",
];

const initials = (name: string) =>
  name
    .split(/[\s-]+/)
    .filter((w) => /^[a-z]/i.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export function TeamsPanel({ tournament: t, detail }: { tournament: Tournament; detail: TournamentDetail }) {
  const empty = t.teamsTotal - detail.teams.length;

  return (
    <div>
      <p className="text-sm text-slate-600">
        {t.status === "soon" ? (
          <>
            Pendaftaran baru dibuka <span className="font-bold text-slate-900">{formatDate(t.registrationDate)}</span>.
            Siapin timmu dari sekarang!
          </>
        ) : (
          <>
            <span className="font-bold text-slate-900">
              {detail.teams.length} dari {t.teamsTotal} tim
            </span>{" "}
            udah daftar. Pembagian grup diumumin pas technical meeting.
          </>
        )}
      </p>

      <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {detail.teams.map((name, i) => (
          <li key={name} className="flex items-center gap-3 rounded-xl border-2 border-transparent bg-white p-3 shadow-sm ring-1 ring-slate-200">
            <BrandAvatar brand={{ name, initials: initials(name), color: teamColors[i % teamColors.length] }} size="sm" />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">{name}</span>
            <span className="text-xs font-semibold text-slate-400">#{i + 1}</span>
          </li>
        ))}
        {Array.from({ length: empty }, (_, i) => (
          <li
            key={`empty-${i}`}
            className="flex items-center gap-3 rounded-xl border-2 border-dashed border-slate-200 p-3 text-sm text-slate-400"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold">
              {detail.teams.length + i + 1}
            </span>
            <span className="flex-1">Slot kosong</span>
            {t.status === "open" && (
              <Link href={`/tournament/${t.id}/register`} className="text-xs font-semibold text-blue-600 hover:underline">
                Daftar
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
