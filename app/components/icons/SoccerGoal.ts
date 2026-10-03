import { createLucideIcon } from "lucide-react";

// Lucide's `Goal` is a flag-on-target ("goal" as in objective), so this is a
// soccer goal with net, drawn in lucide style. Used for Mini Soccer.
const SoccerGoal = createLucideIcon("soccer-goal", [
  ["path", { d: "M3 20V5h18v15", key: "frame" }],
  ["path", { d: "M1 20h22", key: "ground" }],
  ["path", { d: "M9 5v15M15 5v15M3 10h18M3 15h18", key: "net" }],
]);

export default SoccerGoal;
