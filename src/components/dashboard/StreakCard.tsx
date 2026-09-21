import { Flame } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { activityDays, computeStreaks } from "@/lib/activityData";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function StreakCard() {
  const { t } = useI18n();
  const { current, best, studyDays, gradedAnswers } = computeStreaks(activityDays);

  return (
    <GlassPanel interactive glow="violet" className="flex flex-col p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-body text-label uppercase text-text-tertiary">{t("streak.momentum")}</p>
          <p className="font-display text-h4 font-semibold text-text-primary">{t("streak.studyStreak")}</p>
        </div>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md bg-violet-500/10 text-violet-400",
            current > 0 && "animate-pulse-glow shadow-glow-violet"
          )}
        >
          <Flame size={16} />
        </div>
      </div>

      <div className="flex items-end gap-2">
        <span className="font-mono text-h2 font-semibold text-text-primary">{current}</span>
        <span className="mb-1.5 font-mono text-sm text-text-tertiary">
          {current === 1 ? t("streak.dayInARow") : t("streak.daysInARow")}
        </span>
      </div>

      <p className="mt-2 font-body text-caption text-text-tertiary">
        {current > 0 ? t("streak.keepItAlive") : t("streak.startStreak")}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border-secondary pt-5">
        <div>
          <p className="font-mono text-lg font-semibold text-text-primary">{best}</p>
          <p className="font-body text-caption text-text-tertiary">{t("streak.bestStreak")}</p>
        </div>
        <div>
          <p className="font-mono text-lg font-semibold text-text-primary">{studyDays}</p>
          <p className="font-body text-caption text-text-tertiary">{t("streak.studyDays")}</p>
        </div>
        <div>
          <p className="font-mono text-lg font-semibold text-text-primary">{gradedAnswers}</p>
          <p className="font-body text-caption text-text-tertiary">{t("streak.questionsAnswered")}</p>
        </div>
      </div>
    </GlassPanel>
  );
}
