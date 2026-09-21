import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2 } from "lucide-react";
import { PROMPT_TEMPLATES } from "@/lib/promptTemplates";
import { useI18n } from "@/lib/i18n";

const TEMPLATE_KEY_PREFIX: Record<string, string> = {
  "cram-plan": "cramPlan",
  "seven-day-plan": "sevenDayPlan",
  "practice-quiz": "practiceQuiz",
  "bank-practice": "bankPractice",
  "readiness-discussion": "readinessDiscussion",
  "outline-explanation": "outlineExplanation",
};

interface PromptGeneratorMenuProps {
  examCode: string;
  onPick: (prompt: string) => void;
}

export function PromptGeneratorMenu({ examCode, onPick }: PromptGeneratorMenuProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-md border border-border-primary bg-bg-tertiary/50 px-3 py-1.5 font-body text-xs font-medium text-text-secondary transition-colors duration-fast hover:border-azure-500/40 hover:text-text-primary"
      >
        <Wand2 size={13} aria-hidden="true" /> {t("promptMenu.button")}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-md border border-border-primary bg-bg-elevated/95 p-1.5 shadow-panel-lg backdrop-blur-glass"
          >
            {PROMPT_TEMPLATES.map((template) => {
              const prefix = TEMPLATE_KEY_PREFIX[template.id];
              return (
                <button
                  key={template.id}
                  onClick={() => {
                    onPick(template.build(examCode));
                    setOpen(false);
                  }}
                  className="flex w-full flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left transition-colors duration-fast hover:bg-bg-tertiary/60"
                >
                  <span className="font-body text-sm font-medium text-text-primary">
                    {t(`promptMenu.${prefix}.label`)}
                  </span>
                  <span className="font-body text-caption text-text-tertiary">
                    {t(`promptMenu.${prefix}.desc`)}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
