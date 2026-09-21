export interface PromptTemplate {
  id: string;
  label: string;
  description: string;
  build: (examCode: string) => string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "cram-plan",
    label: "Cram plan",
    description: "A focused, high-yield plan for last-minute review.",
    build: (code) => `Build me a 30-minute cram plan for ${code}, focused on my weakest domains.`,
  },
  {
    id: "seven-day-plan",
    label: "7-day plan",
    description: "A structured week of study sessions.",
    build: (code) => `Build me a 7-day study plan for ${code} that fits around 30 minutes a day.`,
  },
  {
    id: "practice-quiz",
    label: "Practice quiz",
    description: "A short quiz on a topic you choose.",
    build: (code) => `Quiz me on ${code} — pick a domain I haven't practiced recently.`,
  },
  {
    id: "bank-practice",
    label: "Bank practice",
    description: "Pull questions from the full practice bank.",
    build: (code) => `Give me 5 practice questions from the ${code} question bank, mixed difficulty.`,
  },
  {
    id: "readiness-discussion",
    label: "Readiness discussion",
    description: "Talk through whether you're ready to sit the exam.",
    build: (code) => `Based on what I've studied so far, do you think I'm ready to sit ${code}? What are my gaps?`,
  },
  {
    id: "outline-explanation",
    label: "Outline explanation",
    description: "Walk through the official exam outline domain by domain.",
    build: (code) => `Walk me through the official ${code} exam outline, domain by domain.`,
  },
];
