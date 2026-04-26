
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface SaveDraftDialogProps {
  open: boolean;
  isSaving: boolean;
  error: string | null;
  onSave: () => Promise<void>;
  onDiscard: () => void;
}

export default function SaveDraftDialog({
  open,
  isSaving,
  error,
  onSave,
  onDiscard,
}: SaveDraftDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !isSaving) onDiscard(); }}>
      <DialogContent className="sm:max-w-sm bg-white rounded-3xl p-0 shadow-2xl border border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8"
        >
          <DialogHeader className="text-center mb-6">
            <div className="mx-auto mb-4 w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <BookmarkIcon className="w-7 h-7 text-indigo-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Save your progress?
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              You have unsaved changes. Would you like to save this as a draft
              before leaving?
            </p>
          </DialogHeader>

          {error && (
            <p className="text-sm text-red-500 text-center mb-4">{error}</p>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onDiscard}
              disabled={isSaving}
              className="flex-1 h-11 text-gray-600"
            >
              Discard
            </Button>
            <Button
              onClick={onSave}
              disabled={isSaving}
              className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Draft"
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}