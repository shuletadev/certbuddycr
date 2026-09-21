// Shared "how much graded practice exists per domain" store. The readiness ring
// reads it to decide locked/building/ready; mock exams write to it on completion.
// Previously these were two disconnected datasets — this is the fix.
export const EVIDENCE_THRESHOLD = 5;

export interface DomainStat {
  answered: number;
  correct: number;
}

export type DomainEvidenceStore = Record<string, DomainStat>;

export function domainKey(examCode: string, domain: string) {
  return `${examCode}::${domain}`;
}

export function getDomainNames(examCode: string): string[] {
  if (examCode === "AZ-900") {
    return ["Cloud concepts", "Azure architecture & services", "Management & governance"];
  }
  return ["Core concepts", "Implementation & architecture", "Governance & management"];
}

export const DEFAULT_DOMAIN_EVIDENCE: DomainEvidenceStore = {
  [domainKey("AZ-900", "Cloud concepts")]: { answered: 9, correct: 8 },
  [domainKey("AZ-900", "Azure architecture & services")]: { answered: 6, correct: 5 },
  [domainKey("AZ-900", "Management & governance")]: { answered: 2, correct: 1 },
};

export function buildDomainsForExam(examCode: string, store: DomainEvidenceStore) {
  return getDomainNames(examCode).map((name) => {
    const stat = store[domainKey(examCode, name)] ?? { answered: 0, correct: 0 };
    return { name, answered: stat.answered };
  });
}

export function buildDomainAccuracyForExam(examCode: string, store: DomainEvidenceStore) {
  return getDomainNames(examCode).map((name) => {
    const stat = store[domainKey(examCode, name)] ?? { answered: 0, correct: 0 };
    const accuracy = stat.answered > 0 ? Math.round((stat.correct / stat.answered) * 100) : 0;
    return { name, answered: stat.answered, correct: stat.correct, accuracy };
  });
}

export function bestDomainAccuracy(store: DomainEvidenceStore): number {
  let best = 0;
  for (const stat of Object.values(store)) {
    if (stat.answered === 0) continue;
    best = Math.max(best, Math.round((stat.correct / stat.answered) * 100));
  }
  return best;
}

export function mergeExamResults(
  store: DomainEvidenceStore,
  examCode: string,
  perDomain: { domain: string; answered: number; correct: number }[]
): DomainEvidenceStore {
  const next = { ...store };
  for (const d of perDomain) {
    const key = domainKey(examCode, d.domain);
    const prev = next[key] ?? { answered: 0, correct: 0 };
    next[key] = { answered: prev.answered + d.answered, correct: prev.correct + d.correct };
  }
  return next;
}
