import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useI18n } from "@/lib/i18n";

interface QuizOption {
  id: string;
  label: string;
  correct?: boolean;
}

interface InlineQuizProps {
  question: string;
  domain: string;
  options: QuizOption[];
}

export function InlineQuiz({ question, domain, options }: InlineQuizProps) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const answered = selected !== null;
  const correctOption = options.find((o) => o.correct);

  return (
    <GlassPanel className="w-full max-w-xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-azure-500/10 text-azure-400">
          <HelpCircle size={14} />
        </div>
        <span className="font-body text-label uppercase text-text-tertiary">
          {t("inlineQuiz.generatedQuiz", { domain })}
        </span>
      </div>

      <p className="mb-5 font-display text-h4 font-medium leading-snug text-text-primary">
        {question}
      </p>

      <div className="flex flex-col gap-2.5">
        {options.map((opt, i) => {
          const isSelected = selected === opt.id;
          const showCorrect = answered && opt.correct;
          const showWrong = answered && isSelected && !opt.correct;

          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              disabled={answered}
              onClick={() => setSelected(opt.id)}
              className={cn(
                "flex items-center justify-between rounded-md border px-4 py-3 text-left font-body text-sm transition-all duration-fast ease-premium",
                !answered &&
                  "border-border-primary bg-bg-tertiary/50 text-text-secondary hover:border-azure-500/50 hover:bg-bg-tertiary hover:text-text-primary",
                showCorrect &&
                  "border-status-success/50 bg-status-success/10 text-status-success",
                showWrong && "border-status-error/50 bg-status-error/10 text-status-error",
                answered &&
                  !showCorrect &&
                  !showWrong &&
                  "border-border-secondary text-text-tertiary opacity-60"
              )}
            >
              <span>{opt.label}</span>
              <AnimatePresence>
                {showCorrect && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 size={16} />
                  </motion.span>
                )}
                {showWrong && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <XCircle size={16} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 overflow-hidden rounded-md border border-border-secondary bg-bg-tertiary/40 px-4 py-3"
          >
            <p className="font-body text-sm text-text-secondary">
              <span className="font-medium text-text-primary">{t("inlineQuiz.correctAnswerPrefix")}</span>
              {correctOption?.label}
              {t("inlineQuiz.correctAnswerReview")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassPanel>
  );
}
