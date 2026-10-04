import { notFound } from "next/navigation";
import ComingSoon from "@/app/components/ComingSoon";
import { getProduct, memberPrice, products } from "@/app/data/merchandise";
import { formatRupiah } from "@/app/lib/format";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <ComingSoon
      title={product.preorder ? "Pre-order-nya sebentar lagi dibuka" : "Checkout-nya lagi kita siapin"}
      message="Pilih ukuran dan bayar langsung dari sini bakal segera bisa. Sabar bentar, ya!"
      backHref="/#merchandise"
      backLabel="Balik ke merchandise"
    >
      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-200">
        <img src={product.images[0]} alt={product.name} className="size-16 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0">
          <p className="font-bold text-slate-900">{product.name}</p>
          <p className="text-sm text-slate-600">
            {formatRupiah(product.price)} · Member {formatRupiah(memberPrice(product.price))}
          </p>
          <p className="text-sm text-slate-500">{product.preorder ? product.preorder.ships : "Ready stock"}</p>
        </div>
      </div>
    </ComingSoon>
  );
}
