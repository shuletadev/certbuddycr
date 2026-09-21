import { CheckCircle2, Sparkles, Lock } from "lucide-react";
import type { CertNodeStatus } from "@/lib/certPath";
import { cn } from "@/lib/utils";

interface CertBadgeProps {
  status: CertNodeStatus;
  className?: string;
}

// Original shield-badge artwork (not a reproduction of any Microsoft credential asset) —
// distinct silhouette on purpose so it never reads as an official certification badge.
const SHIELD_PATH = "M20 2 L36 8 V21 C36 31.5 29 39.5 20 42.5 C11 39.5 4 31.5 4 21 V8 Z";

export function CertBadge({ status, className }: CertBadgeProps) {
  return (
    <div className={cn("relative flex shrink-0 items-center justify-center", className)}>
      <svg viewBox="0 0 40 44" className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="certBadgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2F81FF" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
        <path
          d={SHIELD_PATH}
          fill={
            status === "completed"
              ? "url(#certBadgeGradient)"
              : status === "available"
                ? "rgba(47,129,255,0.14)"
                : "rgba(35,39,47,0.75)"
          }
          stroke={status === "completed" ? "rgba(255,255,255,0.4)" : status === "available" ? "#2F81FF" : "#3A3F4B"}
          strokeWidth={status === "available" ? 1.75 : 1.25}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pb-1.5">
        {status === "completed" && <CheckCircle2 size={16} className="text-white" aria-hidden="true" />}
        {status === "available" && <Sparkles size={15} className="text-azure-400" aria-hidden="true" />}
        {status === "locked" && <Lock size={13} className="text-text-tertiary" aria-hidden="true" />}
      </div>
    </div>
  );
}
