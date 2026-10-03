import { CalendarDays } from "@/app/components/icons";
import ScheduleSection from "@/app/components/ScheduleSection";

export default function Home() {
  const items = [
    "Diskon 10% buat semua pertandingan!",
    "Ada benefit eksklusif khusus member, lho",
    "Jadi member cuma Rp 100.000 setahun",
    "Member juga dapet diskon 10% buat semua produk!",
  ];

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="marquee w-full overflow-hidden bg-blue-400 py-2">
          <div className="marquee-track flex w-max">
            {[...items, ...items].map((text, i) => (
              <div key={i} className="whitespace-nowrap pr-16">
                {text}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex flex-wrap items-center justify-center p-4 gap-4 sm:gap-8">
          <div>Test</div>
          <div>Test</div>
          <div>Test</div>
          <div>Test</div>
        </div>
        <div className="relative flex min-h-96 w-full items-center overflow-hidden">
          <img
            src="https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg"
            alt="Blax Hero Banner"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-500/30"></div>
          <div className="relative px-4 py-12 sm:p-10 md:p-16">
            <div className="text-4xl sm:text-5xl md:text-6xl text-white font-bold">
              Fun game. Good vibes.
              <br />
              #KitaMainLagi
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-8">
              <div>
                <a href="#jadwal" className="flex items-center gap-2 bg-blue-500 text-white font-semibold rounded-full p-4">
                  <CalendarDays className="size-6" />
                  Cek Jadwal Terbaru
                </a>
              </div>
              <div>Test</div>
            </div>
          </div>
        </div>
        <ScheduleSection />
      </div>
    </div>
  );
}
