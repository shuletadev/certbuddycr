import { motion } from "framer-motion";

// Slow-drifting blurred orbs behind content — an animated upgrade to the
// static radial-glow background. Absolutely positioned with a negative
// z-index so it paints behind normal-flow siblings regardless of DOM order,
// and clipped by its own overflow-hidden wrapper so it never affects the
// parent's scroll area.
export function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute h-[420px] w-[420px] rounded-full bg-azure-500/20 blur-[110px]"
        style={{ top: "-8%", left: "8%" }}
        animate={{ x: [0, 60, -30, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute h-[360px] w-[360px] rounded-full bg-violet-500/15 blur-[110px]"
        style={{ bottom: "-12%", right: "6%" }}
        animate={{ x: [0, -50, 30, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </div>
  );
}
