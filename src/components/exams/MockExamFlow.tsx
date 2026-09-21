import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GradientButton } from "@/components/ui/GradientButton";
import { cn } from "@/lib/utils";
import { getMockQuestions } from "@/lib/mockExamBank";
import { examDisplayName } from "@/lib/examCatalog";
import { useI18n } from "@/lib/i18n";

export interface MockExamResult {
  score: number;
  domains: { domain: string; answered: number; correct: number }[];
}

interface MockExamFlowProps {
  examCode: string;
  questionCount: number;
  minutes: number;
  onExit: (result?: MockExamResult) => void;
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MockExamFlow({ examCode, questionCount, minutes, onExit }: MockExamFlowProps) {
  const { t } = useI18n();
  const questions = useMemo(() => getMockQuestions(examCode, questionCount), [examCode, questionCount]);
  const [phase, setPhase] = useState<"confirm" | "running" | "results">("confirm");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(minutes * 60);
  const [confirmingSubmit, setConfirmingSubmit] = useState(false);

  useEffect(() => {
    if (phase !== "running") return;
    if (secondsRemaining <= 0) {
      setPhase("results");
      return;
    }
    const t = setTimeout(() => setSecondsRemaining((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, secondsRemaining]);

  const current = questions[currentIndex];
  const unansweredCount = questions.length - Object.keys(answers).length;

  const results = useMemo(() => {
    const domainMap = new Map<string, { correct: number; total: number; answered: number }>();
    let correct = 0;
    for (const q of questions) {
      const d = domainMap.get(q.domain) ?? { correct: 0, total: 0, answered: 0 };
      d.total++;
      const correctOption = q.options.find((o) => o.correct);
      const chosen = answers[q.id];
      if (chosen) {
        d.answered++;
        if (chosen === correctOption?.id) {
          d.correct++;
          correct++;
        }
      }
      domainMap.set(q.domain, d);
    }
    return {
      score: questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0,
      correct,
      total: questions.length,
      domains: Array.from(domainMap.entries()).map(([name, v]) => ({ name, ...v })),
    };
  }, [answers, questions]);

  if (phase === "confirm") {
    return (
      <div className="relative flex-1 overflow-y-auto bg-bg-primary bg-gradient-radial-glow">
        <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-16 text-center">
          <button
            onClick={() => onExit()}
            className="mb-8 flex items-center gap-1.5 self-start font-body text-sm text-text-tertiary hover:text-text-primary"
          >
            <ArrowLeft size={14} aria-hidden="true" /> {t("mockExam.backToPracticeExams")}
          </button>
          <GlassPanel className="w-full p-8">
            <p className="font-body text-label uppercase text-text-tertiary">{t("mockExam.mockExamLabel")}</p>
            <h1 className="mt-1 font-display text-h2 font-semibold text-text-primary">{examDisplayName(examCode)}</h1>
            <div className="mt-6 flex justify-center gap-10">
              <div>
                <p className="font-mono text-2xl font-semibold text-text-primary">{questions.length}</p>
                <p className="font-body text-caption text-text-tertiary">{t("mockExam.questionsLabel")}</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold text-text-primary">{minutes}</p>
                <p className="font-body text-caption text-text-tertiary">{t("mockExam.minutesLabel")}</p>
              </div>
            </div>
            <p className="mt-6 font-body text-sm text-text-secondary">{t("mockExam.practiceDisclaimer")}</p>
            <GradientButton onClick={() => setPhase("running")} className="mt-6 w-full">
              {t("mockExam.beginExam")}
            </GradientButton>
          </GlassPanel>
        </div>
      </div>
    );
  }

  if (phase === "running" && current) {
    const warning = secondsRemaining <= 120;
    return (
      <div className="flex h-full flex-1 flex-col bg-bg-primary bg-gradient-radial-glow">
        <div className="flex items-center justify-between gap-3 border-b border-border-secondary px-4 py-4 sm:px-8 sm:py-5">
          <div>
            <p className="font-display text-h4 font-semibold text-text-primary">{examDisplayName(examCode)}</p>
            <p className="font-body text-caption text-text-tertiary">
              {t("mockExam.questionProgress", { current: currentIndex + 1, total: questions.length })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-sm",
                warning
                  ? "border-status-error/40 bg-status-error/10 text-status-error"
                  : "border-border-primary bg-bg-tertiary/50 text-text-secondary"
              )}
            >
              <Clock size={14} aria-hidden="true" /> {formatTime(secondsRemaining)}
            </div>
            <button
              onClick={() => setConfirmingSubmit(true)}
              className="rounded-md border border-border-primary px-3 py-1.5 font-body text-sm text-text-secondary hover:text-text-primary"
            >
              {t("mockExam.submit")}
            </button>
          </div>
        </div>

        <div className="h-1 w-full bg-bg-tertiary">
          <div
            className="h-full bg-gradient-azure-violet transition-all duration-normal"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 flex flex-wrap gap-1.5">
              {questions.map((q, i) => {
                const isCurrent = i === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={t("mockExam.goToQuestion", { n: i + 1 })}
                    aria-current={isCurrent || undefined}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md font-mono text-xs transition-colors",
                      isCurrent && "ring-2 ring-azure-400",
                      flagged[q.id]
                        ? "bg-status-warning/20 text-status-warning"
                        : answers[q.id]
                        ? "bg-azure-500/20 text-azure-400"
                        : "bg-bg-tertiary text-text-tertiary"
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <GlassPanel className="p-6">
              <p className="mb-4 font-body text-label uppercase text-text-tertiary">{current.domain}</p>
              <p className="mb-5 font-display text-h4 font-medium leading-snug text-text-primary">
                {current.question}
              </p>
              <div className="flex flex-col gap-2.5">
                {current.options.map((opt) => {
                  const selected = answers[current.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setAnswers((a) => ({ ...a, [current.id]: opt.id }))}
                      className={cn(
                        "rounded-md border px-4 py-3 text-left font-body text-sm transition-all duration-fast",
                        selected
                          ? "border-azure-500/60 bg-azure-500/10 text-text-primary"
                          : "border-border-primary bg-bg-tertiary/50 text-text-secondary hover:border-azure-500/30"
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </GlassPanel>

            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 rounded-md border border-border-primary px-3 py-2 font-body text-sm text-text-secondary disabled:opacity-40"
              >
                <ChevronLeft size={14} aria-hidden="true" /> {t("mockExam.previous")}
              </button>

              <button
                onClick={() => setFlagged((f) => ({ ...f, [current.id]: !f[current.id] }))}
                className={cn(
                  "flex items-center gap-1.5 rounded-md border px-3 py-2 font-body text-sm",
                  flagged[current.id]
                    ? "border-status-warning/50 bg-status-warning/10 text-status-warning"
                    : "border-border-primary text-text-secondary"
                )}
              >
                <Flag size={14} aria-hidden="true" className="shrink-0" />
                <span className="hidden whitespace-nowrap sm:inline">
                  {flagged[current.id] ? t("mockExam.flagged") : t("mockExam.flagForReview")}
                </span>
                <span className="whitespace-nowrap sm:hidden">
                  {flagged[current.id] ? t("mockExam.flagged") : t("mockExam.flag")}
                </span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((i) => i + 1)}
                  className="flex items-center gap-1 rounded-md border border-border-primary px-3 py-2 font-body text-sm text-text-secondary"
                >
                  {t("mockExam.next")} <ChevronRight size={14} aria-hidden="true" />
                </button>
              ) : (
                <GradientButton onClick={() => setConfirmingSubmit(true)}>{t("mockExam.submitExam")}</GradientButton>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {confirmingSubmit && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setConfirmingSubmit(false)}
                className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-xs"
                aria-hidden="true"
              />
              <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    role="dialog"
                  aria-modal="true"
                  aria-label={t("mockExam.submitExamQuestion")}
                >
                  <GlassPanel className="w-full max-w-sm p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-status-warning" aria-hidden="true" />
                      <span className="font-display text-h4 font-semibold text-text-primary">
                        {t("mockExam.submitExamQuestion")}
                      </span>
                    </div>
                    <p className="mb-5 font-body text-sm text-text-secondary">
                      {unansweredCount > 0
                        ? unansweredCount === 1
                          ? t("mockExam.unansweredWarningOne")
                          : t("mockExam.unansweredWarning", { count: unansweredCount })
                        : ""}
                      {t("mockExam.cantChangeAnswers")}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmingSubmit(false)}
                        className="flex-1 rounded-md border border-border-primary py-2 font-body text-sm text-text-secondary hover:text-text-primary"
                      >
                        {t("mockExam.keepGoing")}
                      </button>
                      <GradientButton onClick={() => setPhase("results")} className="flex-1">
                        {t("mockExam.submit")}
                      </GradientButton>
                    </div>
                  </GlassPanel>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-y-auto bg-bg-primary bg-gradient-radial-glow">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-10">
        <button
          onClick={() =>
            onExit({
              score: results.score,
              domains: results.domains.map((d) => ({ domain: d.name, answered: d.answered, correct: d.correct })),
            })
          }
          className="mb-6 flex items-center gap-1.5 font-body text-sm text-text-tertiary hover:text-text-primary"
        >
          <ArrowLeft size={14} aria-hidden="true" /> {t("mockExam.backToPracticeExams")}
        </button>

        <GlassPanel interactive glow="azure" className="p-8 text-center">
          <p className="font-body text-label uppercase text-text-tertiary">
            {examDisplayName(examCode)} · {t("mockExam.resultsLabel")}
          </p>
          <p className="mt-2 font-display text-display font-semibold text-text-primary">{results.score}%</p>
          <p className="font-body text-sm text-text-secondary">
            {t("mockExam.correctOf", { correct: results.correct, total: results.total })}
          </p>
          <p className="mt-3 font-body text-caption text-text-tertiary">
            {t("mockExam.practiceScoreDisclaimer")}
          </p>
        </GlassPanel>

        <div className="mt-8 flex flex-col gap-2">
          <h2 className="mb-1 font-display text-h4 font-semibold text-text-primary">{t("mockExam.byDomain")}</h2>
          {results.domains.map((d) => (
            <GlassPanel key={d.name} className="flex items-center justify-between px-5 py-3">
              <span className="font-body text-sm text-text-primary">{d.name}</span>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-bg-tertiary">
                  <div
                    className="h-full rounded-full bg-gradient-azure-violet"
                    style={{ width: `${(d.correct / d.total) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-text-tertiary">
                  {d.correct}/{d.total}
                </span>
              </div>
            </GlassPanel>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <h2 className="font-display text-h4 font-semibold text-text-primary">{t("mockExam.review")}</h2>
          {questions.map((q, i) => {
            const chosen = answers[q.id];
            const correctOption = q.options.find((o) => o.correct);
            const isCorrect = chosen === correctOption?.id;
            return (
              <GlassPanel key={q.id} className="p-5">
                <div className="mb-2 flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-status-success" aria-hidden="true" />
                  ) : (
                    <XCircle size={16} className="mt-0.5 shrink-0 text-status-error" aria-hidden="true" />
                  )}
                  <p className="font-body text-sm font-medium text-text-primary">
                    {i + 1}. {q.question}
                  </p>
                </div>
                <p className="ml-6 font-body text-sm text-text-secondary">
                  {t("mockExam.yourAnswer", {
                    answer: chosen ? q.options.find((o) => o.id === chosen)?.label ?? "" : t("mockExam.notAnswered"),
                  })}
                </p>
                {!isCorrect && (
                  <p className="ml-6 font-body text-sm text-status-success">
                    {t("mockExam.correctAnswer", { answer: correctOption?.label ?? "" })}
                  </p>
                )}
                <p className="ml-6 mt-2 font-body text-sm text-text-tertiary">{q.explanation}</p>
              </GlassPanel>
            );
          })}
        </div>

        <GradientButton
          onClick={() =>
            onExit({
              score: results.score,
              domains: results.domains.map((d) => ({ domain: d.name, answered: d.answered, correct: d.correct })),
            })
          }
          className="mt-8 w-full"
        >
          {t("mockExam.backToPracticeExams")}
        </GradientButton>
      </div>
    </div>
  );
}
