// Placeholder contact details: swap in the real ones.
export const contact = {
  email: "halo@laboll.id",
  phone: "+62 812-0000-0000",
  phoneHref: "tel:+6281200000000",
  whatsapp: "6281200000000",
  address: "Jl. Kemang Raya No. 10, Jakarta Selatan 12730",
};

export const whatsappLink = (message?: string) =>
  `https://wa.me/${contact.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
