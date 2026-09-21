import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "none" | "azure" | "violet";
  interactive?: boolean;
}

/**
 * Frosted-glass surface used across cards, panels and dropdowns.
 * `interactive` adds the lift + animated gradient-border hover treatment.
 */
export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, glow = "none", interactive = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-lg border border-border-primary bg-bg-elevated/60 backdrop-blur-glass shadow-panel",
          interactive &&
            "gradient-border transition-all duration-normal ease-premium hover:-translate-y-1 hover:shadow-panel-lg",
          interactive && glow === "azure" && "hover:shadow-glow-azure",
          interactive && glow === "violet" && "hover:shadow-glow-violet",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassPanel.displayName = "GlassPanel";
