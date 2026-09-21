import { useState } from "react";

// Every view here mounts fresh each time you navigate to it (no keep-alive), so
// plain useState loses everything on a tab switch, not just a reload. Backing it
// with localStorage — read once on mount, written on every change — fixes both.
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // storage full or unavailable (private browsing) — keep working in-memory
      }
      return resolved;
    });
  };

  return [value, setStoredValue] as const;
}
