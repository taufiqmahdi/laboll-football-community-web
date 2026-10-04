import Link from "next/link";
import {
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  TikTok,
  YouTube,
  type LucideIcon,
} from "@/app/components/icons";
import { contact, whatsappLink } from "@/app/data/site";

// Placeholder accounts: swap in the real ones (contact details live in app/data/site.ts).
const socials: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Instagram", href: "https://www.instagram.com/", Icon: Instagram },
  { label: "TikTok", href: "https://www.tiktok.com/", Icon: TikTok },
  { label: "YouTube", href: "https://www.youtube.com/", Icon: YouTube },
  { label: "WhatsApp", href: whatsappLink(), Icon: MessageCircle },
];

export default function SiteFooter() {
  return (
    <footer className="w-full bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 md:px-8">
        <div className="grid gap-10 text-center md:grid-cols-[1.4fr_1fr] md:gap-16 md:text-left">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2" aria-label="Laboll, ke beranda">
              <img src="/logo.svg" alt="" className="size-10 rounded-full" />
              <span className="text-2xl font-extrabold tracking-tight text-white">LABOLL</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Komunitas football dan mini soccer buat siapa aja yang mau main bareng. Cari jadwal, ikut turnamen, dan
              kenalan sama teman baru di lapangan.
            </p>
            <ul className="mt-6 flex gap-3">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Laboll di ${label}`}
                    title={label}
                    className="flex size-10 items-center justify-center rounded-full bg-white/5 text-slate-300 ring-1 ring-white/10 transition hover:bg-blue-500 hover:text-white hover:ring-blue-500"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact (always left-aligned, even when the brand column is centered on phones) */}
          <div className="text-left">
            <h2 className="text-sm font-bold tracking-wider text-white uppercase">Kontak Kita</h2>
            <ul className="mt-4 flex flex-col items-start gap-3 text-sm">
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 transition hover:text-white">
                  <Mail className="size-5 shrink-0 text-blue-400" />
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.phoneHref} className="flex items-center gap-3 transition hover:text-white">
                  <Phone className="size-5 shrink-0 text-blue-400" />
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-px size-5 shrink-0 text-blue-400" />
                <address className="not-italic">{contact.address}</address>
              </li>
            </ul>
          </div>
        </div>

        {/* Credit + tagline */}
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Laboll. Semua hak dilindungi.</p>
          <p className="font-semibold text-slate-400">
            Fun game. Good vibes. <span className="text-blue-400">#KitaMainLagi</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
