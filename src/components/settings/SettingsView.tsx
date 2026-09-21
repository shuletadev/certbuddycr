import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Globe,
  Download,
  ShieldCheck,
  Volume2,
  ChevronDown,
  LogOut,
  Copy,
  Check,
  Type,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GradientButton } from "@/components/ui/GradientButton";
import { GuestBanner } from "@/components/ui/GuestBanner";
import { isAuthenticated, generateMockRecoveryCode, type AuthState } from "@/lib/auth";
import { LIFETIME_STATS, TOKEN_LOG, TOTAL_TOKENS_USED, exportUsageCsv, downloadCsv } from "@/lib/usageStats";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { cn } from "@/lib/utils";
import { useI18n, LOCALE_TAG, LANGUAGE_ORDER, LANGUAGE_LABEL } from "@/lib/i18n";
import { useFontScale, FONT_SCALE_ORDER } from "@/lib/fontScale";

type Tab = "usage" | "display";

const DEFINITIONS = [
  { termKey: "settings.def.utcDay.term", defKey: "settings.def.utcDay.def" },
  { termKey: "settings.def.gradedAnswer.term", defKey: "settings.def.gradedAnswer.def" },
  { termKey: "settings.def.domainCoverage.term", defKey: "settings.def.domainCoverage.def" },
];

interface SettingsViewProps {
  auth: AuthState;
  onSignInClick: () => void;
  onSignOut: () => void;
}

export function SettingsView({ auth, onSignInClick, onSignOut }: SettingsViewProps) {
  const { t, language, setLanguage } = useI18n();
  const { fontScale, setFontScale } = useFontScale();
  const [tab, setTab] = useState<Tab>("usage");
  const [readAloud, setReadAloud] = useLocalStorage("readAloud", false);
  const [definitionsOpen, setDefinitionsOpen] = useState(false);
  const [newRecoveryCode, setNewRecoveryCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleReplaceRecoveryCode = () => {
    setNewRecoveryCode(generateMockRecoveryCode());
    setCopied(false);
  };

  const handleCopyRecoveryCode = () => {
    if (!newRecoveryCode) return;
    navigator.clipboard?.writeText(newRecoveryCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const totalTokens = TOTAL_TOKENS_USED;

  const handleTestVoice = () => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(t("settings.testVoiceUtterance"));
    utterance.lang = LOCALE_TAG[language];
    window.speechSynthesis.speak(utterance);
  };

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
            {t("settings.title")}
          </h1>
          <p className="mt-2 font-body text-body-lg text-text-secondary">{t("settings.subtitle")}</p>
        </motion.div>

        {!isAuthenticated(auth) && (
          <GuestBanner onSignInClick={onSignInClick} messageKey="guest.settingsMessage" />
        )}

        <div className="mb-6 flex gap-2 border-b border-border-secondary">
          {(["usage", "display"] as Tab[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={cn(
                "border-b-2 px-1 pb-3 font-body text-sm font-medium transition-colors",
                tab === tabKey
                  ? "border-azure-500 text-text-primary"
                  : "border-transparent text-text-tertiary hover:text-text-secondary"
              )}
            >
              {tabKey === "usage" ? t("settings.tabUsage") : t("settings.tabDisplay")}
            </button>
          ))}
        </div>

        {tab === "usage" && (
          <div className="flex flex-col gap-6">
            <GlassPanel className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-azure-500/10 text-azure-400">
                    <BarChart3 size={14} aria-hidden="true" />
                  </div>
                  <span className="font-body text-label uppercase text-text-tertiary">
                    {isAuthenticated(auth)
                      ? t("settings.signedInAs", { name: auth.username })
                      : t("settings.lifetimeActivity")}
                  </span>
                </div>
                {isAuthenticated(auth) && (
                  <button
                    onClick={onSignOut}
                    className="flex items-center gap-1.5 font-body text-sm text-text-tertiary hover:text-status-error"
                  >
                    <LogOut size={13} aria-hidden="true" /> {t("sidebar.logOut")}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="font-mono text-2xl font-semibold text-text-primary">{LIFETIME_STATS.examsStudied}</p>
                  <p className="font-body text-caption text-text-tertiary">{t("settings.examsStudied")}</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-semibold text-text-primary">{LIFETIME_STATS.savedChats}</p>
                  <p className="font-body text-caption text-text-tertiary">{t("settings.savedChats")}</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-semibold text-text-primary">
                    {LIFETIME_STATS.savedMockSessions}
                  </p>
                  <p className="font-body text-caption text-text-tertiary">{t("settings.savedMockSessions")}</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-semibold text-text-primary">
                    {LIFETIME_STATS.questionsAndMockAnswers}
                  </p>
                  <p className="font-body text-caption text-text-tertiary">{t("settings.questionsAndAnswers")}</p>
                </div>
              </div>
            </GlassPanel>

            <GlassPanel className="p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="whitespace-nowrap font-body text-label uppercase text-text-tertiary">
                  {t("settings.modelUsage", { days: 12 })}
                </span>
                <button
                  onClick={() => downloadCsv("certbuddycr-usage.csv", exportUsageCsv())}
                  className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-border-primary bg-bg-tertiary/50 px-3 py-1.5 font-body text-xs font-medium text-text-secondary transition-colors hover:border-azure-500/40 hover:text-text-primary"
                >
                  <Download size={12} aria-hidden="true" /> {t("settings.exportCsv")}
                </button>
              </div>
              <p className="mb-3 font-mono text-2xl font-semibold text-text-primary">
                {totalTokens.toLocaleString()}
                <span className="ml-1 text-sm font-normal text-text-tertiary">{t("settings.tokens")}</span>
              </p>
              <div className="flex flex-col gap-1.5">
                {TOKEN_LOG.map((r) => (
                  <div
                    key={r.date}
                    className="flex items-center justify-between border-b border-border-secondary/50 py-1.5 last:border-0"
                  >
                    <span className="font-body text-sm text-text-secondary">{r.date}</span>
                    <span className="font-mono text-xs text-text-tertiary">
                      {t("settings.requests", { count: r.requests })}
                    </span>
                    <span className="font-mono text-sm text-text-primary">{r.tokens.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-body text-caption text-text-tertiary">{t("settings.usageDisclaimer")}</p>
            </GlassPanel>

            <GlassPanel className="p-6">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck size={14} className="text-status-warning" aria-hidden="true" />
                <span className="font-body text-label uppercase text-text-tertiary">
                  {t("settings.accountRecovery")}
                </span>
              </div>
              <p className="font-body text-sm text-text-secondary">{t("settings.recoveryExplainer")}</p>
              {newRecoveryCode ? (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-status-warning/30 bg-status-warning/5 px-4 py-3">
                  <span className="font-mono text-sm font-medium tracking-wide text-text-primary">
                    {newRecoveryCode}
                  </span>
                  <button
                    onClick={handleCopyRecoveryCode}
                    aria-label={t("auth.copyRecoveryCode")}
                    className="flex items-center gap-1 rounded-md border border-border-primary bg-bg-tertiary/60 px-2 py-1 font-body text-xs text-text-secondary hover:text-text-primary"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? t("common.copied") : t("common.copy")}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleReplaceRecoveryCode}
                  className="mt-3 rounded-md border border-status-warning/40 bg-status-warning/10 px-3 py-1.5 font-body text-sm font-medium text-status-warning hover:bg-status-warning/20"
                >
                  {t("settings.replaceRecoveryCode")}
                </button>
              )}
            </GlassPanel>

            <GlassPanel className="p-6">
              <button
                onClick={() => setDefinitionsOpen((o) => !o)}
                className="flex w-full items-center justify-between"
              >
                <span className="font-body text-label uppercase text-text-tertiary">
                  {t("settings.technicalDefinitions")}
                </span>
                <ChevronDown
                  size={16}
                  className={cn("text-text-tertiary transition-transform", definitionsOpen && "rotate-180")}
                />
              </button>
              {definitionsOpen && (
                <div className="mt-4 flex flex-col gap-3">
                  {DEFINITIONS.map((d) => (
                    <div key={d.termKey}>
                      <p className="font-body text-sm font-medium text-text-primary">{t(d.termKey)}</p>
                      <p className="font-body text-sm text-text-secondary">{t(d.defKey)}</p>
                    </div>
                  ))}
                </div>
              )}
            </GlassPanel>
          </div>
        )}

        {tab === "display" && (
          <div className="flex flex-col gap-6">
            <GlassPanel className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/10 text-violet-400">
                  <Globe size={14} aria-hidden="true" />
                </div>
                <span className="font-body text-label uppercase text-text-tertiary">{t("settings.language")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_ORDER.map((code) => (
                  <button
                    key={code}
                    onClick={() => setLanguage(code)}
                    className={cn(
                      "rounded-md border px-4 py-2 font-body text-sm font-medium transition-colors",
                      language === code
                        ? "border-azure-500/60 bg-azure-500/10 text-azure-400"
                        : "border-border-primary bg-bg-tertiary/50 text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {LANGUAGE_LABEL[code]}
                  </button>
                ))}
              </div>
              <p className="mt-3 font-body text-caption text-text-tertiary">{t("settings.languageCaption")}</p>
            </GlassPanel>

            <GlassPanel className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-azure-500/10 text-azure-400">
                  <Type size={14} aria-hidden="true" />
                </div>
                <span className="font-body text-label uppercase text-text-tertiary">{t("settings.textSize")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {FONT_SCALE_ORDER.map((scale) => (
                  <button
                    key={scale}
                    onClick={() => setFontScale(scale)}
                    aria-pressed={fontScale === scale}
                    className={cn(
                      "rounded-md border px-4 py-2 font-body text-sm font-medium transition-colors",
                      fontScale === scale
                        ? "border-azure-500/60 bg-azure-500/10 text-azure-400"
                        : "border-border-primary bg-bg-tertiary/50 text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {t(`settings.textSize.${scale}`)}
                  </button>
                ))}
              </div>
              <p className="mt-3 font-body text-caption text-text-tertiary">{t("settings.textSizeCaption")}</p>
            </GlassPanel>

            <GlassPanel className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-azure-500/10 text-azure-400">
                    <Volume2 size={14} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium text-text-primary">{t("settings.readAloud")}</p>
                    <p className="font-body text-caption text-text-tertiary">{t("settings.readAloudCaption")}</p>
                  </div>
                </div>
                <button
                  onClick={() => setReadAloud((r) => !r)}
                  role="switch"
                  aria-checked={readAloud}
                  aria-label={t("settings.toggleReadAloud")}
                  className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                    readAloud ? "bg-gradient-azure-violet" : "bg-bg-tertiary"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                      readAloud ? "translate-x-[22px]" : "translate-x-0.5"
                    )}
                  />
                </button>
              </div>
              {readAloud && (
                <GradientButton onClick={handleTestVoice} variant="ghost" className="mt-4">
                  {t("settings.testVoice")}
                </GradientButton>
              )}
            </GlassPanel>

            <GlassPanel className="p-6">
              <p className="font-body text-label uppercase text-text-tertiary">{t("settings.theme")}</p>
              <p className="mt-2 font-body text-sm text-text-secondary">{t("settings.themeCaption")}</p>
            </GlassPanel>
          </div>
        )}
      </div>
    </div>
  );
}
