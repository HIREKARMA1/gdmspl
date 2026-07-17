"use client";

import { useEffect } from "react";

/**
 * Wraps a home section on its own route: offsets fixed header and scrolls to top on mount.
 */
export default function SectionPageShell({ children, className = "" }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen bg-canvas pt-[88px] ${className}`}>
      {children}
    </div>
  );
}
