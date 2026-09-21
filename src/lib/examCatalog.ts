// Reproduces the exam catalog observed live on certbuddycr.com's exam selector —
// the product covers the full Microsoft certification lineup, not Azure alone.
export interface ExamInfo {
  code: string;
  name?: string;
}

export interface ExamGroup {
  label: string;
  exams: ExamInfo[];
}

export const EXAM_CATALOG: ExamGroup[] = [
  {
    label: "Azure",
    exams: [
      { code: "AZ-900", name: "Azure Fundamentals" },
      { code: "AZ-104", name: "Azure Administrator" },
      { code: "AZ-120" },
      { code: "AZ-140" },
      { code: "AZ-204", name: "Azure Developer" },
      { code: "AZ-305", name: "Azure Solutions Architect" },
      { code: "AZ-400", name: "DevOps Engineer" },
      { code: "AZ-500", name: "Azure Security Engineer" },
      { code: "AZ-700", name: "Azure Network Engineer" },
      { code: "AZ-800" },
      { code: "AZ-801" },
    ],
  },
  {
    label: "AI",
    exams: [
      { code: "AI-900", name: "Azure AI Fundamentals" },
      { code: "AI-102", name: "Azure AI Engineer" },
      { code: "AI-103" },
      { code: "AI-300" },
      { code: "AI-500" },
      { code: "AI-901" },
    ],
  },
  {
    label: "Data & Analytics",
    exams: [
      { code: "DP-900", name: "Azure Data Fundamentals" },
      { code: "DP-100", name: "Azure Data Scientist" },
      { code: "DP-203", name: "Azure Data Engineer" },
      { code: "DP-300" },
      { code: "DP-420" },
      { code: "DP-600" },
      { code: "DP-700" },
      { code: "DP-750" },
      { code: "DP-800" },
    ],
  },
  {
    label: "Security, Compliance & Identity",
    exams: [
      { code: "SC-900", name: "Security Fundamentals" },
      { code: "SC-100" },
      { code: "SC-200" },
      { code: "SC-300" },
      { code: "SC-401" },
      { code: "SC-500" },
    ],
  },
  {
    label: "Microsoft 365",
    exams: [
      { code: "MS-900", name: "Microsoft 365 Fundamentals" },
      { code: "MS-102" },
      { code: "MS-700" },
      { code: "MS-721" },
      { code: "MD-102", name: "Endpoint Administrator" },
    ],
  },
  {
    label: "Power Platform",
    exams: [
      { code: "PL-900", name: "Power Platform Fundamentals" },
      { code: "PL-200" },
      { code: "PL-300" },
      { code: "PL-400" },
      { code: "PL-500" },
      { code: "PL-600" },
    ],
  },
  {
    label: "Dynamics 365 / Business Applications",
    exams: [
      { code: "MB-210" },
      { code: "MB-220" },
      { code: "MB-230" },
      { code: "MB-240" },
      { code: "MB-260" },
      { code: "MB-280" },
      { code: "MB-310" },
      { code: "MB-330" },
      { code: "MB-335" },
      { code: "MB-500" },
      { code: "MB-700" },
      { code: "MB-800" },
      { code: "MB-820" },
      { code: "AB-100" },
      { code: "AB-410" },
      { code: "AB-620" },
      { code: "AB-730" },
      { code: "AB-731" },
      { code: "AB-900" },
    ],
  },
  {
    label: "GitHub",
    exams: [
      { code: "GH-900", name: "GitHub Foundations" },
      { code: "GH-100" },
      { code: "GH-200" },
      { code: "GH-300" },
      { code: "GH-500" },
      { code: "GH-600" },
    ],
  },
];

export const ALL_EXAMS: ExamInfo[] = EXAM_CATALOG.flatMap((g) => g.exams);

export function findExam(code: string): ExamInfo | undefined {
  return ALL_EXAMS.find((e) => e.code === code);
}

export function examDisplayName(code: string): string {
  const exam = findExam(code);
  return exam?.name ? `${code} · ${exam.name}` : code;
}

export function findExamGroupLabel(code: string): string | undefined {
  return EXAM_CATALOG.find((g) => g.exams.some((e) => e.code === code))?.label;
}
