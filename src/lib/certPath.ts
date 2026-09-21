import type { ExamEntry } from "./practiceExams";

export type CertTier = "fundamentals" | "associate" | "expert";
export type CertNodeStatus = "completed" | "available" | "locked";
export type CertTrackId = "azure" | "ai" | "security";

export interface CertPathNode {
  code: string;
  name: string;
  tier: CertTier;
}

export interface CertTrackInfo {
  id: CertTrackId;
  labelKey: string;
  icon: string;
  nodes: CertPathNode[];
}

const PASS_THRESHOLD = 70;

// Verified against Microsoft Learn — the AI track genuinely has no Expert tier
// (Fundamentals -> Associate only), unlike Azure and Security.
export const CERT_TRACKS: Record<CertTrackId, CertTrackInfo> = {
  azure: {
    id: "azure",
    labelKey: "certPath.track.azure",
    icon: "/azure-icons/resource-groups.svg",
    nodes: [
      { code: "AZ-900", name: "Azure Fundamentals", tier: "fundamentals" },
      { code: "AZ-104", name: "Azure Administrator", tier: "associate" },
      { code: "AZ-204", name: "Azure Developer", tier: "associate" },
      { code: "AZ-500", name: "Azure Security Engineer", tier: "associate" },
      { code: "AZ-700", name: "Azure Network Engineer", tier: "associate" },
      { code: "AZ-305", name: "Azure Solutions Architect", tier: "expert" },
      { code: "AZ-400", name: "DevOps Engineer Expert", tier: "expert" },
    ],
  },
  ai: {
    id: "ai",
    labelKey: "certPath.track.ai",
    icon: "/azure-icons/cognitive-services.svg",
    nodes: [
      { code: "AI-900", name: "Azure AI Fundamentals", tier: "fundamentals" },
      { code: "AI-102", name: "Azure AI Engineer Associate", tier: "associate" },
    ],
  },
  security: {
    id: "security",
    labelKey: "certPath.track.security",
    icon: "/azure-icons/key-vaults.svg",
    nodes: [
      { code: "SC-900", name: "Security Fundamentals", tier: "fundamentals" },
      { code: "SC-200", name: "Security Operations Analyst", tier: "associate" },
      { code: "SC-300", name: "Identity and Access Administrator", tier: "associate" },
      { code: "SC-100", name: "Cybersecurity Architect Expert", tier: "expert" },
    ],
  },
};

export const CERT_TRACK_ORDER: CertTrackId[] = ["azure", "ai", "security"];

// Lightweight prefix match so any exam code in the wider catalog (not just the
// curated path nodes above) can still be visually tagged by family.
export function trackForExamCode(code: string): CertTrackId | null {
  if (code.startsWith("AZ-")) return "azure";
  if (code.startsWith("AI-")) return "ai";
  if (code.startsWith("SC-")) return "security";
  return null;
}

export function computeCertPathStatuses(
  trackId: CertTrackId,
  exams: ExamEntry[]
): Record<string, CertNodeStatus> {
  const track = CERT_TRACKS[trackId];
  const byCode = new Map(exams.map((e) => [e.code, e]));
  const passed = (code: string) => (byCode.get(code)?.bestScore ?? 0) >= PASS_THRESHOLD;

  const fundamentalsCode = track.nodes.find((n) => n.tier === "fundamentals")?.code;
  const associateCodes = track.nodes.filter((n) => n.tier === "associate").map((n) => n.code);

  const fundamentalsPassed = fundamentalsCode ? passed(fundamentalsCode) : false;
  const anyAssociatePassed = associateCodes.some(passed);

  const statuses: Record<string, CertNodeStatus> = {};
  for (const node of track.nodes) {
    if (passed(node.code)) {
      statuses[node.code] = "completed";
    } else if (node.tier === "fundamentals") {
      statuses[node.code] = "available";
    } else if (node.tier === "associate") {
      statuses[node.code] = fundamentalsPassed ? "available" : "locked";
    } else {
      statuses[node.code] = anyAssociatePassed ? "available" : "locked";
    }
  }
  return statuses;
}
