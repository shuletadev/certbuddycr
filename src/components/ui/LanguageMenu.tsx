import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useDropdown } from "@/lib/useDropdown";
import { LANGUAGE_ORDER, LANGUAGE_LABEL, LANGUAGE_FLAG, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageMenuProps {
  className?: string;
  hideLabelBelow?: string;
  align?: "left" | "right";
}

export function LanguageMenu({ className, hideLabelBelow = "sm", align = "right" }: LanguageMenuProps) {
  const { t, language, setLanguage } = useI18n();
  const { open, openUpward, rootRef, toggle, close } = useDropdown(220);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("settings.language")}
        className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border-primary bg-bg-tertiary/50 px-2.5 py-2 font-body text-xs font-medium text-text-secondary transition-colors duration-fast hover:border-border-focus/60 hover:text-text-primary"
      >
        <span aria-hidden="true">{LANGUAGE_FLAG[language]}</span>
        <span className={cn(hideLabelBelow === "sm" && "hidden sm:inline")}>{language.toUpperCase()}</span>
        <ChevronDown
          size={12}
          className={cn("shrink-0 transition-transform duration-fast", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            aria-label={t("settings.language")}
            className={cn(
              "absolute z-50 w-40 overflow-hidden rounded-md border border-border-primary bg-bg-elevated/95 p-1 shadow-panel-lg backdrop-blur-glass",
              align === "right" ? "right-0" : "left-0",
              openUpward ? "bottom-full mb-2" : "top-full mt-2"
            )}
          >
            {LANGUAGE_ORDER.map((code) => {
              const active = code === language;
              return (
                <button
                  key={code}
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLanguage(code);
                    close();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left font-body text-sm transition-colors duration-fast",
                    active
                      ? "bg-azure-500/10 text-azure-400"
                      : "text-text-secondary hover:bg-bg-tertiary/60 hover:text-text-primary"
                  )}
                >
                  <span aria-hidden="true">{LANGUAGE_FLAG[code]}</span>
                  <span className="flex-1">{LANGUAGE_LABEL[code]}</span>
                  {active && <Check size={14} className="shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
