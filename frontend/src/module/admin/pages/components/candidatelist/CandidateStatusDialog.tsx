import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidateStatusDialogProps {
  open: boolean;
  candidateName: string;
  action: "block" | "unblock";
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function CandidateStatusDialog({
  open,
  candidateName,
  action,
  loading,
  onOpenChange,
  onConfirm,
}: CandidateStatusDialogProps) {
  const isBlock = action === "block";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">

        <div className="absolute inset-0 -z-10">
          <div
            className={cn(
              "absolute inset-0 transition-all duration-300",
              isBlock
                ? "bg-linear-to-br from-red-50 via-white to-red-50/30 dark:from-red-950/30 dark:via-background dark:to-red-950/20"
                : "bg-linear-to-br from-green-50 via-white to-green-50/30 dark:from-green-950/30 dark:via-background dark:to-green-950/20"
            )}
          ></div>
          <div
            className={cn(
              "absolute -top-1/2 -right-1/3 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none",
              isBlock ? "bg-red-300" : "bg-green-300"
            )}
          ></div>
        </div>

        <button
          onClick={() => onOpenChange(false)}
          disabled={loading}
          className="absolute top-4 right-4 z-10 p-1 hover:bg-background/50 rounded-full transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>


        <div className="relative pt-12 pb-8 px-8">
          <div className="flex justify-center mb-6">
            <div
              className={cn(
                "relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl",
                isBlock
                  ? "bg-linear-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700"
                  : "bg-linear-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700"
              )}
            >
              <div className="absolute inset-0 rounded-full opacity-20 blur-md" style={{
                background: isBlock
                  ? 'radial-linear(circle, rgba(239,68,68,0.5))'
                  : 'radial-linear(circle, rgba(34,197,94,0.5))'
              }}></div>
              {isBlock ? (
                <AlertTriangle className="w-10 h-10 text-white relative z-10" />
              ) : (
                <CheckCircle2 className="w-10 h-10 text-white relative z-10" />
              )}
            </div>
          </div>

          <h2 className="text-center text-2xl font-bold text-foreground mb-2">
            {isBlock ? "Block This Candidate?" : "Unblock This Candidate?"}
          </h2>

        
          <div className="h-1 w-12 mx-auto mb-6 bg-linear-to-r from-transparent via-foreground/20 to-transparent rounded-full"></div>

  
          <p className="text-center text-muted-foreground mb-6 leading-relaxed">
            {isBlock
              ? `You&apos;re about to restrict access for ${candidateName}. This action will prevent them from viewing job opportunities.`
              : `You&apos;re about to restore full access for ${candidateName}. They will be able to view all job opportunities.`}
          </p>


          <div
            className={cn(
              "rounded-xl p-4 mb-8 border-2 transition-all duration-300",
              isBlock
                ? "border-red-200/50 bg-red-50/50 dark:border-red-800/50 dark:bg-red-950/20"
                : "border-green-200/50 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20"
            )}
          >
            <p
              className={cn(
                "text-sm font-semibold",
                isBlock
                  ? "text-red-700 dark:text-red-300"
                  : "text-green-700 dark:text-green-300"
              )}
            >
              {isBlock ? (
                <>
                  <span className="block mb-1">Impact:</span>
                  <ul className="space-y-1 text-xs font-normal">
                    <li>• Notifications will be suspended</li>
                    <li>• Job feed access restricted</li>
                    <li>• Applications blocked</li>
                  </ul>
                </>
              ) : (
                <>
                  <span className="block mb-1">Benefit:</span>
                  <ul className="space-y-1 text-xs font-normal">
                    <li>• Full notification access restored</li>
                    <li>• Job opportunities visible</li>
                    <li>• Can apply to positions</li>
                  </ul>
                </>
              )}
            </p>
          </div>

          <div className="text-center mb-8 px-4 py-3 rounded-lg bg-foreground/5 border border-foreground/10">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Candidate</p>
            <p className="text-lg font-bold text-foreground wrap-break-word">{candidateName}</p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 h-11 text-base font-semibold transition-all duration-200 hover:bg-foreground/5"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className={cn(
                "flex-1 h-11 text-base font-semibold transition-all duration-200 text-white shadow-lg hover:shadow-xl",
                isBlock
                  ? "bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800"
                  : "bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isBlock ? "Blocking..." : "Unblocking..."}
                </>
              ) : (
                isBlock ? "Block Candidate" : "Unblock Candidate"
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6 px-2">
            This action can be reversed at any time from the candidate details page.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
