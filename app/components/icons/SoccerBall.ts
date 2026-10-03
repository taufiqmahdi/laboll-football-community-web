import { createLucideIcon } from "lucide-react";

// Lucide has no soccer ball (only Volleyball), so this one is drawn on the
// same 24px grid / 2px stroke and behaves like any other lucide icon.
const SoccerBall = createLucideIcon("soccer-ball", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "ball" }],
  ["path", { d: "m12 7.5 4.3 3.1-1.7 5H9.4l-1.7-5Z", key: "patch" }],
  ["path", { d: "M12 7.5V2M16.3 10.6l5.2-1.7M14.6 15.6l3.3 4.5M9.4 15.6l-3.3 4.5M7.7 10.6 2.5 8.9", key: "seams" }],
]);

export default SoccerBall;
