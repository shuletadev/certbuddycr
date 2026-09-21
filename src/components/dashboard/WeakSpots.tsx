import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { AzureIcon } from "@/components/ui/AzureIcon";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface DomainAccuracy {
  name: string;
  answered: number;
  correct: number;
  accuracy: number;
}

interface WeakSpotsProps {
  domains: DomainAccuracy[];
  onDrill: (domain: string) => void;
}

function accuracyColors(pct: number) {
  if (pct < 60) return { bar: "bg-status-error", text: "text-status-error" };
  if (pct < 80) return { bar: "bg-status-warning", text: "text-status-warning" };
  return { bar: "bg-status-success", text: "text-status-success" };
}

export function WeakSpots({ domains, onDrill }: WeakSpotsProps) {
  const { t } = useI18n();
  const withEvidence = [...domains].filter((d) => d.answered > 0).sort((a, b) => a.accuracy - b.accuracy);

  return (
    <GlassPanel className="p-6">
      <p className="font-body text-label uppercase text-text-tertiary">{t("dashboard.weakSpots.title")}</p>
      <p className="mb-5 mt-1 font-body text-sm text-text-secondary">{t("dashboard.weakSpots.subtitle")}</p>

      {withEvidence.length === 0 ? (
        <p className="font-body text-sm text-text-tertiary">{t("dashboard.weakSpots.empty")}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {withEvidence.map((d, i) => {
            const colors = accuracyColors(d.accuracy);
            return (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-bg-tertiary/60 p-1.5">
                  <AzureIcon name={d.name} className="h-full w-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-body text-sm text-text-primary">{d.name}</span>
                    <span className={cn("font-mono text-xs shrink-0", colors.text)}>
                      {t("dashboard.weakSpots.accuracy", { pct: d.accuracy })}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-bg-tertiary">
                    <div className={cn("h-full rounded-full", colors.bar)} style={{ width: `${d.accuracy}%` }} />
                  </div>
                </div>
                {i === 0 && (
                  <button
                    onClick={() => onDrill(d.name)}
                    className="shrink-0 self-start rounded-md border border-azure-500/40 bg-azure-500/10 px-2.5 py-1.5 font-body text-xs font-medium text-azure-400 transition-colors hover:bg-azure-500/20 sm:self-auto"
                  >
                    {t("dashboard.weakSpots.drill")}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </GlassPanel>
  );
}
