import { motion } from "framer-motion";
import { LayoutGrid, MessagesSquare, BookOpen, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { View } from "./Sidebar";

const TABS: { icon: typeof LayoutGrid; labelKey: string; view: View }[] = [
  { icon: LayoutGrid, labelKey: "nav.dashboard", view: "dashboard" },
  { icon: MessagesSquare, labelKey: "nav.chat", view: "chat" },
  { icon: BookOpen, labelKey: "nav.exams", view: "exams" },
  { icon: Trophy, labelKey: "nav.achievements", view: "achievements" },
];

interface BottomNavProps {
  view: View;
  onChange: (view: View) => void;
}

export function BottomNav({ view, onChange }: BottomNavProps) {
  const { t } = useI18n();
  return (
    <nav
      aria-label={t("nav.primary")}
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border-secondary bg-bg-secondary/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-glass lg:hidden"
    >
      {TABS.map((tab) => {
        const active = tab.view === view;
        return (
          <button
            key={tab.view}
            onClick={() => onChange(tab.view)}
            aria-current={active ? "page" : undefined}
            className="relative flex flex-1 flex-col items-center gap-1 px-2 py-2.5 font-body text-[0.6875rem] font-medium text-text-tertiary transition-colors duration-fast"
          >
            {active && (
              <motion.div
                layoutId="bottom-nav-active"
                className="absolute top-0 h-0.5 w-8 rounded-full bg-gradient-azure-violet shadow-glow-azure"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <tab.icon
              size={20}
              aria-hidden="true"
              className={cn(active ? "text-azure-400" : "text-text-tertiary")}
            />
            <span className={cn(active && "text-text-primary")}>{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}
