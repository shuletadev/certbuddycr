import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Copy, Check, ShieldAlert } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GradientButton } from "@/components/ui/GradientButton";
import { generateMockRecoveryCode } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type Mode = "login" | "signup" | "forgot" | "recovery-reveal";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated: (username: string) => void;
}

export function AuthModal({ open, onClose, onAuthenticated }: AuthModalProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryCode] = useState(generateMockRecoveryCode);
  const [savedRecoveryCode, setSavedRecoveryCode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setMode("login");
      setUsername("");
      setPassword("");
      setSavedRecoveryCode(false);
      setCopied(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mode !== "recovery-reveal") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, mode, onClose]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    onAuthenticated(username.trim());
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setMode("recovery-reveal");
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(recoveryCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={mode === "recovery-reveal" ? undefined : onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-xs"
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label={mode === "recovery-reveal" ? t("auth.saveRecoveryCode") : t("auth.signInDialogLabel")}
            >
              <GlassPanel className="w-full max-w-sm p-6 shadow-panel-lg">
                {mode !== "recovery-reveal" && (
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-azure-500/10 text-azure-400">
                        <Lock size={15} aria-hidden="true" />
                      </div>
                      <span className="font-display text-h4 font-semibold text-text-primary">
                        {mode === "login" && t("auth.welcomeBack")}
                        {mode === "signup" && t("auth.createAccount")}
                        {mode === "forgot" && t("auth.resetPassword")}
                      </span>
                    </div>
                    <button
                      onClick={onClose}
                      aria-label={t("common.close")}
                      className="rounded-md p-1 text-text-tertiary hover:text-text-primary"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                {mode === "login" && (
                  <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <p className="-mt-2 font-body text-sm text-text-secondary">{t("auth.loginIntro")}</p>
                    <label className="flex flex-col gap-1.5">
                      <span className="font-body text-sm font-medium text-text-primary">{t("auth.username")}</span>
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                        className="rounded-md border border-border-secondary bg-bg-primary/40 px-3 py-2 font-body text-base text-text-primary focus:border-azure-500/50 focus:outline-none sm:text-sm"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="font-body text-sm font-medium text-text-primary">{t("auth.password")}</span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-md border border-border-secondary bg-bg-primary/40 px-3 py-2 font-body text-base text-text-primary focus:border-azure-500/50 focus:outline-none sm:text-sm"
                      />
                    </label>
                    <GradientButton type="submit" className="mt-1">
                      {t("auth.logIn")}
                    </GradientButton>
                    <div className="flex flex-col items-start gap-2 font-body text-sm">
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="text-azure-400 hover:text-azure-400/80"
                      >
                        {t("auth.createAccountInstead")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-text-tertiary hover:text-text-secondary"
                      >
                        {t("auth.forgotPassword")}
                      </button>
                    </div>
                  </form>
                )}

                {mode === "signup" && (
                  <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
                    <p className="-mt-2 font-body text-sm text-text-secondary">{t("auth.signupIntro")}</p>
                    <label className="flex flex-col gap-1.5">
                      <span className="font-body text-sm font-medium text-text-primary">{t("auth.username")}</span>
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                        className="rounded-md border border-border-secondary bg-bg-primary/40 px-3 py-2 font-body text-base text-text-primary focus:border-azure-500/50 focus:outline-none sm:text-sm"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="font-body text-sm font-medium text-text-primary">{t("auth.password")}</span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-md border border-border-secondary bg-bg-primary/40 px-3 py-2 font-body text-base text-text-primary focus:border-azure-500/50 focus:outline-none sm:text-sm"
                      />
                    </label>
                    <GradientButton type="submit" className="mt-1">
                      {t("common.continue")}
                    </GradientButton>
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="font-body text-sm text-azure-400 hover:text-azure-400/80"
                    >
                      {t("auth.alreadyHaveAccount")}
                    </button>
                  </form>
                )}

                {mode === "forgot" && (
                  <div className="flex flex-col gap-4">
                    <p className="-mt-2 font-body text-sm text-text-secondary">{t("auth.forgotIntro")}</p>
                    <label className="flex flex-col gap-1.5">
                      <span className="font-body text-sm font-medium text-text-primary">{t("auth.username")}</span>
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                        className="rounded-md border border-border-secondary bg-bg-primary/40 px-3 py-2 font-body text-base text-text-primary focus:border-azure-500/50 focus:outline-none sm:text-sm"
                      />
                    </label>
                    <GradientButton onClick={() => setMode("login")}>
                      {t("auth.continueWithRecoveryCode")}
                    </GradientButton>
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="font-body text-sm text-text-tertiary hover:text-text-secondary"
                    >
                      {t("auth.backToLogin")}
                    </button>
                  </div>
                )}

                {mode === "recovery-reveal" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-status-warning/10 text-status-warning">
                        <ShieldAlert size={15} aria-hidden="true" />
                      </div>
                      <span className="font-display text-h4 font-semibold text-text-primary">
                        {t("auth.saveRecoveryCode")}
                      </span>
                    </div>
                    <p className="font-body text-sm text-text-secondary">{t("auth.recoveryCodeWarning")}</p>
                    <div className="flex items-center justify-between gap-3 rounded-md border border-status-warning/30 bg-status-warning/5 px-4 py-3">
                      <span className="font-mono text-sm font-medium tracking-wide text-text-primary">
                        {recoveryCode}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        aria-label={t("auth.copyRecoveryCode")}
                        className="flex items-center gap-1 rounded-md border border-border-primary bg-bg-tertiary/60 px-2 py-1 font-body text-xs text-text-secondary hover:text-text-primary"
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? t("common.copied") : t("common.copy")}
                      </button>
                    </div>
                    <label className="flex items-start gap-2 font-body text-sm text-text-secondary">
                      <input
                        type="checkbox"
                        checked={savedRecoveryCode}
                        onChange={(e) => setSavedRecoveryCode(e.target.checked)}
                        className="mt-0.5 accent-azure-500"
                      />
                      {t("auth.savedRecoveryCodeCheckbox")}
                    </label>
                    <GradientButton
                      disabled={!savedRecoveryCode}
                      onClick={() => onAuthenticated(username.trim())}
                      className={cn(!savedRecoveryCode && "cursor-not-allowed opacity-40")}
                    >
                      {t("common.continue")}
                    </GradientButton>
                  </div>
                )}
              </GlassPanel>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
