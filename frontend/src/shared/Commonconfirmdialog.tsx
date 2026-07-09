import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmVariant = "danger" | "success" | "warning" | "neutral";

const VARIANT_STYLES: Record<
  ConfirmVariant,
  {
    bar: string;
    iconWrap: string;
    icon: string;
    confirmBtn: string;
  }
> = {
  danger: {
    bar: "bg-linear-to-r from-red-400 to-rose-400",
    iconWrap: "bg-red-50 border-red-100",
    icon: "text-red-500",
    confirmBtn: "bg-red-500 hover:bg-red-600 focus-visible:ring-red-500",
  },
  success: {
    bar: "bg-linear-to-r from-emerald-400 to-teal-400",
    iconWrap: "bg-emerald-50 border-emerald-100",
    icon: "text-emerald-500",
    confirmBtn:
      "bg-emerald-500 hover:bg-emerald-600 focus-visible:ring-emerald-500",
  },
  warning: {
    bar: "bg-linear-to-r from-amber-400 to-orange-400",
    iconWrap: "bg-amber-50 border-amber-100",
    icon: "text-amber-500",
    confirmBtn: "bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-500",
  },
  neutral: {
    bar: "bg-linear-to-r from-gray-300 to-gray-400",
    iconWrap: "bg-gray-50 border-gray-100",
    icon: "text-gray-500",
    confirmBtn: "bg-gray-800 hover:bg-gray-900 focus-visible:ring-gray-800",
  },
};

export interface CommonConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  variant?: ConfirmVariant;
  confirmText: string;
  cancelText?: string;
  loading?: boolean;
  loadingText?: string;
  disableCloseOnLoading?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function CommonConfirmDialog({
  open,
  onOpenChange,
  icon,
  title,
  description,
  variant = "neutral",
  confirmText,
  cancelText = "Cancel",
  loading = false,
  loadingText,
  disableCloseOnLoading = true,
  onConfirm,
  onCancel,
  children,
  className,
}: CommonConfirmDialogProps) {
  const styles = VARIANT_STYLES[variant];

  const handleOpenChange = (next: boolean) => {
    if (!next && loading && disableCloseOnLoading) return;
    if (!next) onCancel?.();
    onOpenChange(next);
  };

  const handleCancel = () => {
    if (loading) return;
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "p-0 gap-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl sm:max-w-sm",
          className,
        )}
      >
        <div className={cn("h-1 w-full", styles.bar)} />

        <div className="flex flex-col items-center gap-5 px-7 pb-7 pt-7">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl border",
              styles.iconWrap,
            )}
          >
            <span className={cn("[&_svg]:h-7 [&_svg]:w-7", styles.icon)}>
              {icon}
            </span>
          </div>

          <DialogHeader className="space-y-1.5 p-0 text-center">
            <DialogTitle className="text-lg font-semibold tracking-tight text-gray-900">
              {title}
            </DialogTitle>
            <p className="text-sm leading-relaxed text-gray-400">
              {description}
            </p>
          </DialogHeader>

          {children && <div className="w-full">{children}</div>}

          <DialogFooter className="w-full gap-3 p-0 sm:flex-row">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="h-10 flex-1 rounded-xl border-gray-200 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className={cn(
                "h-10 flex-1 rounded-xl text-sm font-medium text-white shadow-sm",
                styles.confirmBtn,
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  {loadingText ?? confirmText}
                </>
              ) : (
                confirmText
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
