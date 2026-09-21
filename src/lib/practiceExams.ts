export interface ExamEntry {
  code: string;
  questions: number;
  minutes: number;
  bestScore: number | null;
  lastScore: number | null;
  lastAttemptAt: string | null;
}

// Demo scale (5 questions / 6 minutes) intentionally matches the mock question bank's size —
// real Microsoft exams run 40-60 questions over 60-120 minutes.
export const INITIAL_EXAMS: ExamEntry[] = [
  { code: "AZ-900", questions: 5, minutes: 6, bestScore: 78, lastScore: 72, lastAttemptAt: "2026-09-14" },
  { code: "AI-900", questions: 5, minutes: 6, bestScore: 65, lastScore: 65, lastAttemptAt: "2026-09-05" },
  { code: "DP-900", questions: 5, minutes: 6, bestScore: null, lastScore: null, lastAttemptAt: null },
  { code: "SC-900", questions: 5, minutes: 6, bestScore: null, lastScore: null, lastAttemptAt: null },
  { code: "PL-900", questions: 5, minutes: 6, bestScore: null, lastScore: null, lastAttemptAt: null },
  { code: "MS-900", questions: 5, minutes: 6, bestScore: null, lastScore: null, lastAttemptAt: null },
  { code: "GH-900", questions: 5, minutes: 6, bestScore: null, lastScore: null, lastAttemptAt: null },
];
