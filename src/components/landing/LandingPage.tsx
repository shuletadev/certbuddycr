import { motion } from "framer-motion";
import { Sparkles, MessageSquare, Target, Flame, Timer, ArrowUpRight } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GradientButton } from "@/components/ui/GradientButton";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { TextSizeMenu } from "@/components/ui/TextSizeMenu";
import { LanguageMenu } from "@/components/ui/LanguageMenu";
import { CertificationPath } from "@/components/dashboard/CertificationPath";
import { INITIAL_EXAMS } from "@/lib/practiceExams";
import { ALL_EXAMS, EXAM_CATALOG } from "@/lib/examCatalog";
import { LOCALE_TAG, useI18n } from "@/lib/i18n";

interface LandingPageProps {
  onSignIn: () => void;
  onContinueAsGuest: () => void;
}

const FEATURE_ICONS = [MessageSquare, Target, Flame, Timer];
const FEATURE_KEYS = ["chat", "weakSpots", "streaks", "mockExams"];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function LandingPage({ onSignIn, onContinueAsGuest }: LandingPageProps) {
  const { t } = useI18n();
  const certCount = ALL_EXAMS.length;
  const trackCount = EXAM_CATALOG.length;
  const languageCount = Object.keys(LOCALE_TAG).length;

  return (
    <div className="relative h-full flex-1 overflow-y-auto bg-bg-primary">
      <AmbientGlow />

      <header className="relative flex items-center justify-between px-5 py-5 sm:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-azure-violet">
            <Sparkles size={14} className="text-white" aria-hidden="true" />
          </div>
          <span className="font-display text-base font-semibold text-text-primary">
            CertBuddy<span className="text-azure-500">CR</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageMenu />
          <TextSizeMenu />
          <GradientButton variant="ghost" onClick={onSignIn} className="!py-2">
            {t("landing.signIn")}
          </GradientButton>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-5 pb-24 pt-8 sm:px-10">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
        >
          <span className="mb-5 flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 font-body text-xs font-medium text-violet-400">
            <Sparkles size={12} aria-hidden="true" />
            {t("landing.eyebrow")}
          </span>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            {t("landing.headline")}
          </h1>
          <p className="mt-5 max-w-xl font-body text-body-lg text-text-secondary">{t("landing.subheadline")}</p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <GradientButton onClick={onContinueAsGuest} className="px-6 py-3 text-base">
              {t("landing.ctaPrimary")} <ArrowUpRight size={16} className="ml-1 inline" aria-hidden="true" />
            </GradientButton>
            <GradientButton variant="ghost" onClick={onSignIn} className="px-6 py-3 text-base">
              {t("landing.ctaSecondary")}
            </GradientButton>
          </div>
          <p className="mt-4 font-body text-xs text-text-tertiary">{t("landing.trustLine")}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-3"
        >
          {[
            { value: certCount, labelKey: "landing.statCerts" },
            { value: trackCount, labelKey: "landing.statTracks" },
            { value: languageCount, labelKey: "landing.statLanguages" },
          ].map((s) => (
            <div key={s.labelKey} className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-semibold text-text-primary">{s.value}</span>
              <span className="font-body text-sm text-text-tertiary">{t(s.labelKey)}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-16"
        >
          <CertificationPath trackId="azure" exams={INITIAL_EXAMS} onSelectNode={onContinueAsGuest} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <GlassPanel className="flex flex-col gap-4 p-6 sm:p-7">
            <p className="font-body text-label uppercase text-text-tertiary">{t("landing.chatPreviewEyebrow")}</p>
            <div className="flex justify-end">
              <div className="max-w-[85%] whitespace-pre-wrap rounded-lg bg-gradient-azure-violet px-4 py-3 font-body text-sm text-white shadow-glow-azure">
                {t("landing.chatPreviewUser")}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg border border-border-primary bg-bg-elevated/70 px-4 py-3 font-body text-sm text-text-primary backdrop-blur-glass">
                {t("landing.chatPreviewAssistant")}
              </div>
            </div>
          </GlassPanel>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FEATURE_KEYS.map((key, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <GlassPanel key={key} interactive glow="azure" className="flex flex-col gap-3 p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-azure-500/10 text-azure-400">
                    <Icon size={16} aria-hidden="true" />
                  </div>
                  <p className="font-display text-sm font-semibold text-text-primary">
                    {t(`landing.feature.${key}.title`)}
                  </p>
                  <p className="font-body text-xs text-text-secondary">{t(`landing.feature.${key}.desc`)}</p>
                </GlassPanel>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="mt-16 flex flex-col items-center gap-4 text-center"
        >
          <h2 className="font-display text-2xl font-semibold text-text-primary">{t("landing.closingHeadline")}</h2>
          <GradientButton onClick={onContinueAsGuest} className="px-6 py-3 text-base">
            {t("landing.ctaPrimary")}
          </GradientButton>
          <p className="font-body text-xs text-text-tertiary">{t("landing.closingSubline")}</p>
        </motion.div>
      </main>
    </div>
  );
}
