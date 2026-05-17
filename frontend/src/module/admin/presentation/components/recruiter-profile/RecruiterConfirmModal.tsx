import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
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
      <AlertDialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">


        <div className="relative bg-linear-to-br from-slate-900 to-slate-800 px-8 pt-10 pb-8">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

          <div className="relative flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
              <AlertTriangle className="h-7 w-7 text-rose-400" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
        </div>


        <div className="px-8 py-8 bg-white space-y-6">
          <p className="text-slate-600 leading-relaxed text-[15px]">{description}</p>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-12 rounded-2xl border-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                "flex-1 h-12 rounded-2xl font-semibold text-white shadow-lg",
                isDestructive
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              )}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {confirmText}
            </Button>
          </div>
        </div>

      </AlertDialogContent>
    </AlertDialog>
  );
}