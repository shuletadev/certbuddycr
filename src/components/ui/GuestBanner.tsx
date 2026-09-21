import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { useI18n } from "@/lib/i18n";

interface GuestBannerProps {
  messageKey?: string;
  onSignInClick: () => void;
}

export function GuestBanner({ messageKey, onSignInClick }: GuestBannerProps) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassPanel className="mb-6 flex flex-wrap items-center justify-between gap-3 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <Lock size={14} className="text-text-tertiary" aria-hidden="true" />
          <p className="font-body text-sm text-text-secondary">{t(messageKey ?? "guest.defaultMessage")}</p>
        </div>
        <button
          onClick={onSignInClick}
          className="shrink-0 rounded-md border border-azure-500/40 bg-azure-500/10 px-3 py-1.5 font-body text-sm font-medium text-azure-400 transition-colors duration-fast hover:bg-azure-500/20"
        >
          {t("common.signIn")}
        </button>
      </GlassPanel>
    </motion.div>
  );
}
