import VoucherCode from "@/app/components/merchants/VoucherCode";
import { BadgePercent, CircleCheck } from "@/app/components/icons";
import type { MerchantVoucher as Voucher } from "@/app/data/merchantDetails";
import { formatDateLong } from "@/app/lib/format";

// Ticket-style voucher: offer on top, a perforated line, then the code.
export default function MerchantVoucher({
  merchantName,
  perk,
  voucher,
}: {
  merchantName: string;
  perk: string;
  voucher: Voucher;
}) {
  return (
    <div>
      {/* overflow-clip, not hidden: the notches overhang, and a hidden-overflow box can still be
          scrolled sideways (e.g. when focus returns to the button inside after the login modal). */}
      <div className="overflow-clip rounded-2xl bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/25">
        <div className="flex items-center gap-4 p-5 sm:p-6">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <BadgePercent className="size-6" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-blue-100 uppercase">Voucher {merchantName}</p>
            <p className="mt-0.5 text-xl leading-snug font-extrabold">{perk}</p>
            <p className="mt-1 text-sm text-blue-100">
              Berlaku sampai <time dateTime={voucher.validUntil}>{formatDateLong(voucher.validUntil)}</time>
            </p>
          </div>
        </div>

        {/* Perforation: the notches are card-colored circles cut by the ticket's rounded overflow */}
        <div aria-hidden className="relative">
          <div className="mx-6 border-t-2 border-dashed border-white/40" />
          <span className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full bg-white" />
          <span className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full bg-white" />
        </div>

        <div className="p-5 sm:p-6">
          <VoucherCode code={voucher.code} />
        </div>
      </div>

      <h3 className="mt-5 text-sm font-bold text-slate-900">Syarat & ketentuan</h3>
      <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
        {voucher.terms.map((term) => (
          <li key={term} className="flex items-start gap-2">
            <CircleCheck className="mt-0.5 size-4 shrink-0 text-blue-500" />
            {term}
          </li>
        ))}
      </ul>
    </div>
  );
}
