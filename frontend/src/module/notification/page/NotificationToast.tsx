// NotificationToast.tsx
import { ArrowRight, X } from "lucide-react";
import { toast } from "sonner";

import { notificationMeta, categoryStyles } from "./notificationMeta";
import type { Notification } from "../types/notification.types";

interface Props {
  id: string | number;
  notification: Notification;
  onNavigate: (path: string) => void;
}

export default function NotificationToast({
  id,
  notification,
  onNavigate,
}: Props) {
  const meta = notificationMeta[notification.type];
  const colors = categoryStyles[meta.category];

  return (
    <div
      role="status"
      className="relative w-100 rounded-2xl bg-white shadow-[0_8px_28px_-6px_rgba(15,23,42,0.16)] ring-1 ring-black/5 animate-in slide-in-from-right-4 fade-in duration-200 overflow-hidden"
    >
      <div className="flex">
        <div className="relative flex w-16 shrink-0 items-center justify-center">
          <span className="absolute -top-2 right-0 h-4 w-4 -translate-x-1/2 rounded-full bg-slate-50" />
          <span className="absolute -bottom-2 right-0 h-4 w-4 -translate-x-1/2 rounded-full bg-slate-50" />
          <div
            className="relative flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.bg, color: colors.fg }}
          >
            {meta.icon}
            {meta.urgent && (
              <span
                className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white"
                style={{ backgroundColor: colors.fg }}
              >
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: colors.fg, opacity: 0.6 }}
                />
              </span>
            )}
          </div>
          <div
            className="absolute right-0 top-3 bottom-3 border-r border-dashed"
            style={{ borderColor: colors.ring }}
          />
        </div>

        <div className="min-w-0 flex-1 py-3 pl-3 pr-3">
          <div className="flex items-start justify-between gap-2">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.08em]"
              style={{
                color: colors.fg,
                fontFamily:
                  "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
              }}
            >
              {meta.eyebrow}
            </span>
            <button
              onClick={() => toast.dismiss(id)}
              aria-label="Dismiss notification"
              className="-mr-1 -mt-1 rounded-full p-1 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500"
            >
              <X size={14} />
            </button>
          </div>

          <h3
            className="mt-0.5 text-[15px] font-semibold leading-snug text-slate-900"
            style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
          >
            {notification.title}
          </h3>

          <p className="mt-1 text-[13px] leading-5 text-slate-500 line-clamp-2">
            {notification.message}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Just now</span>

            {notification.actionUrl && (
              <button
                onClick={() => {
                  toast.dismiss(id);
                  onNavigate(notification.actionUrl!);
                }}
                className="group flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px] font-medium text-white transition-transform active:scale-[0.97]"
                style={{ backgroundColor: colors.fg }}
              >
                View
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}