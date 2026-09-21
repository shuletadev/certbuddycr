import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, MessagesSquare, BookOpen, Trophy, Settings, Sparkles, X, Lock, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExamPicker } from "@/components/ui/ExamPicker";
import { TextSizeMenu } from "@/components/ui/TextSizeMenu";
import { LanguageMenu } from "@/components/ui/LanguageMenu";
import { isAuthenticated, type AuthState } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export type View = "dashboard" | "chat" | "exams" | "achievements" | "profile" | "settings";

const NAV_ITEMS: { icon: typeof LayoutGrid; labelKey: string; view: View | null }[] = [
  { icon: LayoutGrid, labelKey: "nav.dashboard", view: "dashboard" },
  { icon: MessagesSquare, labelKey: "nav.studyChat", view: "chat" },
  { icon: BookOpen, labelKey: "nav.practiceExams", view: "exams" },
  { icon: Trophy, labelKey: "nav.achievements", view: "achievements" },
];

interface SidebarProps {
  view: View;
  onChange: (view: View) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  activeExam: string;
  onExamChange: (code: string) => void;
  auth: AuthState;
  onSignInClick: () => void;
  onSignOut: () => void;
}

export function Sidebar({
  view,
  onChange,
  mobileOpen,
  onCloseMobile,
  activeExam,
  onExamChange,
  auth,
  onSignInClick,
  onSignOut,
}: SidebarProps) {
  const { t } = useI18n();

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full w-64 shrink-0 -translate-x-full flex-col justify-between border-r border-border-secondary bg-bg-secondary/95 px-4 py-6 transition-transform duration-normal ease-premium lg:static lg:translate-x-0 lg:bg-bg-secondary/80",
          mobileOpen && "translate-x-0"
        )}
      >
        <div>
          <div className="mb-10 flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-azure-violet shadow-glow-azure">
                <Sparkles size={16} className="text-white" aria-hidden="true" />
              </div>
              <span className="font-display text-[1.05rem] font-semibold tracking-tight text-text-primary">
                CertBuddy<span className="text-azure-500">CR</span>
              </span>
            </div>
            <button
              onClick={onCloseMobile}
              aria-label={t("common.closeMenu")}
              className="rounded-md p-1 text-text-tertiary hover:text-text-primary lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item, i) => {
              const active = item.view === view;
              return (
                <motion.button
                  key={item.labelKey}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    if (item.view) {
                      onChange(item.view);
                      onCloseMobile();
                    }
                  }}
                  disabled={!item.view}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-left font-body text-sm font-medium transition-colors duration-fast",
                    active ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
                    !item.view && "cursor-default opacity-50 hover:text-text-secondary"
                  )}
                >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-md border border-border-primary bg-bg-tertiary/80"
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                  <item.icon
                    size={17}
                    aria-hidden="true"
                    className={cn(
                      "relative z-10",
                      active ? "text-azure-400" : "text-text-tertiary group-hover:text-azure-400"
                    )}
                  />
                  <span className="relative z-10">{t(item.labelKey)}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-1.5 px-1 font-body text-label uppercase text-text-tertiary">{t("sidebar.studying")}</p>
            <ExamPicker value={activeExam} onChange={onExamChange} />
          </div>

          <div className="flex gap-2">
            <TextSizeMenu align="left" className="flex-1" />
            <LanguageMenu align="right" className="flex-1" />
          </div>

          <button
            onClick={() => {
              onChange("settings");
              onCloseMobile();
            }}
            aria-current={view === "settings" ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-left font-body text-sm font-medium transition-colors duration-fast",
              view === "settings" ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
            )}
          >
            <Settings size={17} className="text-text-tertiary" aria-hidden="true" />
            {t("nav.settings")}
          </button>

          {isAuthenticated(auth) ? (
            <div
              className={cn(
                "flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors duration-fast",
                view === "profile"
                  ? "border-azure-500/40 bg-azure-500/10"
                  : "border-border-secondary bg-bg-tertiary/40"
              )}
            >
              <button
                onClick={() => {
                  onChange("profile");
                  onCloseMobile();
                }}
                aria-current={view === "profile" ? "page" : undefined}
                aria-label={t("nav.profile")}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-azure-violet font-body text-sm font-semibold text-white">
                  {auth.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-body text-sm font-medium text-text-primary">{auth.username}</p>
                  <p className="truncate font-body text-xs text-text-tertiary">{t("sidebar.signedIn")}</p>
                </div>
              </button>
              <button
                onClick={onSignOut}
                aria-label={t("sidebar.logOut")}
                className="shrink-0 rounded p-1 text-text-tertiary hover:text-text-primary"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div
              className={cn(
                "flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors duration-fast",
                view === "profile"
                  ? "border-azure-500/40 bg-azure-500/10"
                  : "border-border-secondary bg-bg-tertiary/40"
              )}
            >
              <button
                onClick={() => {
                  onChange("profile");
                  onCloseMobile();
                }}
                aria-current={view === "profile" ? "page" : undefined}
                aria-label={t("nav.profile")}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-primary text-text-tertiary">
                  <Lock size={14} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-body text-sm font-medium text-text-primary">{t("sidebar.notSignedIn")}</p>
                  <p className="truncate font-body text-xs text-text-tertiary">{t("sidebar.sessionsNotSaved")}</p>
                </div>
              </button>
              <button
                onClick={onSignInClick}
                className="shrink-0 rounded-md border border-azure-500/40 bg-azure-500/10 px-2.5 py-1 font-body text-xs font-medium text-azure-400 hover:bg-azure-500/20"
              >
                {t("common.signIn")}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
