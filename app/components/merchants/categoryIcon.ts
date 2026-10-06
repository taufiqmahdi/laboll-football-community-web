import { Coffee, LandPlot, Shirt, UtensilsCrossed, type LucideIcon } from "@/app/components/icons";
import type { MerchantCategory } from "@/app/data/merchants";

export const merchantCategoryIcon: Record<MerchantCategory, LucideIcon> = {
  Makanan: UtensilsCrossed,
  Minuman: Coffee,
  "Sport Center": LandPlot,
  Apparel: Shirt,
};
