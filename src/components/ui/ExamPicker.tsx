import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Check } from "lucide-react";
import { EXAM_CATALOG, findExam } from "@/lib/examCatalog";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface ExamPickerProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

const DROPDOWN_HEIGHT_ESTIMATE = 320;

export function ExamPicker({ value, onChange, className }: ExamPickerProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [query, setQuery] = useState("");
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

  const handleToggle = () => {
    if (!open && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUpward(spaceBelow < DROPDOWN_HEIGHT_ESTIMATE && spaceAbove > spaceBelow);
    }
    setOpen((o) => !o);
  };

  const q = query.trim().toLowerCase();
  const filteredGroups = EXAM_CATALOG.map((g) => ({
    ...g,
    exams: g.exams.filter(
      (e) => !q || e.code.toLowerCase().includes(q) || e.name?.toLowerCase().includes(q)
    ),
  })).filter((g) => g.exams.length > 0);

  const selectedExam = findExam(value);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-border-primary bg-bg-tertiary/50 px-3 py-2 font-body text-sm text-text-primary transition-colors duration-fast hover:border-azure-500/40"
      >
        <span className="truncate">
          <span className="font-medium">{value}</span>
          {selectedExam?.name && <span className="text-text-tertiary"> · {selectedExam.name}</span>}
        </span>
        <ChevronDown size={14} className={cn("shrink-0 text-text-tertiary transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute left-0 z-50 w-72 overflow-hidden rounded-md border border-border-primary bg-bg-elevated/95 shadow-panel-lg backdrop-blur-glass",
              openUpward ? "bottom-full mb-2" : "top-full mt-2"
            )}
          >
            <div className="flex items-center gap-2 border-b border-border-secondary px-3 py-2">
              <Search size={14} className="text-text-tertiary" aria-hidden="true" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("examPicker.searchPlaceholder")}
                aria-label={t("examPicker.searchAriaLabel")}
                className="w-full bg-transparent font-body text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
              />
            </div>

            <div className="max-h-72 overflow-y-auto p-1.5">
              {filteredGroups.length === 0 && (
                <p className="px-3 py-4 text-center font-body text-sm text-text-tertiary">
                  {t("examPicker.noMatches")}
                </p>
              )}
              {filteredGroups.map((g) => (
                <div key={g.label} className="mb-1">
                  <p className="px-2 py-1 font-body text-label uppercase text-text-tertiary">{g.label}</p>
                  {g.exams.map((e) => {
                    const active = e.code === value;
                    return (
                      <button
                        key={e.code}
                        onClick={() => {
                          onChange(e.code);
                          setOpen(false);
                          setQuery("");
                        }}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left font-body text-sm transition-colors duration-fast",
                          active ? "bg-azure-500/10 text-azure-400" : "text-text-secondary hover:bg-bg-tertiary/60 hover:text-text-primary"
                        )}
                      >
                        <span className="truncate">
                          <span className="font-medium">{e.code}</span>
                          {e.name && <span className="text-text-tertiary"> · {e.name}</span>}
                        </span>
                        {active && <Check size={14} className="shrink-0" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
