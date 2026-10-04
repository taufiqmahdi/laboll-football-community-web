import { CalendarDays, ReceiptText, SoccerBall } from "@/app/components/icons";
import MerchandiseSection from "@/app/components/MerchandiseSection";
import MerchantSection from "@/app/components/MerchantSection";
import NewsSection from "@/app/components/NewsSection";
import PaymentCheckSection from "@/app/components/PaymentCheckSection";
import ScheduleSection from "@/app/components/ScheduleSection";
import TournamentSection from "@/app/components/TournamentSection";

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero: fills the screen under the sticky header on desktop, capped so it never gets absurdly tall */}
      <section className="relative isolate flex min-h-[34rem] w-full items-center overflow-hidden sm:min-h-[38rem] lg:h-[calc(100svh-6.25rem)] lg:min-h-[36rem] lg:max-h-[48rem]">
        <img
          src="https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Bola di lapangan hijau"
          className="absolute inset-0 -z-10 size-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-slate-950/90 via-blue-950/60 to-blue-950/30 md:bg-linear-to-r md:from-slate-950/85 md:via-blue-950/55 md:to-transparent" />

        <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur">
              <SoccerBall className="size-4" />
              Komunitas football & mini soccer
            </span>

            <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="block">Fun game.</span>
              <span className="block">Good vibes.</span>
              <span className="block text-blue-400">#KitaMainLagi</span>
            </h1>

            <p className="mt-5 max-w-xl text-base text-slate-200 sm:text-lg">
              Main bareng komunitas seru tiap minggu. Tinggal pilih jadwal, booking slot, dateng, terus main. Gampang!
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#jadwal"
                className="flex items-center justify-center gap-2 rounded-full bg-blue-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600"
              >
                <CalendarDays className="size-5" />
                Cek Jadwal Terbaru
              </a>
              <a
                href="#cek-pembayaran"
                className="flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <ReceiptText className="size-5" />
                Cek Pembayaran
              </a>
            </div>
          </div>
        </div>
      </section>

      <ScheduleSection />
      <TournamentSection />
      <PaymentCheckSection />
      <MerchantSection />
      <MerchandiseSection />
      <NewsSection />
    </main>
  );
}
