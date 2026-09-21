import { type ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    if (variant === "ghost") {
      return (
        <button
          ref={ref}
          className={cn(
            "rounded-md border border-border-primary bg-bg-tertiary/60 px-4 py-2.5 font-body text-sm font-medium text-text-secondary transition-all duration-fast ease-premium hover:border-border-focus/60 hover:text-text-primary",
            className
          )}
          {...props}
        >
          {children}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative rounded-md bg-gradient-azure-violet px-5 py-2.5 font-body text-sm font-semibold text-white shadow-glow-azure transition-shadow duration-normal ease-premium hover:shadow-glow-violet-lg",
          className
        )}
        {...(props as any)}
      >
        {children}
      </motion.button>
    );
  }
);
GradientButton.displayName = "GradientButton";
