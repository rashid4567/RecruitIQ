import { useState, useEffect, useCallback } from "react";
import type { Job } from "@/module/jobs/types/job.types";

export function useJobRotator(
  jobs: Job[],
  intervalMs = 5000,
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (
        isAnimating ||
        index === currentIndex ||
        index < 0 ||
        index >= jobs.length
      ) {
        return;
      }

      setIsAnimating(true);

      setTimeout(() => {
        setCurrentIndex(index);
        setIsAnimating(false);
      }, 400);
    },
    [currentIndex, isAnimating, jobs.length],
  );

  useEffect(() => {
    if (jobs.length <= 1) return;

    const timer = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentIndex((prev) => {
          if (jobs.length === 0) return 0;
          return (prev + 1) % jobs.length;
        });

        setIsAnimating(false);
      }, 400);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [jobs.length, intervalMs]);

  const safeIndex =
    jobs.length === 0
      ? 0
      : Math.min(currentIndex, jobs.length - 1);

  return {
    currentJob: jobs[safeIndex] ?? null,
    currentIndex: safeIndex,
    goTo,
    isAnimating,
  };
}