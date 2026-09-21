import { useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Menu, Sparkles } from "lucide-react";
import { Sidebar, type View } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { PracticeExams } from "@/components/exams/PracticeExams";
import { Achievements } from "@/components/achievements/Achievements";
import { AuthModal } from "@/components/auth/AuthModal";
import { SettingsView } from "@/components/settings/SettingsView";
import { ProfileView } from "@/components/profile/ProfileView";
import { LandingPage } from "@/components/landing/LandingPage";
import { GUEST, isAuthenticated, type AuthState } from "@/lib/auth";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { PROMPT_TEMPLATES } from "@/lib/promptTemplates";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { FontScaleProvider } from "@/lib/fontScale";

export default function App() {
  return (
    <I18nProvider>
      <FontScaleProvider>
        <AppShell />
      </FontScaleProvider>
    </I18nProvider>
  );
}

function AppShell() {
  const { t } = useI18n();
  const [view, setView] = useState<View>("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeExam, setActiveExam] = useLocalStorage("activeExam", "AZ-900");
  const [auth, setAuth] = useLocalStorage<AuthState>("auth", GUEST);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingChatPrompt, setPendingChatPrompt] = useState<string | null>(null);
  const [hasEnteredApp, setHasEnteredApp] = useState(false);

  const goToChat = (prompt?: string) => {
    if (prompt) setPendingChatPrompt(prompt);
    setView("chat");
  };

  const handleAuthenticated = (username: string) => {
    setAuth({ status: "authenticated", username });
    setAuthModalOpen(false);
  };

  const showLanding = !isAuthenticated(auth) && !hasEnteredApp;

  return (
    <MotionConfig reducedMotion="user">
    <AuthModal
      open={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      onAuthenticated={handleAuthenticated}
    />
    {showLanding ? (
      <LandingPage onSignIn={() => setAuthModalOpen(true)} onContinueAsGuest={() => setHasEnteredApp(true)} />
    ) : (
    <div className="flex h-screen w-full overflow-hidden bg-bg-primary">
      <Sidebar
        view={view}
        onChange={setView}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        activeExam={activeExam}
        onExamChange={setActiveExam}
        auth={auth}
        onSignInClick={() => setAuthModalOpen(true)}
        onSignOut={() => setAuth(GUEST)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border-secondary px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label={t("common.openMenu")}
            className="rounded-md p-2 text-text-secondary hover:text-text-primary"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-azure-violet">
              <Sparkles size={12} className="text-white" aria-hidden="true" />
            </div>
            <span className="font-display text-sm font-semibold text-text-primary">
              CertBuddy<span className="text-azure-500">CR</span>
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.main
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-1 overflow-hidden pb-16 lg:pb-0"
          >
            {view === "dashboard" && (
              <Dashboard
                examCode={activeExam}
                auth={auth}
                onSignInClick={() => setAuthModalOpen(true)}
                onResumeStudying={() => goToChat()}
                onViewStudyPlan={() =>
                  goToChat(PROMPT_TEMPLATES.find((t) => t.id === "seven-day-plan")?.build(activeExam))
                }
                onGoToExams={() => setView("exams")}
                onDrillDomain={(domain) =>
                  goToChat(`Quiz me on ${domain} for ${activeExam}, focused on my weakest areas there.`)
                }
              />
            )}
            {view === "chat" && (
              <ChatInterface
                auth={auth}
                onSignInClick={() => setAuthModalOpen(true)}
                initialPrompt={pendingChatPrompt}
                onInitialPromptConsumed={() => setPendingChatPrompt(null)}
              />
            )}
            {view === "exams" && <PracticeExams />}
            {view === "achievements" && <Achievements />}
            {view === "profile" && (
              <ProfileView auth={auth} onSignInClick={() => setAuthModalOpen(true)} onSignOut={() => setAuth(GUEST)} />
            )}
            {view === "settings" && (
              <SettingsView
                auth={auth}
                onSignInClick={() => setAuthModalOpen(true)}
                onSignOut={() => setAuth(GUEST)}
              />
            )}
          </motion.main>
        </AnimatePresence>
      </div>

      <BottomNav view={view} onChange={setView} />
    </div>
    )}
    </MotionConfig>
  );
}
