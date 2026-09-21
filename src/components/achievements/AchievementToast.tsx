import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Achievement } from "@/lib/achievements";

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  const { t } = useI18n();

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          className="fixed right-4 top-4 z-[100] flex items-center gap-3 rounded-lg border border-violet-500/40 bg-bg-elevated/95 px-5 py-4 shadow-glow-violet-lg backdrop-blur-glass sm:right-8 sm:top-8"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gradient-azure-violet text-white shadow-glow-violet">
            <achievement.icon size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="font-body text-label uppercase text-violet-400">{t("achievements.toast.unlocked")}</p>
            <p className="font-display text-sm font-semibold text-text-primary">{t(achievement.titleKey)}</p>
          </div>
          <button
            onClick={onDismiss}
            aria-label={t("common.close")}
            className="ml-2 shrink-0 rounded p-1 text-text-tertiary hover:text-text-primary"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
