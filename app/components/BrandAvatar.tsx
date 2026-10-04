// Anything with a name and initials (communities, merchants) can use this.
export type Brand = {
  name: string;
  initials: string;
  color: string; // Tailwind bg class for the initials fallback
  logo?: string;
};

const sizes = {
  xs: "size-5 rounded-full text-[9px]",
  sm: "size-9 rounded-full text-xs",
  md: "size-12 rounded-full text-sm",
  lg: "size-16 rounded-full text-lg",
  box: "aspect-square w-full rounded-lg text-xl sm:text-2xl", // fills its container
};

// Shows the logo when there is one, otherwise the initials.
export default function BrandAvatar({ brand, size = "sm" }: { brand: Brand; size?: keyof typeof sizes }) {
  if (brand.logo) {
    return <img src={brand.logo} alt={`Logo ${brand.name}`} className={`shrink-0 object-cover ${sizes[size]}`} />;
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center font-bold text-white ${brand.color} ${sizes[size]}`}
    >
      {brand.initials}
    </span>
  );
}
