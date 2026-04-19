import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, CheckCircle2, XCircle,
  Loader2, Rocket, Save, Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
  jobTitle?: string;
  error?: string | null;
  onRetry?: () => void;
  isEditMode?: boolean;
}

type DialogState = "confirm" | "publishing" | "success" | "error";

export default function PublishDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
  jobTitle,
  error,
  onRetry,
  isEditMode = false,
}: PublishDialogProps) {
  const [state, setState] = useState<DialogState>("confirm");

  // Reset when dialog opens
  useEffect(() => {
    if (open) setState("confirm");
  }, [open]);

  // Sync external submitting state
  useEffect(() => {
    if (isSubmitting) setState("publishing");
  }, [isSubmitting]);

  const handleConfirm = async () => {
    setState("publishing");
    try {
      await onConfirm();
      setState("success");
      setTimeout(() => {
        onOpenChange(false);
        setState("confirm");
      }, 2000);
    } catch {
      setState("error");
    }
  };

  const handleRetry = () => {
    setState("confirm");
    onRetry ? onRetry() : handleConfirm();
  };

  const handleClose = () => {
    if (state === "publishing") return;
    onOpenChange(false);
    setState("confirm");
  };

  // ── Mode-specific copy ───────────────────────────────────────────────────
  const copy = {
    title:          isEditMode ? "Save Changes"          : "Publish Job Post",
    description:    isEditMode ? "Update this job post"  : "Launch this job post",
    confirmBtn:     isEditMode ? "Save Changes"          : "Publish Job",
    loadingText:    isEditMode ? "Saving changes..."     : "Publishing your job...",
    loadingSubtext: isEditMode ? "Updating your post"    : "Making your job live",
    successTitle:   isEditMode ? "Changes Saved!"        : "Successfully Published!",
    successSubtext: isEditMode
      ? "Your job post has been updated"
      : "Your job is now live and accepting applications",
    errorTitle:     isEditMode ? "Save Failed"           : "Publish Failed",
    errorSubtext:   isEditMode
      ? "We couldn't save your changes. Please try again."
      : "We couldn't publish your job. Please try again.",
    whatNext: isEditMode
      ? [
          "Changes are immediately reflected",
          "Active applications won't be affected",
          "Candidates will see updated details",
          "Stats and analytics are preserved",
        ]
      : [
          "Job will be visible to all candidates",
          "Candidates can start applying immediately",
          "You'll receive notifications for applications",
          "You can edit or hide the job anytime",
        ],
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0">
        <AnimatePresence mode="wait">

          {/* ── Confirm ── */}
          {state === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              <DialogHeader className="text-center mb-6">
                {/* Icon */}
                <div className="mx-auto mb-4 relative w-fit">
                  <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping" />
                  <div className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg ${
                    isEditMode
                      ? "bg-linear-to-br from-amber-500 to-orange-500"
                      : "bg-linear-to-br from-emerald-500 to-teal-500"
                  }`}>
                    {isEditMode
                      ? <Save className="h-7 w-7 text-white" />
                      : <Rocket className="h-7 w-7 text-white" />
                    }
                  </div>
                </div>

                <DialogTitle className={`text-xl font-bold bg-clip-text text-transparent ${
                  isEditMode
                    ? "bg-linear-to-r from-amber-600 to-orange-600"
                    : "bg-linear-to-r from-emerald-600 to-teal-600"
                }`}>
                  {copy.title}
                </DialogTitle>

                <DialogDescription className="text-gray-500 mt-1 text-sm">
                  {jobTitle
                    ? <>{copy.description}{" — "}<span className="font-medium text-gray-800">"{jobTitle}"</span></>
                    : copy.description
                  }
                </DialogDescription>
              </DialogHeader>

              {/* What happens next */}
              <div className={`rounded-xl p-4 mb-6 ${
                isEditMode ? "bg-amber-50" : "bg-emerald-50"
              }`}>
                <p className={`text-xs font-semibold flex items-center gap-1.5 mb-3 ${
                  isEditMode ? "text-amber-800" : "text-emerald-800"
                }`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  What happens next?
                </p>
                <ul className="space-y-2">
                  {copy.whatNext.map((text, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className={`flex items-center gap-2 text-xs ${
                        isEditMode ? "text-amber-700" : "text-emerald-700"
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                        isEditMode ? "text-amber-500" : "text-emerald-500"
                      }`} />
                      {text}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <DialogFooter className="flex gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  className={`flex-1 shadow-md transition-all duration-200 ${
                    isEditMode
                      ? "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      : "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  }`}
                >
                  {isEditMode
                    ? <><Save className="w-4 h-4 mr-2" />{copy.confirmBtn}</>
                    : <><Rocket className="w-4 h-4 mr-2" />{copy.confirmBtn}</>
                  }
                </Button>
              </DialogFooter>
            </motion.div>
          )}

          {/* ── Publishing / Saving ── */}
          {state === "publishing" && (
            <motion.div
              key="publishing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="relative mb-6">
                  <div className={`absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse ${
                    isEditMode
                      ? "bg-linear-to-r from-amber-500 to-orange-500"
                      : "bg-linear-to-r from-emerald-500 to-teal-500"
                  }`} />
                  <Loader2 className={`w-14 h-14 animate-spin ${
                    isEditMode ? "text-amber-500" : "text-emerald-600"
                  }`} />
                </div>
                <p className="text-base font-semibold text-gray-800">{copy.loadingText}</p>
                <p className="text-sm text-gray-400 mt-1">{copy.loadingSubtext}</p>
                <div className="flex gap-1 mt-5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        isEditMode ? "bg-amber-400" : "bg-emerald-500"
                      }`}
                      animate={{ scale: [1, 1.6, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Success ── */}
          {state === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="relative mb-6"
                >
                  <div className="absolute inset-0 rounded-full bg-emerald-400 blur-xl opacity-25 animate-ping" />
                  <div className="relative flex h-18 w-18 h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-500 shadow-lg">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                </motion.div>
                <p className="text-xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {copy.successTitle}
                </p>
                <p className="text-sm text-gray-500 mt-1">{copy.successSubtext}</p>
              </div>
            </motion.div>
          )}

          {/* ── Error ── */}
          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-4">
                  <XCircle className="h-7 w-7 text-red-600" />
                </div>
                <p className="text-lg font-semibold text-red-800">{copy.errorTitle}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {error || copy.errorSubtext}
                </p>

                <div className="mt-5 w-full text-left bg-red-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-red-800 mb-2">Possible issues:</p>
                  <ul className="space-y-1.5">
                    {[
                      "Check your internet connection",
                      "Verify all required fields are filled",
                      "Try again in a few moments",
                    ].map((text, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-red-700">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 mt-5 w-full">
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    Close
                  </Button>
                  <Button
                    onClick={handleRetry}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}