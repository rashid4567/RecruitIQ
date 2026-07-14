import { useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { toast } from "sonner";

import {
  notificationMeta,
  categoryStyles,
  priorityStyles,
} from "./notificationMeta";
import { formatTimeAgo } from "../../../utils/timeAgo";
import type { Notification } from "../types/notification.types";

interface Props {
  id: string | number;
  notification: Notification;
  onNavigate: (path: string) => void;
  duration?: number;
}

function getActor(
  notification: Notification,
): { name: string; avatarUrl?: string } | null {
  const meta = notification.metadata;
  const name =
    meta && typeof meta.actorName === "string"
      ? (meta.actorName as string)
      : undefined;
  if (!name) return null;
  const avatarUrl =
    meta && typeof meta.actorAvatarUrl === "string"
      ? (meta.actorAvatarUrl as string)
      : undefined;
  return { name, avatarUrl };
}

export default function NotificationToast({
  id,
  notification,
  onNavigate,
  duration = 6000,
}: Props) {
  const meta = notificationMeta[notification.type];
  const colors = categoryStyles[meta.category];
  const priority = priorityStyles[meta.priority];
  const actor = getActor(notification);

  const [progress, setProgress] = useState(100);
  const [paused, setPaused] = useState(false);
  const startRef = useRef(0);
  const remainingRef = useRef(duration);

  useEffect(() => {
    if (paused) return;

    startRef.current = Date.now();

    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const remaining = Math.max(remainingRef.current - elapsed, 0);

      setProgress((remaining / duration) * 100);

      if (remaining <= 0) {
        toast.dismiss(id);
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [paused, duration, id]);

  useEffect(() => {
    if (paused) return;
    startRef.current = Date.now();
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const remaining = Math.max(remainingRef.current - elapsed, 0);
      setProgress((remaining / duration) * 100);
      if (remaining <= 0) {
        toast.dismiss(id);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, duration, id]);
  const iconStyle: React.CSSProperties & {
    "--tw-ring-color": string;
  } = {
    background: `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
    boxShadow: `inset 0 1px 1px rgba(255,255,255,.35), 0 4px 10px -2px ${colors.fg}55`,
    "--tw-ring-color": colors.ring,
  };
  return (
    <div
      role="status"
      onMouseEnter={() => {
        remainingRef.current = Math.max(
          remainingRef.current - (Date.now() - startRef.current),
          0,
        );
        setPaused(true);
      }}
      onMouseLeave={() => setPaused(false)}
      className="group relative w-95 overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_-6px_rgba(15,23,42,0.16)] ring-1 ring-black/5 transition-all duration-200 ease-out animate-in fade-in slide-in-from-bottom-2 zoom-in-95 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-2xl"
      style={
        priority.glow
          ? {
              boxShadow: `0 8px 28px -6px rgba(15,23,42,.16), 0 0 0 1px ${colors.ring}`,
            }
          : undefined
      }
    >
      <div
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: colors.fg }}
      />

      <div className="absolute inset-x-0 top-0 h-0.75 bg-slate-100">
        <div
          className="h-full ease-linear"
          style={{ width: `${progress}%`, backgroundColor: colors.fg }}
        />
      </div>

      <div className="flex gap-3 py-4 pl-5 pr-4">
        <div className="relative shrink-0">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white ring-1"
            style={iconStyle}
          >
            {meta.icon}
          </div>
          {priority.dot && (
            <span
              className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full ring-2 ring-white"
              style={{ backgroundColor: colors.fg }}
            >
              {priority.pulse && (
                <span
                  className="absolute inset-0 animate-ping rounded-full"
                  style={{ backgroundColor: colors.fg, opacity: 0.6 }}
                />
              )}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{ backgroundColor: colors.bg, color: colors.fg }}
            >
              {meta.eyebrow}
            </span>
            <button
              onClick={() => toast.dismiss(id)}
              aria-label="Dismiss notification"
              className="rounded-full p-1 text-slate-300 opacity-0 transition-all hover:bg-slate-100 hover:text-slate-500 group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>

          <h3 className="mt-1.5 text-[15px] font-semibold leading-snug text-slate-900">
            {notification.title}
          </h3>

          {actor ? (
            <div className="mt-1 flex items-start gap-1.5">
              {actor.avatarUrl ? (
                <img
                  src={actor.avatarUrl}
                  alt={actor.name}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded-full ring-1 ring-slate-200"
                />
              ) : (
                <span
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ring-1 ring-slate-200"
                  style={{ backgroundColor: colors.bg, color: colors.fg }}
                >
                  {actor.name.charAt(0)}
                </span>
              )}
              <p className="text-[13px] leading-5 text-slate-500">
                <span className="font-medium text-slate-700">{actor.name}</span>{" "}
                {notification.message}
              </p>
            </div>
          ) : (
            <p className="mt-1 text-[13px] leading-5 text-slate-500">
              {notification.message}
            </p>
          )}

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {formatTimeAgo(notification.createdAt)}
            </span>

            {notification.actionUrl && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toast.dismiss(id)}
                  className="rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium text-slate-500 transition-colors hover:bg-slate-100"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(id);
                    onNavigate(notification.actionUrl!);
                  }}
                  className="group/btn flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px] font-medium text-white transition-transform active:scale-[0.97]"
                  style={{ backgroundColor: colors.fg }}
                >
                  {meta.actionLabel}
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover/btn:translate-x-0.5"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
