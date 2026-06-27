import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecruiterConfirmModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText: string;
  variant: "default" | "destructive";
  onConfirm: () => void;
  loading: boolean;
}

export function RecruiterConfirmModal({
  open,
  onClose,
  title,
  description,
  confirmText,
  variant,
  onConfirm,
  loading,
}: RecruiterConfirmModalProps) {
  const isDestructive = variant === "destructive";

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent className="sm:max-w-sm p-0 border border-gray-100 shadow-xl rounded-2xl bg-white overflow-hidden">

        <div
          className={cn(
            "h-1 w-full",
            isDestructive
              ? "bg-linear-to-r from-red-400 to-rose-400"
              : "bg-linear-to-r from-emerald-400 to-teal-400"
          )}
        />

        <div className="px-7 pt-7 pb-7 flex flex-col items-center gap-5">

          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center border",
              isDestructive
                ? "bg-red-50 border-red-100"
                : "bg-emerald-50 border-emerald-100"
            )}
          >
            {isDestructive ? (
              <AlertTriangle
                className="w-7 h-7 text-red-500"
                strokeWidth={1.75}
              />
            ) : (
              <ShieldCheck
                className="w-7 h-7 text-emerald-500"
                strokeWidth={1.75}
              />
            )}
          </div>

          <div className="text-center space-y-1.5">
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h2>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
          </div>
          <div className="w-full flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-10 rounded-xl border-gray-200 text-gray-500 hover:bg-gray-50 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                "flex-1 h-10 rounded-xl text-white text-sm font-medium shadow-sm",
                isDestructive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              )}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>

      </AlertDialogContent>
    </AlertDialog>
  );
}