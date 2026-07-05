import { useEffect, useMemo, useState } from "react";

export interface CountdownResult {
  secondsRemaining: number;
  label: string;
  hasStarted: boolean;
  hasEnded: boolean;
  isStartingSoon: boolean;
}

const FIVE_MINUTES_IN_SECONDS = 300;

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function useCountdown(
  scheduledAt?: string,
  durationInMinutes?: number,
): CountdownResult {
  const targetTime = useMemo(
    () => (scheduledAt ? new Date(scheduledAt).getTime() : null),
    [scheduledAt],
  );

  const endTime = useMemo(() => {
    if (!targetTime || !durationInMinutes) return null;
    return targetTime + durationInMinutes * 60_000;
  }, [targetTime, durationInMinutes]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetTime) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetTime]);

  return useMemo(() => {
    if (!targetTime || Number.isNaN(targetTime)) {
      return {
        secondsRemaining: 0,
        label: "--:--",
        hasStarted: false,
        hasEnded: false,
        isStartingSoon: false,
      };
    }

    const diffMs = targetTime - now;
    const secondsRemaining = Math.max(0, Math.round(diffMs / 1000));
    const hasStarted = diffMs <= 0;
    const hasEnded = endTime ? now > endTime : false;

    let label: string;
    if (hasEnded) {
      label = "Ended";
    } else if (hasStarted) {
      label = "Live now";
    } else {
      label = formatDuration(secondsRemaining);
    }

    return {
      secondsRemaining,
      label,
      hasStarted,
      hasEnded,
      isStartingSoon: !hasStarted && secondsRemaining <= FIVE_MINUTES_IN_SECONDS,
    };
  }, [targetTime, endTime, now]);
}