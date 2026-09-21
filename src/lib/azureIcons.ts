// Maps domain/topic names to official Azure service icons (arch-center.azureedge.net,
// used here under Microsoft's training-materials license).
const ICON_MAP: Record<string, string> = {
  "Cloud concepts": "all-resources",
  "Core concepts": "all-resources",
  "Azure architecture & services": "resource-groups",
  "Implementation & architecture": "resource-groups",
  "Management & governance": "policy",
  "Governance & management": "policy",
};

const DEFAULT_ICON = "all-resources";

export function azureIconFor(name: string): string {
  const key = ICON_MAP[name] ?? DEFAULT_ICON;
  return `/azure-icons/${key}.svg`;
}
