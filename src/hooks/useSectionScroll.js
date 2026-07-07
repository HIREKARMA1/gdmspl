"use client";

import { useState, useEffect, useCallback } from "react";

export default function useSectionScroll(ref) {
  const [progress, setProgress] = useState(0);

  const calculateProgress = useCallback(() => {
    if (!ref.current) return;

    const { top, height } = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollable = height - windowHeight;
    const currentScroll = -top;
    const currentProgress = currentScroll / totalScrollable;

    setProgress(Math.min(1, Math.max(0, currentProgress)));
  }, [ref]);

  useEffect(() => {
    window.addEventListener("scroll", calculateProgress, { passive: true });
    calculateProgress();
    return () => window.removeEventListener("scroll", calculateProgress);
  }, [calculateProgress]);

  return progress;
}
