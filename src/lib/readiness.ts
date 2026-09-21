// Single source of truth for the AZ-900 readiness score so the Dashboard ring
// and the Achievements "Exam Ready" progress can't drift apart, like they did
// when each screen hardcoded its own number (82 vs 78).
export const DEFAULT_READINESS_SCORE = 82;
export const READY_THRESHOLD = 85;
