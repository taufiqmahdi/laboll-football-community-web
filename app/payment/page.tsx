import ComingSoon from "@/app/components/ComingSoon";
import { checkBookingId } from "@/app/lib/bookingId";

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { booking } = await searchParams;
  const bookingId = typeof booking === "string" && checkBookingId(booking).status === "valid" ? booking : null;

  if (!bookingId) {
    return (
      <ComingSoon
        title="Cek pembayaran sebentar lagi bisa"
        message="Nanti kamu bisa cek status pembayaran booking-mu di sini. Sabar bentar, ya!"
      />
    );
  }

  return (
    <ComingSoon
      title="Booking kamu udah dibuat!"
      message="Halaman pembayarannya lagi kita siapin. Simpan booking ID ini buat cek status pembayaran nanti, ya."
      backHref="/#cek-pembayaran"
      backLabel="Cek status pembayaran"
    >
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-500">Booking ID kamu</p>
        <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-slate-900">{bookingId}</p>
      </div>
    </ComingSoon>
  );
}
