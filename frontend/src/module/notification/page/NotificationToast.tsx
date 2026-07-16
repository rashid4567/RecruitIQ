import { useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { toast } from "sonner";

import {
  notificationMeta,
  categoryStyles,
  priorityStyles,
} from "./notificationMeta";
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

function formatCompactTime(createdAt: string | number | Date): string {
  const date = new Date(createdAt);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d`;

  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

const DRAG_DISMISS_THRESHOLD = 90;

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
  const dragStartX = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

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
    if (!paused) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") toast.dismiss(id);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [paused, id]);

  const pauseTimer = () => {
    remainingRef.current = Math.max(
      remainingRef.current - (Date.now() - startRef.current),
      0,
    );
    setPaused(true);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    setDragging(true);
    pauseTimer();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    setDragX(e.clientX - dragStartX.current);
  };

  const endDrag = () => {
    if (Math.abs(dragX) > DRAG_DISMISS_THRESHOLD) {
      toast.dismiss(id);
      return;
    }
    dragStartX.current = null;
    setDragging(false);
    setDragX(0);
    setPaused(false);
  };

  const iconStyle: React.CSSProperties = {
    background: colors.bg,
    color: colors.fg,
    boxShadow: `inset 0 1px 1px rgba(255,255,255,.6), 0 2px 8px -2px ${colors.fg}33`,
  };

  const cardStyle: React.CSSProperties = {
    ...(priority.glow
      ? {
          boxShadow: `0 12px 40px -8px rgba(15,23,42,.12), 0 0 0 1px ${colors.ring}`,
        }
      : undefined),
    transform: dragX !== 0 ? `translateX(${dragX}px)` : undefined,
    opacity: dragging ? 1 - Math.min(Math.abs(dragX) / 220, 0.6) : 1,
    transition: dragging
      ? "none"
      : "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease",
  };

  return (
    <div
      role="status"
      tabIndex={0}
      onMouseEnter={pauseTimer}
      onMouseLeave={() => setPaused(false)}
      onFocus={pauseTimer}
      onBlur={() => setPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{ touchAction: "pan-y", ...cardStyle }}
      className="group relative w-[calc(100vw-24px)] max-w-105 sm:max-w-107.5 lg:max-w-115 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_12px_40px_-8px_rgba(15,23,42,0.12)] outline-none transition-transform duration-200 ease-out animate-in fade-in slide-in-from-bottom-2 zoom-in-95 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-slate-300"
    >
      <div className="flex gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
        <div className="relative shrink-0">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-black/5 backdrop-blur-sm"
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
              className="rounded-full p-1 text-slate-300 opacity-0 transition-all hover:bg-slate-100 hover:text-slate-500 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              <X size={14} />
            </button>
          </div>

          <h3 className="mt-2 text-[15px] sm:text-base font-semibold leading-snug text-slate-900">
            {notification.title}
          </h3>

          {actor ? (
            <div className="mt-1.5 flex items-start gap-1.5">
              {actor.avatarUrl ? (
                <img
                  src={actor.avatarUrl}
                  alt={actor.name}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded-full ring-1 ring-slate-200"
                />
              ) : (
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ring-1 ring-slate-200"
                  style={{ backgroundColor: colors.bg, color: colors.fg }}
                >
                  {actor.name.charAt(0)}
                </span>
              )}
              <p className="text-sm leading-5 text-slate-500">
                <span className="font-medium text-slate-700">{actor.name}</span>{" "}
                {notification.message}
              </p>
            </div>
          ) : (
            <p className="mt-1.5 text-sm leading-5 text-slate-500">
              {notification.message}
            </p>
          )}

          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {formatCompactTime(notification.createdAt)}
            </span>

            {notification.actionUrl && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toast.dismiss(id)}
                  className="flex h-8.5 items-center rounded-lg px-2.5 text-[12.5px] font-medium text-slate-500 transition-colors hover:bg-slate-100"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(id);
                    onNavigate(notification.actionUrl!);
                  }}
                  className="group/btn flex h-8.5 items-center gap-1 rounded-lg px-3 text-[12.5px] font-medium text-white transition-transform active:scale-[0.97]"
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

      <div className="absolute inset-x-0 bottom-0 h-0.75 bg-slate-100">
        <div
          className="h-full ease-linear"
          style={{ width: `${progress}%`, backgroundColor: colors.fg }}
        />
      </div>
    </div>
  );
}
