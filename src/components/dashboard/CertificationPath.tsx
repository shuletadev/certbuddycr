import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { CertBadge } from "./CertBadge";
import { cn } from "@/lib/utils";
import { CERT_TRACKS, computeCertPathStatuses, type CertNodeStatus, type CertTier, type CertTrackId } from "@/lib/certPath";
import type { ExamEntry } from "@/lib/practiceExams";
import { useI18n } from "@/lib/i18n";

interface CertificationPathProps {
  trackId: CertTrackId;
  exams: ExamEntry[];
  onSelectNode: (code: string) => void;
}

const TIER_ORDER: CertTier[] = ["fundamentals", "associate", "expert"];

const STATUS_LABEL_KEY: Record<CertNodeStatus, string> = {
  completed: "certPath.status.completed",
  available: "certPath.status.available",
  locked: "certPath.status.locked",
};

const TIER_LABEL_KEY: Record<CertTier, string> = {
  fundamentals: "certPath.tier.fundamentals",
  associate: "certPath.tier.associate",
  expert: "certPath.tier.expert",
};

function CertNode({
  code,
  name,
  status,
  onSelectNode,
  index,
}: {
  code: string;
  name: string;
  status: CertNodeStatus;
  onSelectNode: (code: string) => void;
  index: number;
}) {
  const { t } = useI18n();
  return (
    <motion.button
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.08 * index, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelectNode(code)}
      className={cn(
        "flex w-[132px] flex-col items-center gap-2 rounded-lg border p-3 text-center transition-transform duration-fast hover:-translate-y-0.5 sm:w-[148px]",
        status === "completed" && "border-violet-500/40 bg-violet-500/10 shadow-glow-violet",
        status === "available" && "animate-pulse-glow border-azure-500/50 bg-azure-500/10",
        status === "locked" && "border-border-secondary bg-bg-tertiary/40 opacity-60"
      )}
    >
      <CertBadge status={status} className="h-10 w-10" />
      <div>
        <p className="font-mono text-xs font-semibold text-text-primary">{code}</p>
        <p className="font-body text-[0.7rem] leading-snug text-text-tertiary">{name}</p>
      </div>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 font-body text-[0.6rem] uppercase tracking-wide",
          status === "completed" && "bg-violet-500/20 text-violet-400",
          status === "available" && "bg-azure-500/20 text-azure-400",
          status === "locked" && "bg-bg-tertiary text-text-tertiary"
        )}
      >
        {t(STATUS_LABEL_KEY[status])}
      </span>
    </motion.button>
  );
}

export function CertificationPath({ trackId, exams, onSelectNode }: CertificationPathProps) {
  const { t } = useI18n();
  const track = CERT_TRACKS[trackId];
  const statuses = computeCertPathStatuses(trackId, exams);

  return (
    <GlassPanel interactive glow="azure" className="overflow-hidden p-6 sm:p-8">
      <div className="mb-6">
        <p className="font-body text-label uppercase text-text-tertiary">{t("certPath.eyebrow")}</p>
        <h3 className="font-display text-h4 font-semibold text-text-primary">
          {t("certPath.title", { track: t(track.labelKey) })}
        </h3>
      </div>

      <div className="relative flex flex-col items-center gap-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-2 bottom-2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-azure-500/40 via-violet-500/30 to-transparent sm:block"
        />
        {TIER_ORDER.map((tier) => {
          const nodes = track.nodes.filter((n) => n.tier === tier);
          if (nodes.length === 0) return null;
          return (
            <div key={tier} className="relative z-10 flex flex-col items-center gap-3">
              <span className="font-body text-[0.65rem] uppercase tracking-wider text-text-tertiary">
                {t(TIER_LABEL_KEY[tier])}
              </span>
              <div className="flex flex-wrap items-stretch justify-center gap-3">
                {nodes.map((node, i) => (
                  <CertNode
                    key={node.code}
                    code={node.code}
                    name={node.name}
                    status={statuses[node.code]}
                    onSelectNode={onSelectNode}
                    index={i}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
