import Link from "next/link";
import { packageIcon } from "@/app/components/facilityIcons";
import type { ReactNode } from "react";
import {
  Armchair,
  CalendarDays,
  Clock,
  Coffee,
  DoorOpen,
  Gauge,
  Info,
  LandPlot,
  Lightbulb,
  MapPin,
  MessageCircle,
  Moon,
  Navigation,
  ShowerHead,
  SoccerBall,
  SoccerGoal,
  SquareParking,
  Swords,
  Timer,
  Toilet,
  Users,
  Wifi,
  type LucideIcon,
} from "@/app/components/icons";
import {
  durationLabel,
  getMatchFormat,
  mapsLink,
  type Team,
  type Venue,
  type VenueFacility,
} from "@/app/data/scheduleDetails";
import type { Schedule } from "@/app/data/schedules";
import { whatsappLink } from "@/app/data/site";
import { formatDate, formatRupiah } from "@/app/lib/format";

const venueIcons: Record<VenueFacility, LucideIcon> = {
  Parkir: SquareParking,
  Toilet: Toilet,
  "Ruang ganti": DoorOpen,
  Shower: ShowerHead,
  Mushola: Moon,
  Kantin: Coffee,
  "Lampu malam": Lightbulb,
  Wifi: Wifi,
  Tribun: Armchair,
};

function Card({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <h2 className="flex items-center gap-2 font-bold text-slate-900">
        <span className="text-blue-600">{icon}</span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

// ---------- Overview ----------

export function OverviewPanel({ schedule: s, venue }: { schedule: Schedule; venue: Venue }) {
  const { teamCount, teamSize } = getMatchFormat(s);
  const CategoryIcon = s.category === "Football" ? SoccerBall : SoccerGoal;

  const info: { label: string; value: string; Icon: LucideIcon }[] = [
    { label: "Kategori", value: s.category, Icon: CategoryIcon },
    { label: "Aktivitas", value: s.activity, Icon: Swords },
    { label: "Format", value: `${teamCount} tim · ${teamSize} pemain/tim`, Icon: Users },
    { label: "Level", value: s.level, Icon: Gauge },
    { label: "Tanggal", value: formatDate(s.date), Icon: CalendarDays },
    { label: "Jam", value: `${s.startTime} – ${s.endTime} WIB`, Icon: Clock },
    { label: "Durasi", value: durationLabel(s), Icon: Timer },
    { label: "Lapangan", value: venue.surface, Icon: LandPlot },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      {/* Quick actions first on phones, sticky sidebar on desktop */}
      <div className="lg:order-2">
        <div className="lg:sticky lg:top-28">
          <QuickActions schedule={s} />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:order-1">
        <Card title="Info pertandingan" icon={<Info className="size-5" />}>
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

        <Card title="Info venue" icon={<MapPin className="size-5" />}>
          <p className="font-bold text-slate-900">{venue.name}</p>
          <p className="mt-0.5 text-sm text-slate-600">{venue.area}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {venue.facilities.map((f) => {
              const Icon = venueIcons[f];
              return (
                <span
                  key={f}
                  className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  <Icon className="size-3.5" />
                  {f}
                </span>
              );
            })}
          </div>
          <a
            href={mapsLink(venue)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-blue-500 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            <Navigation className="size-4" />
            Buka di Google Maps
          </a>
        </Card>
      </div>
    </div>
  );
}

function QuickActions({ schedule: s }: { schedule: Schedule }) {
  const left = s.slotsTotal - s.slotsFilled;
  const isFull = left <= 0;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <h2 className="font-bold text-slate-900">{isFull ? "Yah, slotnya udah penuh" : "Ikutan main, yuk!"}</h2>
      <p className={`mt-1 text-sm ${isFull ? "text-red-600" : left <= 3 ? "text-orange-600" : "text-slate-600"}`}>
        {isFull ? "Masuk waiting list biar dikabarin kalau ada yang batal." : `Sisa ${left} slot lagi, buruan amankan!`}
      </p>

      <dl className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-600">Player</dt>
          <dd className="font-bold text-slate-900">{formatRupiah(s.playerFee)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-600">Kiper (GK)</dt>
          <dd className="font-bold text-slate-900">{formatRupiah(s.gkFee)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-col gap-2">
        {isFull ? (
          <span className="cursor-not-allowed rounded-full bg-slate-200 py-3 text-center text-sm font-semibold text-slate-500">
            Slot Penuh
          </span>
        ) : (
          <>
            <Link
              href={`/schedule/${s.id}/booking?role=player`}
              className="rounded-full bg-blue-500 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Booking sebagai Player
            </Link>
            <Link
              href={`/schedule/${s.id}/booking?role=gk`}
              className="rounded-full border border-blue-500 py-3 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Booking sebagai GK
            </Link>
          </>
        )}
        <a
          href={whatsappLink(`Halo admin, mau tanya soal jadwal "${s.title}" (${formatDate(s.date)}).`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <MessageCircle className="size-4" />
          {isFull ? "Masuk waiting list via WhatsApp" : "Tanya admin via WhatsApp"}
        </a>
      </div>
    </section>
  );
}

// ---------- Line up ----------

const teamStyles: Record<Team["color"], { dot: string; header: string }> = {
  blue: { dot: "bg-blue-500", header: "bg-blue-50" },
  slate: { dot: "bg-slate-400", header: "bg-slate-100" },
  red: { dot: "bg-red-500", header: "bg-red-50" },
};

export function LineupPanel({ schedule: s, teams }: { schedule: Schedule; teams: Team[] }) {
  return (
    <div>
      <p className="text-sm text-slate-600">
        <span className="font-bold text-slate-900">{s.slotsFilled} dari {s.slotsTotal} pemain</span> udah gabung.
        Pembagian tim final diumumin pas di lapangan, ya.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => {
          const style = teamStyles[team.color];
          const empty = team.size - team.players.length;
          return (
            <section key={team.name} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <h3 className={`flex items-center justify-between px-4 py-3 font-bold text-slate-900 ${style.header}`}>
                <span className="flex items-center gap-2">
                  <span className={`size-3 rounded-full ${style.dot}`} />
                  {team.name}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {team.players.length}/{team.size}
                </span>
              </h3>
              <ol className="divide-y divide-slate-100">
                {team.players.map((p, i) => (
                  <li key={p.name} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-slate-800">{p.name}</span>
                    {p.role === "GK" && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">GK</span>
                    )}
                  </li>
                ))}
                {empty > 0 && (
                  <li className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                    <span className="text-slate-400">
                      +{empty} slot kosong
                    </span>
                    <Link
                      href={`/schedule/${s.id}/booking?role=player`}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Ambil slot
                    </Link>
                  </li>
                )}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Facilities ----------

export function FacilitiesPanel({ schedule: s, venue }: { schedule: Schedule; venue: Venue }) {
  const groups: { title: string; note: string; items: { label: string; Icon: LucideIcon }[] }[] = [
    {
      title: "Udah termasuk di paket",
      note: "Langsung dapet tanpa bayar tambahan.",
      items: s.includes.map((label) => ({ label, Icon: packageIcon(label) })),
    },
    {
      title: "Fasilitas venue",
      note: `Yang tersedia di ${venue.name}.`,
      items: venue.facilities.map((label) => ({ label, Icon: venueIcons[label] })),
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {groups.map((g) => (
        <section key={g.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <h2 className="font-bold text-slate-900">{g.title}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{g.note}</p>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {g.items.map(({ label, Icon }) => (
              <li key={label} className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-800">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Icon className="size-4" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

// ---------- Rules ----------

export function RulesPanel({ groups }: { groups: { title: string; items: string[] }[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {groups.map((g) => (
        <section key={g.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <h2 className="font-bold text-slate-900">{g.title}</h2>
          <ol className="mt-4 space-y-3">
            {g.items.map((rule, i) => (
              <li key={rule} className="flex gap-3 text-sm text-slate-700">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-0.5">{rule}</span>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
