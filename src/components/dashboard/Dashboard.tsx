import { motion } from "framer-motion";
import { ArrowUpRight, FileQuestion, Target, BookOpen } from "lucide-react";
import { ReadinessRing } from "./ReadinessRing";
import { StreakCard } from "./StreakCard";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { WeakSpots } from "./WeakSpots";
import { CertificationPath } from "./CertificationPath";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GradientButton } from "@/components/ui/GradientButton";
import { GuestBanner } from "@/components/ui/GuestBanner";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { isAuthenticated, type AuthState } from "@/lib/auth";
import { DEFAULT_READINESS_SCORE } from "@/lib/readiness";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { type CertTrackId } from "@/lib/certPath";
import {
  DEFAULT_DOMAIN_EVIDENCE,
  EVIDENCE_THRESHOLD,
  buildDomainsForExam,
  buildDomainAccuracyForExam,
} from "@/lib/domainEvidence";
import { activityDays, computeStreaks } from "@/lib/activityData";
import { INITIAL_EXAMS, type ExamEntry } from "@/lib/practiceExams";
import { useI18n } from "@/lib/i18n";

type DomainAccuracy = ReturnType<typeof buildDomainAccuracyForExam>[number];

type RecommendedAction =
  | { kind: "coverage"; domain: string; answered: number }
  | { kind: "drill"; domain: string; accuracy: number }
  | { kind: "mock" };

function getRecommendedActions(domainAccuracy: DomainAccuracy[], activeExamEntry: ExamEntry | undefined) {
  const actions: RecommendedAction[] = [];

  const underCovered = [...domainAccuracy]
    .filter((d) => d.answered < EVIDENCE_THRESHOLD)
    .sort((a, b) => a.answered - b.answered)[0];
  if (underCovered) {
    actions.push({ kind: "coverage", domain: underCovered.name, answered: underCovered.answered });
  }

  const weakest = [...domainAccuracy]
    .filter((d) => d.answered >= EVIDENCE_THRESHOLD)
    .sort((a, b) => a.accuracy - b.accuracy)[0];
  if (weakest) {
    actions.push({ kind: "drill", domain: weakest.name, accuracy: weakest.accuracy });
  }

  if (!activeExamEntry?.lastAttemptAt || (activeExamEntry.bestScore ?? 0) < 70) {
    actions.push({ kind: "mock" });
  }

  return actions.slice(0, 3);
}

function useFormatAttemptDate() {
  const { t, localeTag } = useI18n();
  return (iso: string) => {
    const attempted = new Date(iso);
    const days = Math.floor((Date.now() - attempted.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return t("dashboard.today");
    if (days === 1) return t("dashboard.yesterday");
    if (days < 7) return t("dashboard.daysAgo", { count: days });
    return attempted.toLocaleDateString(localeTag, { month: "short", day: "numeric" });
  };
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

interface DashboardProps {
  examCode: string;
  auth: AuthState;
  onSignInClick: () => void;
  onResumeStudying: () => void;
  onViewStudyPlan: () => void;
  onGoToExams: () => void;
  onDrillDomain: (domain: string) => void;
}

export function Dashboard({
  examCode,
  auth,
  onSignInClick,
  onResumeStudying,
  onViewStudyPlan,
  onGoToExams,
  onDrillDomain,
}: DashboardProps) {
  const { t } = useI18n();
  const formatAttemptDate = useFormatAttemptDate();
  const [domainEvidence] = useLocalStorage("domainEvidence", DEFAULT_DOMAIN_EVIDENCE);
  const [exams] = useLocalStorage<ExamEntry[]>("practiceExams", INITIAL_EXAMS);
  const [certTrack] = useLocalStorage<CertTrackId>("selectedCertTrack", "azure");
  const domains = buildDomainsForExam(examCode, domainEvidence);
  const domainAccuracy = buildDomainAccuracyForExam(examCode, domainEvidence);
  const { current: currentStreak } = computeStreaks(activityDays);
  const activeExamEntry = exams.find((e) => e.code === examCode);
  const recommendedActions = getRecommendedActions(domainAccuracy, activeExamEntry);

  return (
    <div className="relative flex-1 overflow-y-auto bg-bg-primary">
      <AmbientGlow />
      <div className="relative mx-auto max-w-5xl px-5 py-8 sm:px-10 sm:py-12">
        {!isAuthenticated(auth) && (
          <GuestBanner onSignInClick={onSignInClick} messageKey="guest.dashboardMessage" />
        )}

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6 flex flex-col gap-5 overflow-hidden rounded-xl sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-h1">
              {isAuthenticated(auth) ? t("dashboard.welcomeBack", { name: auth.username }) : t("dashboard.welcome")}
            </h1>
            <p className="mt-2 font-body text-body-lg text-text-secondary">
              {currentStreak > 0
                ? t("dashboard.streakSubtitle", { count: currentStreak })
                : t("dashboard.streakSubtitleZero")}
            </p>
          </div>
          <GradientButton onClick={onResumeStudying} className="self-start sm:self-auto">
            {t("dashboard.resumeStudying")}
          </GradientButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="mb-6"
        >
          <GlassPanel className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-azure-500/10 text-azure-400">
                <FileQuestion size={16} aria-hidden="true" />
              </div>
              {activeExamEntry?.lastScore != null && activeExamEntry.lastAttemptAt ? (
                <p className="font-body text-sm text-text-secondary">
                  {t("dashboard.lastExamStrip", {
                    code: examCode,
                    score: activeExamEntry.lastScore,
                    when: formatAttemptDate(activeExamEntry.lastAttemptAt),
                  })}
                </p>
              ) : (
                <p className="font-body text-sm text-text-secondary">
                  {t("dashboard.noExamYet", { code: examCode })}
                </p>
              )}
            </div>
            <button
              onClick={onGoToExams}
              className="flex items-center gap-1 self-start font-body text-sm font-medium text-azure-400 hover:text-azure-400/80 sm:self-auto"
            >
              {activeExamEntry?.lastScore != null ? t("common.retake") : t("dashboard.takePracticeExam")}{" "}
              <ArrowUpRight size={14} />
            </button>
          </GlassPanel>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 lg:grid-cols-5"
        >
          <motion.div variants={item} className="lg:col-span-2">
            <ReadinessRing examCode={examCode} domains={domains} score={DEFAULT_READINESS_SCORE} weeklyDelta={6} />
          </motion.div>

          <div className="flex flex-col gap-6 lg:col-span-3">
            <motion.div variants={item}>
              <StreakCard />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-6"
        >
          <WeakSpots domains={domainAccuracy} onDrill={onDrillDomain} />
        </motion.div>

        {recommendedActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="mt-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-h4 font-semibold text-text-primary">
                {t("dashboard.recommendedNext")}
              </h2>
              <button
                onClick={onViewStudyPlan}
                className="flex items-center gap-1 font-body text-sm font-medium text-azure-400 hover:text-azure-400/80"
              >
                {t("dashboard.viewStudyPlan")} <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {recommendedActions.map((action, i) => {
                const key = action.kind === "mock" ? "mock" : action.domain;
                const title =
                  action.kind === "mock" ? t("dashboard.action.mockTitle", { code: examCode }) : action.domain;
                const subtitle =
                  action.kind === "coverage"
                    ? t("dashboard.action.coverageSubtitle", {
                        answered: action.answered,
                        threshold: EVIDENCE_THRESHOLD,
                      })
                    : action.kind === "drill"
                      ? t("dashboard.action.drillSubtitle", { accuracy: action.accuracy })
                      : t("dashboard.action.mockSubtitle");
                const onClick =
                  action.kind === "mock" ? onGoToExams : () => onDrillDomain(action.domain);

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <GlassPanel
                      interactive
                      glow="azure"
                      role="button"
                      tabIndex={0}
                      onClick={onClick}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") onClick();
                      }}
                      className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-bg-tertiary/60 p-2">
                          {action.kind === "mock" ? (
                            <FileQuestion className="h-full w-full text-azure-400" aria-hidden="true" />
                          ) : action.kind === "drill" ? (
                            <Target className="h-full w-full text-azure-400" aria-hidden="true" />
                          ) : (
                            <BookOpen className="h-full w-full text-azure-400" aria-hidden="true" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-body text-sm font-medium text-text-primary">{title}</p>
                          <p className="truncate font-body text-caption text-text-tertiary">{subtitle}</p>
                        </div>
                      </div>
                      <ArrowUpRight size={16} className="shrink-0 text-text-tertiary" aria-hidden="true" />
                    </GlassPanel>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="mt-10"
        >
          <CertificationPath trackId={certTrack} exams={exams} onSelectNode={() => onGoToExams()} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="mt-6"
        >
          <ActivityHeatmap />
        </motion.div>
      </div>
    </div>
  );
}
