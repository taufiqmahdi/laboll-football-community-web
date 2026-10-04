export type MerchEdition = "Home" | "Away" | "Third" | "Collab" | "Special Edition" | "Training";

export type MerchStatus = "ready" | "preorder";

export type Product = {
  id: string;
  name: string;
  edition: MerchEdition;
  status: MerchStatus;
  preorder?: { closes: string; ships: string }; // closes: YYYY-MM-DD
  images: string[];
  price: number;
};

// Members get this off every merchandise item.
export const MEMBER_DISCOUNT = 0.1;

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

export const products: Product[] = [
  {
    id: "home-jersey-2026",
    name: "Home Jersey 2026/27",
    edition: "Home",
    status: "ready",
    images: [pexels(8148576), pexels(6311475)],
    price: 275000,
  },
  {
    id: "away-jersey-2026",
    name: "Away Jersey 2026/27",
    edition: "Away",
    status: "ready",
    images: [pexels(4066293), pexels(1656684)],
    price: 275000,
  },
  {
    id: "third-jersey-2026",
    name: "Third Jersey 2026/27",
    edition: "Third",
    status: "preorder",
    preorder: { closes: "2026-10-18", ships: "Dikirim awal November" },
    images: [pexels(8148577), pexels(1018911)],
    price: 285000,
  },
  {
    id: "collab-jersey-juara",
    name: "Laboll x Jersey Juara",
    edition: "Collab",
    status: "preorder",
    preorder: { closes: "2026-10-25", ships: "Dikirim pertengahan November" },
    images: [pexels(5698851), pexels(996329)],
    price: 325000,
  },
  {
    id: "hoodie-5-tahun",
    name: "Hoodie Edisi 5 Tahun",
    edition: "Special Edition",
    status: "preorder",
    preorder: { closes: "2026-10-31", ships: "Dikirim akhir November" },
    images: [pexels(6311392), pexels(10481315)],
    price: 399000,
  },
  {
    id: "training-tee",
    name: "Training Tee",
    edition: "Training",
    status: "ready",
    images: [pexels(9558601)],
    price: 149000,
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function memberPrice(price: number) {
  return Math.round((price * (1 - MEMBER_DISCOUNT)) / 1000) * 1000;
}
