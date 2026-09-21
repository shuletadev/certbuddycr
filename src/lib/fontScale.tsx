import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type FontScale = "sm" | "default" | "lg" | "xl";

export const FONT_SCALE_PERCENT: Record<FontScale, number> = {
  sm: 87.5,
  default: 100,
  lg: 112.5,
  xl: 125,
};

export const FONT_SCALE_ORDER: FontScale[] = ["sm", "default", "lg", "xl"];

interface FontScaleContextValue {
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
}

const FontScaleContext = createContext<FontScaleContextValue | null>(null);

export function FontScaleProvider({ children }: { children: ReactNode }) {
  const [fontScale, setFontScale] = useLocalStorage<FontScale>("fontScale", "default");

  useEffect(() => {
    document.documentElement.style.fontSize = `${FONT_SCALE_PERCENT[fontScale]}%`;
  }, [fontScale]);

  const value = useMemo(() => ({ fontScale, setFontScale }), [fontScale]);

  return <FontScaleContext.Provider value={value}>{children}</FontScaleContext.Provider>;
}

export function useFontScale() {
  const ctx = useContext(FontScaleContext);
  if (!ctx) throw new Error("useFontScale must be used within FontScaleProvider");
  return ctx;
}
