import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  SendHorizontal,
  FileText,
  ListChecks,
  Paperclip,
  PanelLeft,
  Mic,
  MicOff,
  Download,
  X,
} from "lucide-react";
import { InlineQuiz } from "./InlineQuiz";
import { ShortAnswerQuiz } from "./ShortAnswerQuiz";
import { Markdown } from "./Markdown";
import { ChatThreadList, ThreadIcon } from "./ChatThreadList";
import { PromptGeneratorMenu } from "./PromptGeneratorMenu";
import { TypingIndicator } from "./TypingIndicator";
import { parseAssistantContent } from "@/lib/parseAssistantContent";
import { INITIAL_THREADS, createGreetingThread, type Message, type ChatThread } from "@/lib/chatThreads";
import { exportChatToPdf } from "@/lib/exportChatPdf";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GuestBanner } from "@/components/ui/GuestBanner";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { isAuthenticated, type AuthState } from "@/lib/auth";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { cn } from "@/lib/utils";
import { useI18n, LOCALE_TAG } from "@/lib/i18n";

const MAX_MESSAGE_LENGTH = 4000;

const QUICK_ACTIONS = [
  { icon: ListChecks, labelKey: "chat.quickBuildPlan" },
  { icon: Sparkles, labelKey: "chat.quickQuizMe" },
  { icon: FileText, labelKey: "chat.quickCheckReadiness" },
];

interface ChatInterfaceProps {
  auth: AuthState;
  onSignInClick: () => void;
  initialPrompt?: string | null;
  onInitialPromptConsumed?: () => void;
}

export function ChatInterface({ auth, onSignInClick, initialPrompt, onInitialPromptConsumed }: ChatInterfaceProps) {
  const { t, language } = useI18n();
  const [threads, setThreads] = useLocalStorage<ChatThread[]>("chatThreads", INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useLocalStorage<string | null>(
    "activeThreadId",
    INITIAL_THREADS[0]?.id ?? null
  );
  const [mobileThreadsOpen, setMobileThreadsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [listening, setListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      onInitialPromptConsumed?.();
      textareaRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null;

  const SpeechRecognitionCtor =
    typeof window !== "undefined" ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;
  const speechSupported = Boolean(SpeechRecognitionCtor);

  useEffect(() => {
    return () => recognitionRef.current?.stop?.();
  }, []);

  const toggleListening = () => {
    if (!speechSupported) return;
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = LOCALE_TAG[language];
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results as any)
        .map((r: any) => r[0].transcript)
        .join(" ");
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const handleNewChat = (examCode: string) => {
    const newThread = createGreetingThread(`thread-${Date.now()}`, examCode);
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    setMobileThreadsOpen(false);
  };

  const handleDeleteThread = (id: string) => {
    setThreads((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (activeThreadId === id) {
        setActiveThreadId(next[0]?.id ?? null);
      }
      return next;
    });
  };

  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
    setMobileThreadsOpen(false);
  };

  const handleSend = () => {
    if (!input.trim() || !activeThread) return;
    const threadId = activeThread.id;
    const text = attachedFile ? `${input.trim()}\n\n📎 ${attachedFile.name}` : input.trim();
    const newMessage: Message = { id: `msg-${Date.now()}`, role: "user", text };
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, newMessage] } : t))
    );
    setInput("");
    setAttachedFile(null);

    // UI-only placeholder: certbuddycr.com's production backend calls Azure OpenAI here to
    // generate the real reply. This just demonstrates the round-trip (typing indicator →
    // response bubble) so the interaction pattern is already wired for that integration.
    setIsGenerating(true);
    setTimeout(() => {
      const reply: Message = {
        id: `msg-${Date.now()}-reply`,
        role: "assistant",
        content:
          "This is where CertBuddyCR's Azure OpenAI-backed response appears. The UI pattern (typing indicator, then a reply that can include markdown, quiz drills, or inline questions) is fully wired — connect it to the existing backend to generate real answers here.",
      };
      setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, reply] } : t)));
      setIsGenerating(false);
    }, 1100 + Math.random() * 500);
  };

  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachedFile(e.target.files?.[0] ?? null);
    e.target.value = "";
  };

  const handleExportPdf = () => {
    if (activeThread) exportChatToPdf(activeThread);
  };

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      <ChatThreadList
        threads={threads}
        activeId={activeThreadId}
        onSelect={handleSelectThread}
        onDelete={handleDeleteThread}
        onNewChat={handleNewChat}
        mobileOpen={mobileThreadsOpen}
        onCloseMobile={() => setMobileThreadsOpen(false)}
      />

      <div className="relative flex h-full flex-1 flex-col bg-bg-primary">
        <AmbientGlow />
        <div className="flex items-center justify-between border-b border-border-secondary px-4 py-4 sm:px-8 sm:py-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileThreadsOpen(true)}
              aria-label={t("chat.openConversationList")}
              className="rounded-md p-1.5 text-text-tertiary transition-colors hover:text-text-primary lg:hidden"
            >
              <PanelLeft size={18} />
            </button>
            {activeThread && <ThreadIcon examCode={activeThread.examCode} active />}
            <div>
              <h2 className="font-display text-h4 font-semibold text-text-primary">{t("nav.studyChat")}</h2>
              <p className="font-body text-caption text-text-tertiary">
                {activeThread ? `${activeThread.examCode} · ${activeThread.title}` : t("chat.noConversation")}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden sm:block">
              <PromptGeneratorMenu
                examCode={activeThread?.examCode ?? "AZ-900"}
                onPick={(prompt) => {
                  setInput(prompt);
                  textareaRef.current?.focus();
                }}
              />
            </div>
            <button
              onClick={handleExportPdf}
              disabled={!activeThread}
              aria-label={t("chat.exportPdf")}
              className="flex items-center gap-1.5 rounded-md border border-border-primary bg-bg-tertiary/50 px-3 py-1.5 font-body text-xs font-medium text-text-secondary transition-colors duration-fast hover:border-azure-500/40 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={13} aria-hidden="true" />
              <span className="hidden sm:inline">{t("chat.pdf")}</span>
            </button>
            <div className="hidden items-center gap-2 rounded-full border border-status-success/30 bg-status-success/10 px-3 py-1.5 font-body text-xs font-medium text-status-success md:flex">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-status-success" />
              {t("chat.liveSession")}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
          {!isAuthenticated(auth) && (
            <GuestBanner onSignInClick={onSignInClick} messageKey="guest.chatMessage" />
          )}

          {!activeThread && (
            <p className="font-body text-sm text-text-tertiary">{t("chat.startNewChatPrompt")}</p>
          )}

          {activeThread?.messages.map((m, i) => {
            if (m.role === "assistant-quiz") {
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="flex"
                >
                  <InlineQuiz
                    domain="Networking & Connectivity"
                    question="A team needs to control inbound traffic to a subnet containing three VMs, while another rule must control traffic to just one of those VMs' NICs. Which combination should they use?"
                    options={[
                      { id: "a", label: "NSG on the subnet + ASG on the single VM's NIC", correct: true },
                      { id: "b", label: "Two separate NSGs, one per VM" },
                      { id: "c", label: "A single ASG applied to the subnet" },
                      { id: "d", label: "Azure Firewall rules only, no NSG" },
                    ]}
                  />
                </motion.div>
              );
            }

            if (m.role === "user") {
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex justify-end"
                >
                  <div className="max-w-lg whitespace-pre-wrap rounded-lg bg-gradient-azure-violet px-5 py-3.5 font-body text-body text-white shadow-glow-azure">
                    {m.text}
                  </div>
                </motion.div>
              );
            }

            const segments = parseAssistantContent(m.content);
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start gap-3"
              >
                {segments.map((segment, si) =>
                  segment.type === "text" ? (
                    <div
                      key={si}
                      className="max-w-lg rounded-lg border border-border-primary bg-bg-elevated/70 px-5 py-3.5 font-body text-body text-text-primary backdrop-blur-glass"
                    >
                      <Markdown content={segment.content} />
                    </div>
                  ) : (
                    <ShortAnswerQuiz
                      key={si}
                      heading={segment.heading}
                      instructions={segment.instructions}
                      questions={segment.questions}
                      keyPoints={m.quizKeyPoints}
                    />
                  )
                )}
              </motion.div>
            );
          })}

          <AnimatePresence>{isGenerating && <TypingIndicator />}</AnimatePresence>
        </div>

        <div className="border-t border-border-secondary px-4 py-4 sm:px-8 sm:py-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex gap-2 overflow-x-auto">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.labelKey}
                  onClick={() => {
                    const label = t(action.labelKey);
                    setInput(label + (activeThread ? ` for ${activeThread.examCode}` : ""));
                    textareaRef.current?.focus();
                  }}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-border-primary bg-bg-tertiary/50 px-3 py-1.5 font-body text-xs font-medium text-text-secondary transition-colors duration-fast hover:border-azure-500/40 hover:text-text-primary"
                >
                  <action.icon size={12} aria-hidden="true" />
                  {t(action.labelKey)}
                </button>
              ))}
            </div>
            <span className="hidden shrink-0 font-mono text-xs text-text-tertiary sm:inline">
              {input.length} / {MAX_MESSAGE_LENGTH}
            </span>
          </div>

          {attachedFile && (
            <div className="mb-2 flex items-center gap-2 self-start rounded-md border border-border-primary bg-bg-tertiary/60 px-3 py-1.5">
              <Paperclip size={12} className="text-text-tertiary" aria-hidden="true" />
              <span className="max-w-[200px] truncate font-body text-xs text-text-secondary">
                {attachedFile.name}
              </span>
              <button
                onClick={() => setAttachedFile(null)}
                aria-label={t("chat.removeAttachment")}
                className="text-text-tertiary hover:text-status-error"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <GlassPanel className="gradient-border flex items-end gap-3 p-3">
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected} />
            <button
              onClick={handleAttachClick}
              aria-label={t("chat.attachFile")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors hover:text-text-primary"
            >
              <Paperclip size={17} />
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={isGenerating}
              aria-label={t("chat.message")}
              placeholder={isGenerating ? t("chat.placeholderWaiting") : t("chat.placeholderAsk")}
              className="max-h-32 flex-1 resize-none truncate bg-transparent py-2 font-body text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none disabled:cursor-not-allowed"
            />
            <button
              onClick={toggleListening}
              disabled={!speechSupported}
              aria-label={listening ? t("chat.stopVoiceInput") : t("chat.startVoiceInput")}
              title={speechSupported ? undefined : t("chat.voiceNotSupported")}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                listening ? "bg-status-error/20 text-status-error" : "text-text-tertiary hover:text-text-primary"
              )}
            >
              {listening ? (
                <MicOff size={17} className="animate-pulse-glow" />
              ) : (
                <Mic size={17} />
              )}
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              aria-label={t("chat.sendMessage")}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-all duration-fast disabled:cursor-not-allowed",
                input && !isGenerating
                  ? "bg-gradient-azure-violet text-white shadow-glow-azure"
                  : "bg-bg-tertiary text-text-tertiary"
              )}
            >
              <SendHorizontal size={16} />
            </button>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
