import { createLucideIcon } from "lucide-react";

// Lucide no longer ships brand logos, so this is drawn in its outline style.
const YouTube = createLucideIcon("youtube", [
  ["rect", { x: "2", y: "5", width: "20", height: "14", rx: "4.5", key: "screen" }],
  ["path", { d: "m10 9.2 5 2.8-5 2.8Z", key: "play" }],
]);

export default YouTube;
