import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, FileQuestion, ArrowRight, Plus } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GradientButton } from "@/components/ui/GradientButton";
import { ExamPicker } from "@/components/ui/ExamPicker";
import { examDisplayName, findExamGroupLabel } from "@/lib/examCatalog";
import { MockExamFlow, type MockExamResult } from "./MockExamFlow";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { DEFAULT_DOMAIN_EVIDENCE, mergeExamResults } from "@/lib/domainEvidence";
import { INITIAL_EXAMS, type ExamEntry } from "@/lib/practiceExams";
import { CERT_TRACKS, type CertTrackId, type CertPathNode } from "@/lib/certPath";
import { useI18n } from "@/lib/i18n";
import { activityDays } from "@/lib/activityData";
import { computeAchievements, earnedIds, type Achievement } from "@/lib/achievements";
import { AchievementToast } from "@/components/achievements/AchievementToast";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function ExamCard({ exam, onStart }: { exam: ExamEntry; onStart: () => void }) {
  const { t } = useI18n();
  return (
    <GlassPanel interactive glow="azure" className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-azure-500/10 text-azure-400">
          <FileQuestion size={20} />
        </div>
        <div>
          <p className="font-display text-h4 font-semibold text-text-primary">{examDisplayName(exam.code)}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3 font-body text-caption text-text-tertiary">
            <span className="flex items-center gap-1">
              <FileQuestion size={12} /> {exam.questions} {t("exams.questions")}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {exam.minutes} {t("exams.min")}
            </span>
            {exam.bestScore !== null ? (
              <span className="rounded-full border border-status-success/30 bg-status-success/10 px-2 py-0.5 font-mono text-status-success">
                {t("exams.best", { score: exam.bestScore })}
              </span>
            ) : (
              <span className="rounded-full border border-border-secondary px-2 py-0.5 text-text-tertiary">
                {t("exams.notAttempted")}
              </span>
            )}
          </div>
        </div>
      </div>

      <GradientButton onClick={onStart} className="flex items-center justify-center gap-1.5 self-start sm:self-auto">
        {exam.bestScore !== null ? t("exams.resume") : t("exams.startExam")} <ArrowRight size={14} />
      </GradientButton>
    </GlassPanel>
  );
}

function PathNodeCard({ node, onAdd }: { node: CertPathNode; onAdd: () => void }) {
  const { t } = useI18n();
  return (
    <GlassPanel className="flex flex-col gap-5 border-dashed p-6 opacity-70 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-bg-tertiary/60 text-text-tertiary">
          <FileQuestion size={20} />
        </div>
        <div>
          <p className="font-display text-h4 font-semibold text-text-primary">
            {node.code} · {node.name}
          </p>
          <p className="mt-1 font-body text-caption uppercase tracking-wide text-text-tertiary">
            {t(`certPath.tier.${node.tier}`)}
          </p>
        </div>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-1.5 self-start rounded-md border border-azure-500/40 bg-azure-500/10 px-4 py-2 font-body text-sm font-medium text-azure-400 transition-colors hover:bg-azure-500/20 sm:self-auto"
      >
        <Plus size={14} /> {t("exams.addExam")}
      </button>
    </GlassPanel>
  );
}

export function PracticeExams() {
  const { t } = useI18n();
  const [exams, setExams] = useLocalStorage<ExamEntry[]>("practiceExams", INITIAL_EXAMS);
  const [domainEvidence, setDomainEvidence] = useLocalStorage("domainEvidence", DEFAULT_DOMAIN_EVIDENCE);
  const [certTrack] = useLocalStorage<CertTrackId>("selectedCertTrack", "azure");
  const [addingCode, setAddingCode] = useState("AZ-104");
  const [activeExam, setActiveExam] = useState<ExamEntry | null>(null);
  const [celebrationQueue, setCelebrationQueue] = useState<Achievement[]>([]);
  const celebrating = celebrationQueue[0] ?? null;

  useEffect(() => {
    if (!celebrating) return;
    const timer = setTimeout(() => setCelebrationQueue((q) => q.slice(1)), 4000);
    return () => clearTimeout(timer);
  }, [celebrating]);

  const addExamCode = (code: string) => {
    if (exams.some((e) => e.code === code)) return;
    setExams((prev) => [
      ...prev,
      { code, questions: 5, minutes: 6, bestScore: null, lastScore: null, lastAttemptAt: null },
    ]);
  };
  const addExam = () => addExamCode(addingCode);

  const handleExamExit = (result?: MockExamResult) => {
    if (result && activeExam) {
      const newExams = exams.map((e) =>
        e.code === activeExam.code
          ? {
              ...e,
              bestScore: Math.max(result.score, e.bestScore ?? 0),
              lastScore: result.score,
              lastAttemptAt: new Date().toISOString(),
            }
          : e
      );
      const newDomainEvidence = mergeExamResults(domainEvidence, activeExam.code, result.domains);

      const before = earnedIds(computeAchievements({ domainEvidence, exams, activityDays }));
      const after = computeAchievements({ domainEvidence: newDomainEvidence, exams: newExams, activityDays });
      const newlyEarned = after.filter((a) => a.earned && !before.has(a.id));
      if (newlyEarned.length > 0) setCelebrationQueue((q) => [...q, ...newlyEarned]);

      setExams(newExams);
      setDomainEvidence(newDomainEvidence);
    }
    setActiveExam(null);
  };

  if (activeExam) {
    return (
      <MockExamFlow
        examCode={activeExam.code}
        questionCount={activeExam.questions}
        minutes={activeExam.minutes}
        onExit={handleExamExit}
      />
    );
  }

  return (
    <div className="relative flex-1 overflow-y-auto bg-bg-primary bg-gradient-radial-glow">
      <AchievementToast achievement={celebrating} onDismiss={() => setCelebrationQueue((q) => q.slice(1))} />
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-h1">
              {t("exams.title")}
            </h1>
            <p className="mt-2 font-body text-body-lg text-text-secondary">{t("exams.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <ExamPicker value={addingCode} onChange={setAddingCode} className="w-56" />
            <button
              onClick={addExam}
              aria-label={t("exams.addExam")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-azure-violet text-white shadow-glow-azure"
            >
              <Plus size={16} />
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className="mb-4">
          <p className="font-body text-label uppercase text-text-tertiary">
            {t("exams.yourPath", { track: t(CERT_TRACKS[certTrack].labelKey) })}
          </p>
        </motion.div>
        <motion.div variants={container} initial="hidden" animate="show" className="mb-10 flex flex-col gap-4">
          {CERT_TRACKS[certTrack].nodes.map((node) => {
            const exam = exams.find((e) => e.code === node.code);
            return (
              <motion.div key={node.code} variants={item}>
                {exam ? (
                  <ExamCard exam={exam} onStart={() => setActiveExam(exam)} />
                ) : (
                  <PathNodeCard node={node} onAdd={() => addExamCode(node.code)} />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {(() => {
          const pathCodes = new Set(CERT_TRACKS[certTrack].nodes.map((n) => n.code));
          const otherExams = exams.filter((e) => !pathCodes.has(e.code));
          if (otherExams.length === 0) return null;

          const groups = new Map<string, ExamEntry[]>();
          for (const exam of otherExams) {
            const label = findExamGroupLabel(exam.code) ?? t("exams.otherCategory");
            groups.set(label, [...(groups.get(label) ?? []), exam]);
          }

          return (
            <>
              <p className="mb-4 font-body text-label uppercase text-text-tertiary">{t("exams.otherExams")}</p>
              <div className="flex flex-col gap-8">
                {[...groups.entries()].map(([label, groupExams]) => (
                  <div key={label}>
                    <p className="mb-3 font-body text-sm font-medium text-text-secondary">{label}</p>
                    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
                      {groupExams.map((exam) => (
                        <motion.div key={exam.code} variants={item}>
                          <ExamCard exam={exam} onStart={() => setActiveExam(exam)} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
