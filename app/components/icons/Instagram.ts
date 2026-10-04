import { createLucideIcon } from "lucide-react";

// Lucide no longer ships brand logos, so this is drawn in its outline style.
const Instagram = createLucideIcon("instagram", [
  ["rect", { x: "2.5", y: "2.5", width: "19", height: "19", rx: "5.5", key: "frame" }],
  ["circle", { cx: "12", cy: "12", r: "4.25", key: "lens" }],
  ["path", { d: "M17.5 6.5h.01", key: "flash" }],
]);

export default Instagram;
