import type { Metadata } from "next";
import ComingSoon from "@/app/components/ComingSoon";
import PaymentFlow from "@/app/components/payment/PaymentFlow";
import { checkBookingId } from "@/app/lib/bookingId";

export const metadata: Metadata = {
  title: "Pembayaran · Laboll",
  robots: { index: false }, // per-booking pages, nothing to index
};

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
        title="Pilih booking yang mau dibayar"
        message="Buka halaman ini dari tombol bayar setelah booking, atau cek booking ID kamu dulu di beranda."
        backHref="/#cek-pembayaran"
        backLabel="Cek status pembayaran"
      />
    );
  }

  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-6 md:px-8 md:pt-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Pembayaran</h1>
        <div className="mt-6">
          <PaymentFlow id={bookingId} />
        </div>
      </div>
    </main>
  );
}
