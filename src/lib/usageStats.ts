export interface TokenLogEntry {
  date: string;
  requests: number;
  tokens: number;
}

export const LIFETIME_STATS = {
  examsStudied: 3,
  savedChats: 4,
  savedMockSessions: 2,
  questionsAndMockAnswers: 47,
};

// Single source of truth for token usage — both UsageCard (Dashboard) and the
// Settings usage tab read this same log, so they can't show contradictory totals.
export const TOKEN_LOG: TokenLogEntry[] = [
  { date: "2026-09-07", requests: 5, tokens: 2400 },
  { date: "2026-09-08", requests: 7, tokens: 3600 },
  { date: "2026-09-09", requests: 6, tokens: 2800 },
  { date: "2026-09-10", requests: 9, tokens: 4400 },
  { date: "2026-09-11", requests: 8, tokens: 3800 },
  { date: "2026-09-12", requests: 12, tokens: 5600 },
  { date: "2026-09-13", requests: 10, tokens: 4800 },
  { date: "2026-09-14", requests: 0, tokens: 0 },
  { date: "2026-09-15", requests: 6, tokens: 2430 },
  { date: "2026-09-16", requests: 21, tokens: 9950 },
  { date: "2026-09-17", requests: 9, tokens: 4110 },
  { date: "2026-09-18", requests: 14, tokens: 6820 },
];

export const TOKEN_LIMIT = 75000;
export const TOTAL_TOKENS_USED = TOKEN_LOG.reduce((sum, r) => sum + r.tokens, 0);

export function exportUsageCsv(): string {
  const header = "date,requests,tokens";
  const rows = TOKEN_LOG.map((r) => `${r.date},${r.requests},${r.tokens}`);
  return [header, ...rows].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
