import { createLucideIcon } from "lucide-react";

// Lucide no longer ships brand logos, so this is drawn in its outline style.
const TikTok = createLucideIcon("tiktok", [
  ["path", { d: "M14 3v12.5a4 4 0 1 1-4-4", key: "note" }],
  ["path", { d: "M14 3c.5 2.8 2.6 4.7 5.5 5", key: "flag" }],
]);

export default TikTok;
