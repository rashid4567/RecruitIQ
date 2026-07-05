import { useEffect, useState } from "react";

export type ConnectionQuality =
  | "excellent"
  | "good"
  | "fair"
  | "poor"
  | "offline"
  | "unknown";

export interface ConnectionInfo {
  quality: ConnectionQuality;
  downlinkMbps: number | null;
  effectiveType: string | null;
}

interface NetworkInformationLike {
  downlink?: number;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
}

export function useConnectionQuality(): ConnectionInfo {
  const [info, setInfo] = useState<ConnectionInfo>({
    quality: "unknown",
    downlinkMbps: null,
    effectiveType: null,
  });

  useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: NetworkInformationLike;
    };

    const evaluate = () => {
      if (!navigator.onLine) {
        setInfo({
          quality: "offline",
          downlinkMbps: null,
          effectiveType: null,
        });
        return;
      }

      const connection = nav.connection;
      if (!connection) {
        setInfo({
          quality: "unknown",
          downlinkMbps: null,
          effectiveType: null,
        });
        return;
      }

      const downlink = connection.downlink ?? null;
      const effectiveType = connection.effectiveType ?? null;

      let quality: ConnectionQuality = "unknown";
      if (downlink !== null) {
        if (downlink >= 5) quality = "excellent";
        else if (downlink >= 2) quality = "good";
        else if (downlink >= 0.5) quality = "fair";
        else quality = "poor";
      } else if (effectiveType) {
        quality =
          effectiveType === "4g"
            ? "good"
            : effectiveType === "3g"
              ? "fair"
              : "poor";
      }

      setInfo({ quality, downlinkMbps: downlink, effectiveType });
    };

    evaluate();
    window.addEventListener("online", evaluate);
    window.addEventListener("offline", evaluate);
    nav.connection?.addEventListener?.("change", evaluate);

    return () => {
      window.removeEventListener("online", evaluate);
      window.removeEventListener("offline", evaluate);
      nav.connection?.removeEventListener?.("change", evaluate);
    };
  }, []);

  return info;
}
