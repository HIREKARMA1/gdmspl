import { useState, useEffect, useCallback } from 'react';

const useSectionScroll = (ref) => {
  const [progress, setProgress] = useState(0);

  const calculateProgress = useCallback(() => {
    if (!ref.current) return;

    const { top, height } = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Start tracking when the top of the section enters the viewport
    // End tracking when the bottom of the section leaves the viewport
    // Since it's sticky, we care about the relative position within the tall parent
    const totalScrollable = height - windowHeight;
    const currentScroll = -top;

    const currentProgress = currentScroll / totalScrollable;
    setProgress(Math.min(1, Math.max(0, currentProgress)));
  }, [ref]);

  useEffect(() => {
    window.addEventListener('scroll', calculateProgress, { passive: true });
    calculateProgress();

    return () => window.removeEventListener('scroll', calculateProgress);
  }, [calculateProgress]);

  return progress;
};

export default useSectionScroll;
