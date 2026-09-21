import { useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";
import { activityDays, bucketFor } from "@/lib/activityData";
import { EVIDENCE_THRESHOLD } from "@/lib/domainEvidence";
import { useI18n } from "@/lib/i18n";

const DISPLAY_DAYS = 14;
const DAYS_PER_ROW = 7;
const START_IDX = activityDays.length - DISPLAY_DAYS;

const BUCKET_CLASS: Record<string, string> = {
  zero: "bg-bg-tertiary",
  low: "bg-azure-500/25",
  medium: "bg-azure-500/50",
  high: "bg-violet-500/60",
  peak: "bg-gradient-azure-violet shadow-glow-violet",
};

const LEGEND: { bucket: keyof typeof BUCKET_CLASS; labelKey: string }[] = [
  { bucket: "zero", labelKey: "heatmap.legend.zero" },
  { bucket: "low", labelKey: "heatmap.legend.low" },
  { bucket: "medium", labelKey: "heatmap.legend.medium" },
  { bucket: "high", labelKey: "heatmap.legend.high" },
  { bucket: "peak", labelKey: "heatmap.legend.peak" },
];

export function ActivityHeatmap() {
  const { t, localeTag } = useI18n();
  const [selected, setSelected] = useState(activityDays.length - 1);

  const dateFor = (indexFromToday: number) => {
    const date = new Date();
    date.setDate(date.getDate() - indexFromToday);
    return date;
  };

  const dayLabel = (indexFromToday: number) =>
    dateFor(indexFromToday).toLocaleDateString(localeTag, { weekday: "short", month: "short", day: "numeric" });

  const columnLabels = Array.from({ length: DAYS_PER_ROW }, (_, c) =>
    dateFor(DAYS_PER_ROW - 1 - c).toLocaleDateString(localeTag, { weekday: "short" })
  );

  const recentTotal = activityDays.slice(START_IDX).reduce((sum, d) => sum + d, 0);

  const selectedCount = activityDays[selected];
  const selectedBucket = bucketFor(selectedCount);
  const daysFromEnd = activityDays.length - 1 - selected;

  const rows = [0, 1].map((r) => ({
    labelKey: r === 0 ? "heatmap.lastWeek" : "heatmap.thisWeek",
    cells: Array.from({ length: DAYS_PER_ROW }, (_, c) => START_IDX + r * DAYS_PER_ROW + c),
  }));

  return (
    <GlassPanel interactive glow="violet" className="p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/10 text-violet-400">
              <Activity size={14} aria-hidden="true" />
            </div>
            <span className="font-body text-label uppercase text-text-tertiary">
              {t("heatmap.studyActivity", { days: DISPLAY_DAYS })}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold text-text-primary">{recentTotal}</span>
            <span className="font-body text-sm text-text-secondary">
              {t("heatmap.eventsInWindow", { days: DISPLAY_DAYS })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-10 shrink-0 sm:w-14" aria-hidden="true" />
          {columnLabels.map((label, i) => (
            <span
              key={i}
              className="w-7 shrink-0 text-center font-mono text-[0.65rem] uppercase text-text-tertiary sm:w-10"
            >
              {label[0]}
            </span>
          ))}
        </div>

        {rows.map((row) => (
          <div key={row.labelKey} className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-10 shrink-0 font-body text-xs text-text-tertiary sm:w-14">{t(row.labelKey)}</span>
            <div className="flex gap-1.5 sm:gap-2">
              {row.cells.map((idx, i) => {
                const count = activityDays[idx];
                const bucket = bucketFor(count);
                const isSelected = idx === selected;
                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setSelected(idx)}
                    aria-label={`${dayLabel(activityDays.length - 1 - idx)}: ${count} ${t("heatmap.events")}`}
                    aria-pressed={isSelected}
                    className={cn(
                      "h-7 w-7 shrink-0 rounded-lg transition-transform duration-fast hover:scale-110 sm:h-10 sm:w-10",
                      BUCKET_CLASS[bucket],
                      isSelected && "ring-2 ring-white/70 ring-offset-2 ring-offset-bg-elevated"
                    )}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-body text-sm text-text-secondary">
          {dayLabel(daysFromEnd)} · {selectedCount} {selectedCount === 1 ? t("heatmap.event") : t("heatmap.events")}
          {selectedBucket !== "zero" && selectedCount < EVIDENCE_THRESHOLD
            ? ` · ${t("heatmap.accuracyNote", { threshold: EVIDENCE_THRESHOLD })}`
            : ""}
        </p>
        <div className="flex items-center gap-2">
          {LEGEND.map((l) => (
            <div key={l.bucket} className="flex items-center gap-1">
              <span className={cn("h-2.5 w-2.5 rounded-[3px]", BUCKET_CLASS[l.bucket])} />
              <span className="font-body text-[0.65rem] text-text-tertiary">{t(l.labelKey)}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}
