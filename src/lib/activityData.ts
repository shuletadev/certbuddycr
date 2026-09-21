export const WEEKS = 12;
export const DAYS_PER_WEEK = 7;

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function buildActivityDays(): number[] {
  const rand = seededRandom(42);
  return Array.from({ length: WEEKS * DAYS_PER_WEEK }, (_, i) => {
    const week = Math.floor(i / DAYS_PER_WEEK);
    const activityChance = week < 3 ? 0.15 : week === 7 ? 0.1 : 0.65;
    if (rand() > activityChance) return 0;
    const intensity = rand();
    return week >= WEEKS - 2 ? Math.floor(intensity * 18) + 3 : Math.floor(intensity * 12) + 1;
  });
}

export const activityDays: number[] = buildActivityDays();

export type ActivityBucket = "zero" | "low" | "medium" | "high" | "peak";

export function bucketFor(count: number): ActivityBucket {
  if (count === 0) return "zero";
  if (count < 5) return "low";
  if (count < 10) return "medium";
  if (count < 20) return "high";
  return "peak";
}

export function computeStreaks(days: number[]) {
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i] > 0) current++;
    else break;
  }

  let best = 0;
  let run = 0;
  for (const d of days) {
    if (d > 0) {
      run++;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
  }

  const studyDays = days.filter((d) => d > 0).length;
  const gradedAnswers = days.reduce((sum, d) => sum + d, 0);
  const completedMocks = Math.max(1, Math.floor(studyDays / 6));

  return { current, best, studyDays, gradedAnswers, completedMocks };
}
