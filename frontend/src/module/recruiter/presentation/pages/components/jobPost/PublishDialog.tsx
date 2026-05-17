
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Rocket,
  Save,
  BookmarkIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  onSaveDraft?: () => Promise<void>;
  onPublish?: () => Promise<void>;
  onSuccess?: () => void;
  isSubmitting: boolean;
  jobTitle?: string;
  error?: string | null;
  onRetry?: () => Promise<void>;
  isEditMode?: boolean;
}

type DialogState = "confirm" | "publishing" | "success" | "error";
type EditAction = "draft" | "publish" | null;

export default function PublishDialog({
  open,
  onOpenChange,
  onConfirm,
  onSaveDraft,
  onPublish,
  onSuccess,
  isSubmitting,
  jobTitle,
  error,
  onRetry,
  isEditMode = false,
}: PublishDialogProps) {
  const [state, setState] = useState<DialogState>("confirm");
  const [lastEditAction, setLastEditAction] = useState<EditAction>(null);

  useEffect(() => {
    if (open) {
      setState("confirm");
      setLastEditAction(null);
    }
  }, [open]);

  useEffect(() => {
    if (isSubmitting) setState("publishing");
  }, [isSubmitting]);


  const handleConfirm = async () => {
    setState("publishing");
    try {
      await onConfirm();
      setState("success");
      onSuccess?.();
    } catch {
      setState("error");
    }
  };


  const handleSaveDraft = async () => {
    if (!onSaveDraft) return;
    setLastEditAction("draft");
    setState("publishing");
    try {
      await onSaveDraft();
      setState("success");
      onSuccess?.();
    } catch {
      setState("error");
    }
  };


  const handlePublish = async () => {
    if (!onPublish) return;
    setLastEditAction("publish");
    setState("publishing");
    try {
      await onPublish();
      setState("success");
      onSuccess?.();
    } catch {
      setState("error");
    }
  };


  const handleRetry = async () => {
    if (onRetry) {
      setState("publishing");
      try {
        await onRetry();
        setState("success");
        onSuccess?.();
      } catch {
        setState("error");
      }
      return;
    }
    if (isEditMode) {
      if (lastEditAction === "draft") handleSaveDraft();
      else if (lastEditAction === "publish") handlePublish();
    } else {
      handleConfirm();
    }
  };

  const handleClose = () => {
    if (state === "publishing") return;
    onOpenChange(false);
    setTimeout(() => {
      setState("confirm");
      setLastEditAction(null);
    }, 250);
  };


  const handleGoToJobs = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl p-0 shadow-2xl border border-gray-100">
        <AnimatePresence mode="wait">

          {/* ── Confirm ─────────────────────────────────────────────────────── */}
          {state === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8"
            >
              <DialogHeader className="text-center mb-6">
                <div className="mx-auto mb-4 flex justify-center">
                  <div className={`p-4 rounded-2xl ${
                    isEditMode
                      ? "bg-amber-100 text-amber-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}>
                    {isEditMode
                      ? <Save className="w-9 h-9" />
                      : <Rocket className="w-9 h-9" />
                    }
                  </div>
                </div>
                <DialogTitle className="text-2xl font-semibold text-gray-900">
                  {isEditMode ? "What would you like to do?" : "Publish Job Post?"}
                </DialogTitle>
                {jobTitle && (
                  <p className="text-gray-500 mt-1 text-sm">"{jobTitle}"</p>
                )}
              </DialogHeader>

              {isEditMode ? (
           
                <div className="space-y-3 mb-6">
                  {/* Save as Draft */}
                  <button
                    onClick={handleSaveDraft}
                    className="w-full text-left p-4 rounded-2xl border-2 border-indigo-100 bg-indigo-50 hover:border-indigo-300 hover:bg-indigo-100 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-indigo-100 group-hover:bg-indigo-200 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                        <BookmarkIcon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Save as Draft
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Save your changes privately. The job won't be visible
                          to candidates yet.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Save & Publish */}
                  <button
                    onClick={handlePublish}
                    className="w-full text-left p-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50 hover:border-emerald-300 hover:bg-emerald-100 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                        <Rocket className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Save &amp; Publish
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Save your changes and make the job live. Candidates
                          can apply immediately.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
         
                <p className="text-center text-sm text-gray-600 mb-8">
                  This job will go live and candidates can start applying right
                  away.
                </p>
              )}

              {isEditMode ? (
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="w-full h-11"
                >
                  Cancel
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 h-11"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    className="flex-1 h-11 font-medium bg-emerald-600 hover:bg-emerald-700"
                  >
                    Publish Now
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Publishing ──────────────────────────────────────────────────── */}
          {state === "publishing" && (
            <motion.div
              key="publishing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 flex flex-col items-center justify-center min-h-70"
            >
              <Loader2 className="w-10 h-10 animate-spin text-gray-600 mb-6" />
              <p className="text-lg font-medium text-gray-800">
                {isEditMode && lastEditAction === "draft"
                  ? "Saving draft..."
                  : isEditMode
                  ? "Publishing changes..."
                  : "Publishing job..."}
              </p>
              <p className="text-gray-500 text-sm mt-1">Please wait</p>
            </motion.div>
          )}

          {/* ── Success ─────────────────────────────────────────────────────── */}
          {state === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 flex flex-col items-center justify-center min-h-70 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {isEditMode && lastEditAction === "draft"
                  ? "Draft Saved!"
                  : isEditMode
                  ? "Published!"
                  : "Job Published!"}
              </h3>
              <p className="text-gray-600 text-sm">
                {isEditMode && lastEditAction === "draft"
                  ? "Your changes have been saved as a draft."
                  : isEditMode
                  ? "Your changes are live and visible to candidates."
                  : "Your job is now live and accepting applications."}
              </p>
              <Button
                onClick={handleGoToJobs}
                className="mt-8 px-8"
                size="lg"
              >
                Go to My Jobs
              </Button>
            </motion.div>
          )}

          {/* ── Error ───────────────────────────────────────────────────────── */}
          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <XCircle className="w-9 h-9 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-red-700">
                  {lastEditAction === "draft" ? "Save Failed" : "Publish Failed"}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">
                  {error || "Something went wrong. Please try again."}
                </p>
                <div className="flex gap-3 mt-8 w-full">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Cancel
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