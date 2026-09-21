import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, MessageSquare, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExamPicker } from "@/components/ui/ExamPicker";
import { CERT_TRACKS, trackForExamCode, type CertTrackId } from "@/lib/certPath";
import type { ChatThread } from "@/lib/chatThreads";
import { useI18n } from "@/lib/i18n";

const TRACK_CHIP_CLASS: Record<CertTrackId, string> = {
  azure: "bg-azure-500/10 text-azure-400",
  ai: "bg-violet-500/10 text-violet-400",
  security: "bg-status-warning/10 text-status-warning",
};

export function ThreadIcon({ examCode, active }: { examCode: string; active: boolean }) {
  const track = trackForExamCode(examCode);
  if (track) {
    return (
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
          TRACK_CHIP_CLASS[track]
        )}
      >
        <img src={CERT_TRACKS[track].icon} alt="" aria-hidden="true" className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-bg-tertiary",
        active ? "text-azure-400" : "text-text-tertiary"
      )}
    >
      <MessageSquare size={14} aria-hidden="true" />
    </div>
  );
}

interface ChatThreadListProps {
  threads: ChatThread[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat: (examCode: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function ThreadListBody({
  threads,
  activeId,
  onSelect,
  onDelete,
  onNewChat,
}: Omit<ChatThreadListProps, "mobileOpen" | "onCloseMobile">) {
  const { t } = useI18n();
  const [creating, setCreating] = useState(false);
  const [draftExam, setDraftExam] = useState(
    threads.find((th) => th.id === activeId)?.examCode ?? "AZ-900"
  );

  if (creating) {
    return (
      <div className="mb-4 rounded-md border border-border-primary bg-bg-tertiary/40 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-body text-label uppercase text-text-tertiary">{t("threadList.newChat")}</span>
          <button
            onClick={() => setCreating(false)}
            aria-label={t("threadList.cancelNewChat")}
            className="rounded p-0.5 text-text-tertiary hover:text-text-primary"
          >
            <X size={14} />
          </button>
        </div>
        <p className="mb-2 font-body text-xs text-text-secondary">{t("threadList.chooseCertification")}</p>
        <ExamPicker value={draftExam} onChange={setDraftExam} className="mb-2" />
        <button
          onClick={() => {
            onNewChat(draftExam);
            setCreating(false);
          }}
          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-gradient-azure-violet py-2 font-body text-sm font-semibold text-white shadow-glow-azure"
        >
          {t("threadList.startChat")} <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setCreating(true)}
        className="mb-4 flex items-center justify-center gap-2 rounded-md border border-border-primary bg-bg-tertiary/50 py-2.5 font-body text-sm font-medium text-text-primary transition-colors duration-fast hover:border-azure-500/40"
      >
        <Plus size={15} aria-hidden="true" /> {t("threadList.newChat")}
      </button>

      <p className="mb-2 px-1 font-body text-label uppercase text-text-tertiary">{t("threadList.yourConversations")}</p>

      <div className="flex flex-col gap-1 overflow-y-auto">
        {threads.length === 0 && (
          <p className="px-1 py-4 font-body text-sm text-text-tertiary">{t("threadList.noSavedConversations")}</p>
        )}
        {threads.map((thread) => {
          const active = thread.id === activeId;
          return (
            <div
              key={thread.id}
              className={cn(
                "group relative flex items-center gap-2 rounded-md px-3 py-2.5 transition-colors duration-fast",
                active ? "bg-bg-tertiary/80 border border-border-primary" : "hover:bg-bg-tertiary/40"
              )}
            >
              <button
                onClick={() => onSelect(thread.id)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <ThreadIcon examCode={thread.examCode} active={active} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-body text-sm font-medium text-text-primary">{thread.title}</span>
                  <span className="block truncate font-body text-caption text-text-tertiary">{thread.examCode}</span>
                </span>
              </button>
              <button
                onClick={() => onDelete(thread.id)}
                aria-label={t("threadList.deleteThread", { title: thread.title })}
                className="shrink-0 rounded p-1 text-text-tertiary opacity-100 transition-opacity duration-fast hover:text-status-error lg:opacity-0 lg:group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function ChatThreadList(props: ChatThreadListProps) {
  const { t } = useI18n();
  return (
    <>
      <div className="hidden h-full w-64 shrink-0 flex-col border-r border-border-secondary bg-bg-secondary/60 px-3 py-4 lg:flex">
        <ThreadListBody {...props} />
      </div>

      <AnimatePresence>
        {props.mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={props.onCloseMobile}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col border-r border-border-secondary bg-bg-secondary/95 px-3 py-4 transition-transform duration-normal ease-premium lg:hidden",
          props.mobileOpen && "translate-x-0"
        )}
      >
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="font-display text-sm font-semibold text-text-primary">{t("threadList.conversations")}</span>
          <button
            onClick={props.onCloseMobile}
            aria-label={t("threadList.closeConversationList")}
            className="rounded-md p-1 text-text-tertiary hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>
        <ThreadListBody {...props} />
      </div>
    </>
  );
}
