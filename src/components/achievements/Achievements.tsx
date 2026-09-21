import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";
import { activityDays } from "@/lib/activityData";
import { DEFAULT_DOMAIN_EVIDENCE } from "@/lib/domainEvidence";
import { INITIAL_EXAMS } from "@/lib/practiceExams";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useI18n } from "@/lib/i18n";
import { computeAchievements } from "@/lib/achievements";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export function Achievements() {
  const { t } = useI18n();
  const [domainEvidence] = useLocalStorage("domainEvidence", DEFAULT_DOMAIN_EVIDENCE);
  const [exams] = useLocalStorage("practiceExams", INITIAL_EXAMS);

  const achievements = computeAchievements({ domainEvidence, exams, activityDays });
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <div className="relative flex-1 overflow-y-auto bg-bg-primary bg-gradient-radial-glow">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-h1">
            {t("achievements.title")}
          </h1>
          <p className="mt-2 font-body text-body-lg text-text-secondary">
            {t("achievements.subtitle", { earned: earnedCount, total: achievements.length })}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {achievements.map((a) => (
            <motion.div key={a.titleKey} variants={item}>
              <GlassPanel
                interactive={a.earned}
                glow={a.earned ? "violet" : "none"}
                className={cn("flex h-full flex-col gap-3 p-6", !a.earned && "opacity-60")}
              >
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-md",
                    a.earned ? "bg-gradient-azure-violet text-white shadow-glow-violet" : "border border-border-secondary text-text-tertiary"
                  )}
                >
                  <a.icon size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className="font-display text-h4 font-semibold text-text-primary">{t(a.titleKey)}</p>
                  <p className="mt-1 font-body text-sm text-text-secondary">{t(a.descKey, a.descVars)}</p>
                </div>
                {!a.earned && a.progress && (
                  <span className="mt-auto w-fit rounded-full border border-border-secondary px-2.5 py-1 font-mono text-xs text-text-tertiary">
                    {a.progress}
                  </span>
                )}
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
