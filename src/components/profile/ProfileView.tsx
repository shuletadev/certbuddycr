import { motion } from "framer-motion";
import { Check, Lock, LogOut } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GradientButton } from "@/components/ui/GradientButton";
import { GuestBanner } from "@/components/ui/GuestBanner";
import { isAuthenticated, type AuthState } from "@/lib/auth";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { CERT_TRACKS, CERT_TRACK_ORDER, type CertTrackId } from "@/lib/certPath";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface ProfileViewProps {
  auth: AuthState;
  onSignInClick: () => void;
  onSignOut: () => void;
}

const TRACK_DESC_KEY: Record<CertTrackId, string> = {
  azure: "profile.track.azure.desc",
  ai: "profile.track.ai.desc",
  security: "profile.track.security.desc",
};

export function ProfileView({ auth, onSignInClick, onSignOut }: ProfileViewProps) {
  const { t } = useI18n();
  const [certTrack, setCertTrack] = useLocalStorage<CertTrackId>("selectedCertTrack", "azure");

  return (
    <div className="relative flex-1 overflow-y-auto bg-bg-primary bg-gradient-radial-glow">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-h1">
            {t("profile.title")}
          </h1>
          <p className="mt-2 font-body text-body-lg text-text-secondary">{t("profile.subtitle")}</p>
        </motion.div>

        {!isAuthenticated(auth) && <GuestBanner onSignInClick={onSignInClick} messageKey="guest.profileMessage" />}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mb-6 mt-6"
        >
          <GlassPanel className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {isAuthenticated(auth) ? (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-azure-violet font-display text-lg font-semibold text-white">
                  {auth.username.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-primary text-text-tertiary">
                  <Lock size={18} aria-hidden="true" />
                </div>
              )}
              <div>
                <p className="font-body text-base font-medium text-text-primary">
                  {isAuthenticated(auth) ? auth.username : t("sidebar.notSignedIn")}
                </p>
                <p className="font-body text-sm text-text-tertiary">
                  {isAuthenticated(auth) ? t("sidebar.signedIn") : t("sidebar.sessionsNotSaved")}
                </p>
              </div>
            </div>
            {isAuthenticated(auth) ? (
              <button
                onClick={onSignOut}
                className="flex items-center justify-center gap-1.5 self-start rounded-md border border-border-primary bg-bg-tertiary/50 px-3 py-2 font-body text-sm font-medium text-text-secondary transition-colors hover:border-status-error/40 hover:text-status-error sm:self-auto"
              >
                <LogOut size={14} aria-hidden="true" /> {t("sidebar.logOut")}
              </button>
            ) : (
              <GradientButton onClick={onSignInClick} className="self-start sm:self-auto">
                {t("common.signIn")}
              </GradientButton>
            )}
          </GlassPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <GlassPanel className="p-6">
            <p className="font-body text-label uppercase text-text-tertiary">{t("profile.goalEyebrow")}</p>
            <h2 className="mt-1 font-display text-h4 font-semibold text-text-primary">{t("profile.goalTitle")}</h2>
            <p className="mt-1 font-body text-sm text-text-secondary">{t("profile.goalCaption")}</p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {CERT_TRACK_ORDER.map((id) => {
                const track = CERT_TRACKS[id];
                const active = id === certTrack;
                return (
                  <button
                    key={id}
                    onClick={() => setCertTrack(id)}
                    aria-pressed={active}
                    className={cn(
                      "relative flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all duration-fast",
                      active
                        ? "border-azure-500/60 bg-azure-500/10 shadow-glow-azure"
                        : "border-border-primary bg-bg-tertiary/40 hover:border-border-focus/60"
                    )}
                  >
                    {active && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-azure-500 text-white">
                        <Check size={12} aria-hidden="true" />
                      </span>
                    )}
                    <img src={track.icon} alt="" aria-hidden="true" className="h-8 w-8" />
                    <p className="font-display text-sm font-semibold text-text-primary">{t(track.labelKey)}</p>
                    <p className="font-body text-xs text-text-secondary">{t(TRACK_DESC_KEY[id])}</p>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 font-body text-caption text-text-tertiary">{t("profile.goalNote")}</p>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
