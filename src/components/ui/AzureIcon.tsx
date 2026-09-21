import { azureIconFor } from "@/lib/azureIcons";
import { cn } from "@/lib/utils";

interface AzureIconProps {
  name: string;
  className?: string;
}

export function AzureIcon({ name, className }: AzureIconProps) {
  return <img src={azureIconFor(name)} alt="" aria-hidden="true" className={cn("shrink-0", className)} />;
}
