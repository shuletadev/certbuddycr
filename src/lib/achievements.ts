import { Flame, Trophy, Zap, Target, BookOpen, Sunrise, type LucideIcon } from "lucide-react";
import { computeStreaks } from "./activityData";
import { DEFAULT_READINESS_SCORE, READY_THRESHOLD } from "./readiness";
import { bestDomainAccuracy, type DomainEvidenceStore } from "./domainEvidence";
import type { ExamEntry } from "./practiceExams";

export const DOMAIN_MASTER_THRESHOLD = 90;

export interface Achievement {
  id: string;
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  descVars?: Record<string, string | number>;
  earned: boolean;
  progress?: string;
}

interface ComputeAchievementsParams {
  domainEvidence: DomainEvidenceStore;
  exams: ExamEntry[];
  activityDays: number[];
}

// Single source of truth for "what counts as earned" — the Achievements screen
// and the unlock celebration both read from here, so they can never disagree.
export function computeAchievements({
  domainEvidence,
  exams,
  activityDays,
}: ComputeAchievementsParams): Achievement[] {
  const { best: bestStreak } = computeStreaks(activityDays);
  const bestDomainPct = bestDomainAccuracy(domainEvidence);
  const hasPerfectScore = exams.some((e) => e.bestScore === 100);

  return [
    {
      id: "streak5",
      icon: Flame,
      titleKey: "achievements.streak5.title",
      descKey: "achievements.streak5.desc",
      earned: bestStreak >= 5,
      progress: bestStreak >= 5 ? undefined : `${bestStreak}/5`,
    },
    {
      id: "perfect",
      icon: Target,
      titleKey: "achievements.perfect.title",
      descKey: "achievements.perfect.desc",
      earned: hasPerfectScore,
    },
    // No source of truth yet for "questions answered in one session" or time-of-day —
    // left illustrative rather than faked, unlike the achievements above.
    {
      id: "sprinter",
      icon: Zap,
      titleKey: "achievements.sprinter.title",
      descKey: "achievements.sprinter.desc",
      earned: true,
    },
    {
      id: "domainMaster",
      icon: BookOpen,
      titleKey: "achievements.domainMaster.title",
      descKey: "achievements.domainMaster.desc",
      descVars: { threshold: DOMAIN_MASTER_THRESHOLD },
      earned: bestDomainPct >= DOMAIN_MASTER_THRESHOLD,
      progress: bestDomainPct >= DOMAIN_MASTER_THRESHOLD ? undefined : `${bestDomainPct}%`,
    },
    {
      id: "earlyBird",
      icon: Sunrise,
      titleKey: "achievements.earlyBird.title",
      descKey: "achievements.earlyBird.desc",
      earned: false,
      progress: "2/5",
    },
    {
      id: "examReady",
      icon: Trophy,
      titleKey: "achievements.examReady.title",
      descKey: "achievements.examReady.desc",
      descVars: { threshold: READY_THRESHOLD },
      earned: DEFAULT_READINESS_SCORE >= READY_THRESHOLD,
      progress: DEFAULT_READINESS_SCORE >= READY_THRESHOLD ? undefined : `${DEFAULT_READINESS_SCORE}%`,
    },
  ];
}

export function earnedIds(achievements: Achievement[]): Set<string> {
  return new Set(achievements.filter((a) => a.earned).map((a) => a.id));
}
