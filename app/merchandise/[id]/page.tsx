import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/app/components/merchandise/ProductCard";
import ProductGallery from "@/app/components/merchandise/ProductGallery";
import ProductPurchase from "@/app/components/merchandise/ProductPurchase";
import { ArrowLeft, CircleCheck } from "@/app/components/icons";
import { getProduct, products } from "@/app/data/merchandise";
import { getProductDetail } from "@/app/data/merchandiseDetails";
import { formatRupiah } from "@/app/lib/format";

type Props = { params: Promise<{ id: string }> };

// Related row: 2×2 on phones, 3 on tablets, 4 on desktop.
const relatedVisibility = ["flex", "flex", "flex", "flex md:hidden lg:flex"];

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return {};
  return {
    title: `${product.name} · Merchandise Laboll`,
    description: `${product.name}, ${formatRupiah(product.price)}. Member hemat 10%.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProduct(id);
  const detail = getProductDetail(id);
  if (!product || !detail) notFound();

  const related = products.filter((p) => p.id !== product.id).slice(0, relatedVisibility.length);
  const specs: [string, string][] = [
    ["Edisi", product.edition],
    ["Bahan", detail.material],
    ["Potongan", detail.fit],
    ["Pengiriman", product.preorder ? product.preorder.ships : "Ready stock, langsung dikirim"],
  ];

  return (
    <main className="w-full flex-1 bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8 md:pt-10">
        <Link
          href="/merchandise"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="size-4" />
          Balik ke merchandise
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-10">
          <div className="lg:sticky lg:top-28">
            <ProductGallery name={product.name} images={product.images} />
          </div>
          <ProductPurchase product={product} detail={detail} />
        </div>

        {/* ---------- About ---------- */}
        <section
          aria-labelledby="tentang-produk"
          className="mt-8 grid gap-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8 md:grid-cols-[1fr_18rem]"
        >
          <div>
            <h2 id="tentang-produk" className="text-lg font-bold text-slate-900">
              Tentang produk
            </h2>
            <div className="mt-3 space-y-3 leading-relaxed text-slate-700">
              {detail.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-4 space-y-2 text-slate-700">
              {detail.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-blue-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <dl className="divide-y divide-slate-100 self-start rounded-xl bg-slate-50 px-4 text-sm ring-1 ring-slate-200">
            {specs.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-3">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-right font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- Related ---------- */}
        <section aria-labelledby="produk-lainnya" className="mt-12">
          <h2 id="produk-lainnya" className="text-xl font-bold text-slate-900">
            Produk lainnya
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} className={relatedVisibility[i]} showPreorderInfo />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
