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

  useEffect(() => {
    if (open) setState("confirm");
  }, [open]);

  useEffect(() => {
    if (isSubmitting) setState("publishing");
  }, [isSubmitting]);

  const handleConfirm = async () => {
    setState("publishing");
    try {
      await onConfirm();
      setState("success");
    } catch {
      setState("error");
    }
  };

  const handleClose = () => {
    if (state === "publishing") return;
    onOpenChange(false);
    setTimeout(() => setState("confirm"), 250);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl p-0 shadow-2xl border border-gray-100">
        <AnimatePresence mode="wait">
          {/* Confirm State */}
          {state === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8"
            >
              <DialogHeader className="text-center mb-8">
                <div className="mx-auto mb-4 flex justify-center">
                  <div
                    className={`p-4 rounded-2xl ${
                      isEditMode
                        ? "bg-amber-100 text-amber-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {isEditMode ? (
                      <Save className="w-9 h-9" />
                    ) : (
                      <Rocket className="w-9 h-9" />
                    )}
                  </div>
                </div>

                <DialogTitle className="text-2xl font-semibold text-gray-900">
                  {isEditMode ? "Save Changes?" : "Publish Job Post?"}
                </DialogTitle>

                {jobTitle && (
                  <p className="text-gray-500 mt-1">"{jobTitle}"</p>
                )}
              </DialogHeader>

              <div className="text-center text-sm text-gray-600 mb-8">
                {isEditMode ? (
                  <p>Your changes will be updated and visible to candidates immediately.</p>
                ) : (
                  <p>This job will go live and candidates can start applying right away.</p>
                )}
              </div>

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
                  className={`flex-1 h-11 font-medium ${
                    isEditMode
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {isEditMode ? "Save Changes" : "Publish Now"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Publishing State */}
          {state === "publishing" && (
            <motion.div
              key="publishing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 flex flex-col items-center justify-center min-h-[280px]"
            >
              <Loader2 className="w-10 h-10 animate-spin text-gray-600 mb-6" />
              <p className="text-lg font-medium text-gray-800">
                {isEditMode ? "Saving changes..." : "Publishing job..."}
              </p>
              <p className="text-gray-500 text-sm mt-1">Please wait</p>
            </motion.div>
          )}

          {/* Success State */}
          {state === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 flex flex-col items-center justify-center min-h-[280px] text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {isEditMode ? "Changes Saved!" : "Job Published!"}
              </h3>
              <p className="text-gray-600">
                {isEditMode
                  ? "Your job post has been updated successfully."
                  : "Your job is now live and accepting applications."}
              </p>
              <Button onClick={handleClose} className="mt-8 px-8" size="lg">
                Go to My Jobs
              </Button>
            </motion.div>
          )}

          {/* Error State */}
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
                <h3 className="text-xl font-semibold text-red-700">Action Failed</h3>
                <p className="text-gray-600 mt-2 text-sm">
                  {error || "Something went wrong. Please try again."}
                </p>

                <div className="flex gap-3 mt-8 w-full">
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    Close
                  </Button>
                  <Button onClick={onRetry || handleConfirm} className="flex-1 bg-red-600 hover:bg-red-700">
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