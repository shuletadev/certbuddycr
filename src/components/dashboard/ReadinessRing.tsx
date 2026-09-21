import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Lock } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";
import { EVIDENCE_THRESHOLD } from "@/lib/domainEvidence";
import { useI18n } from "@/lib/i18n";

const SIZE = 200;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface DomainEvidence {
  name: string;
  answered: number;
}

interface ReadinessRingProps {
  examCode: string;
  domains: DomainEvidence[];
  score?: number;
  weeklyDelta?: number;
}

export function ReadinessRing({ examCode, domains, score, weeklyDelta }: ReadinessRingProps) {
  const { t } = useI18n();
  const coveredDomains = domains.filter((d) => d.answered >= EVIDENCE_THRESHOLD);
  const coveredCount = coveredDomains.length;
  const totalCount = domains.length;
  const totalAnswered = domains.reduce((sum, d) => sum + d.answered, 0);

  const state: "locked" | "building" | "ready" =
    coveredCount === 0 ? "locked" : coveredCount === totalCount ? "ready" : "building";

  const displayScore = state === "locked" ? 0 : (score ?? 0);
  const offset = CIRCUMFERENCE - (displayScore / 100) * CIRCUMFERENCE;

  const [justBecameReady, setJustBecameReady] = useState(false);
  const prevStateRef = useRef(state);
  useEffect(() => {
    const prev = prevStateRef.current;
    prevStateRef.current = state;
    if (prev !== "ready" && state === "ready") {
      setJustBecameReady(true);
      const t = setTimeout(() => setJustBecameReady(false), 900);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <motion.div
      animate={justBecameReady ? { scale: [1, 1.04, 1] } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
    <GlassPanel interactive glow={state === "locked" ? "none" : "azure"} className="flex flex-col items-center p-8">
      <div className="mb-6 flex w-full items-center justify-between">
        <div>
          <p className="font-body text-label uppercase text-text-tertiary">{t("ring.examReadiness")}</p>
          <p className="font-display text-h4 font-semibold text-text-primary">{examCode}</p>
        </div>
        {state !== "locked" && weeklyDelta !== undefined && (
          <span className="flex items-center gap-1 rounded-full border border-status-success/30 bg-status-success/10 px-2.5 py-1 font-mono text-xs text-status-success">
            <TrendingUp size={12} aria-hidden="true" />
            {t("ring.weeklyDelta", { pct: weeklyDelta })}
          </span>
        )}
      </div>

      <div className="relative flex items-center justify-center">
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="#1A1E27" strokeWidth={STROKE} />
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2F81FF" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          {state !== "locked" && (
            <motion.circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE, opacity: 1 }}
              animate={{ strokeDashoffset: offset, opacity: state === "building" ? 0.5 : 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{
                filter: state === "ready" ? "drop-shadow(0 0 10px rgba(47,129,255,0.55))" : "none",
              }}
            />
          )}
        </svg>
        <div className="absolute flex flex-col items-center">
          {state === "locked" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <Lock size={28} className="mb-2 text-text-tertiary" aria-hidden="true" />
              <span className="font-display text-base font-semibold text-text-secondary">
                {t("ring.limitedEvidence")}
              </span>
            </motion.div>
          ) : (
            <>
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "font-display text-h1 font-semibold",
                  state === "ready" ? "text-text-primary" : "text-text-secondary"
                )}
              >
                {displayScore}
                <span className="text-h4 text-text-tertiary">%</span>
              </motion.span>
              <span className="font-body text-caption text-text-tertiary">
                {state === "ready" ? t("ring.readyToSit") : t("ring.preliminaryRead")}
              </span>
            </>
          )}
        </div>
      </div>

      <p className="mt-6 text-center font-body text-sm text-text-secondary">
        {state === "ready"
          ? t("ring.readySentence", { count: totalAnswered })
          : t("ring.buildingSentence", { covered: coveredCount, total: totalCount, threshold: EVIDENCE_THRESHOLD })}
      </p>
    </GlassPanel>
    </motion.div>
  );
}
