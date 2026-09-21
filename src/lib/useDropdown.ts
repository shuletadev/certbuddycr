import { useEffect, useRef, useState } from "react";

// Shared auto-flip positioning logic for small popover menus — opens upward when there
// isn't enough room below (e.g. a control near the bottom of the sidebar).
export function useDropdown(heightEstimate = 220) {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const toggle = () => {
    if (!open && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUpward(spaceBelow < heightEstimate && spaceAbove > spaceBelow);
    }
    setOpen((o) => !o);
  };

  const close = () => setOpen(false);

  return { open, openUpward, rootRef, toggle, close };
}
