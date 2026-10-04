import {
  Camera,
  GlassWater,
  ShieldCheck,
  Shirt,
  Video,
  Whistle,
  type LucideIcon,
} from "@/app/components/icons";

// Icons for what a schedule's package includes ("Air mineral", "Jersey", ...).
const packageIcons: Record<string, LucideIcon> = {
  "Air mineral": GlassWater,
  Jersey: Shirt,
  Rompi: Shirt,
  Wasit: Whistle,
  Foto: Camera,
  Video: Video,
  Asuransi: ShieldCheck,
};

export const packageIcon = (item: string) => packageIcons[item] ?? ShieldCheck;
