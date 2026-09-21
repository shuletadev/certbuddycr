import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, Eye, EyeOff, CheckCircle2, RotateCcw } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface ShortAnswerQuizProps {
  heading: string;
  instructions?: string;
  questions: string[];
  keyPoints?: string[][];
}

type SelfMark = "unmarked" | "got-it" | "review";

export function ShortAnswerQuiz({ heading, instructions, questions, keyPoints }: ShortAnswerQuizProps) {
  const { t } = useI18n();
  const [drafts, setDrafts] = useState<string[]>(() => questions.map(() => ""));
  const [revealed, setRevealed] = useState<boolean[]>(() => questions.map(() => false));
  const [marks, setMarks] = useState<SelfMark[]>(() => questions.map(() => "unmarked"));

  const markedCount = marks.filter((m) => m !== "unmarked").length;
  const reviewCount = marks.filter((m) => m === "review").length;

  return (
    <GlassPanel className="w-full max-w-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/10 text-violet-400">
            <ClipboardCheck size={14} aria-hidden="true" />
          </div>
          <span className="font-body text-label uppercase text-text-tertiary">
            {t("shortAnswer.selfCheckDrill", { heading })}
          </span>
        </div>
        <span className="font-mono text-xs text-text-tertiary">
          {markedCount}/{questions.length}
        </span>
      </div>

      {instructions && <p className="mb-5 font-body text-sm text-text-secondary">{instructions}</p>}

      <div className="flex flex-col gap-4">
        {questions.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "rounded-md border px-4 py-3 transition-colors duration-normal",
              marks[i] === "got-it" && "border-status-success/40 bg-status-success/5",
              marks[i] === "review" && "border-status-warning/40 bg-status-warning/5",
              marks[i] === "unmarked" && "border-border-primary bg-bg-tertiary/40"
            )}
          >
            <p className="font-body text-sm font-medium text-text-primary">
              {i + 1}. {q}
            </p>

            <textarea
              value={drafts[i]}
              onChange={(e) => setDrafts((d) => d.map((v, idx) => (idx === i ? e.target.value : v)))}
              rows={2}
              aria-label={t("shortAnswer.yourAnswerAria", { n: i + 1 })}
              placeholder={t("shortAnswer.answerPlaceholder")}
              className="mt-2 w-full resize-none rounded-md border border-border-secondary bg-bg-primary/40 px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-tertiary focus:border-azure-500/50 focus:outline-none"
            />

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {keyPoints?.[i] && (
                <button
                  onClick={() => setRevealed((r) => r.map((v, idx) => (idx === i ? !v : v)))}
                  className="flex items-center gap-1.5 rounded-full border border-border-primary bg-bg-tertiary/60 px-3 py-1 font-body text-xs font-medium text-text-secondary transition-colors hover:text-text-primary"
                >
                  {revealed[i] ? <EyeOff size={12} /> : <Eye size={12} />}
                  {revealed[i] ? t("shortAnswer.hideKeyPoints") : t("shortAnswer.revealKeyPoints")}
                </button>
              )}
              <button
                onClick={() => setMarks((m) => m.map((v, idx) => (idx === i ? "got-it" : v)))}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1 font-body text-xs font-medium transition-colors",
                  marks[i] === "got-it"
                    ? "border-status-success/50 bg-status-success/10 text-status-success"
                    : "border-border-primary bg-bg-tertiary/60 text-text-secondary hover:text-text-primary"
                )}
              >
                <CheckCircle2 size={12} /> {t("shortAnswer.gotIt")}
              </button>
              <button
                onClick={() => setMarks((m) => m.map((v, idx) => (idx === i ? "review" : v)))}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1 font-body text-xs font-medium transition-colors",
                  marks[i] === "review"
                    ? "border-status-warning/50 bg-status-warning/10 text-status-warning"
                    : "border-border-primary bg-bg-tertiary/60 text-text-secondary hover:text-text-primary"
                )}
              >
                <RotateCcw size={12} /> {t("shortAnswer.needReview")}
              </button>
            </div>

            <AnimatePresence>
              {revealed[i] && keyPoints?.[i] && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-3 list-disc space-y-1 overflow-hidden rounded-md border border-border-secondary bg-bg-primary/40 py-2 pl-8 pr-3 font-body text-sm text-text-secondary"
                >
                  {keyPoints[i].map((kp, kidx) => (
                    <li key={kidx}>{kp}</li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {markedCount === questions.length && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 font-body text-sm text-text-secondary"
        >
          {reviewCount > 0
            ? reviewCount === 1
              ? t("shortAnswer.flaggedForReviewOne")
              : t("shortAnswer.flaggedForReview", { count: reviewCount })
            : t("shortAnswer.allClear")}
        </motion.p>
      )}
    </GlassPanel>
  );
}
