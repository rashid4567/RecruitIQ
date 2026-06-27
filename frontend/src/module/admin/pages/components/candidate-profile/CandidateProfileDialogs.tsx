import {
  Loader2,
  ShieldX,
  ShieldCheck,
  AlertTriangle,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CandidateProfile } from "@/module/admin/types/candidate.types";

interface CandidateProfileDialogsProps {
  profile: CandidateProfile;
  blockDialogOpen: boolean;
  unblockDialogOpen: boolean;
  actionLoading: boolean;
  onBlockDialogChange: (open: boolean) => void;
  onUnblockDialogChange: (open: boolean) => void;
  onBlockConfirm: () => Promise<void>;
  onUnblockConfirm: () => Promise<void>;
}

export function CandidateProfileDialogs({
  profile,
  blockDialogOpen,
  unblockDialogOpen,
  actionLoading,
  onBlockDialogChange,
  onUnblockDialogChange,
  onBlockConfirm,
  onUnblockConfirm,
}: CandidateProfileDialogsProps) {
  return (
    <>
    
      <Dialog open={blockDialogOpen} onOpenChange={onBlockDialogChange}>
        <DialogContent className="p-0 border border-gray-100 shadow-xl rounded-2xl max-w-sm w-full bg-white overflow-hidden">

          <div className="h-1 w-full bg-linear-to-r from-red-400 to-rose-400" />

          <div className="px-7 pt-7 pb-7 flex flex-col items-center gap-5">

       
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
              <ShieldX className="w-7 h-7 text-red-500" strokeWidth={1.75} />
            </div>

            <DialogHeader className="text-center space-y-1.5 p-0">
              <DialogTitle className="text-lg font-semibold text-gray-900 tracking-tight">
                Block this candidate?
              </DialogTitle>
              <p className="text-sm text-gray-400 leading-relaxed">
                <span className="text-gray-700 font-medium">{profile.name}</span>{" "}
                will be removed from searches and recommendations immediately.
              </p>
            </DialogHeader>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-xs text-amber-700 font-medium">
                This action can be reversed later
              </span>
            </div>

            <DialogFooter className="w-full flex gap-3 p-0">
              <Button
                variant="outline"
                onClick={() => onBlockDialogChange(false)}
                disabled={actionLoading}
                className="flex-1 h-10 rounded-xl border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={onBlockConfirm}
                disabled={actionLoading}
                className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium shadow-sm"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldX className="w-4 h-4 mr-1.5" strokeWidth={2} />
                    Block
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={unblockDialogOpen} onOpenChange={onUnblockDialogChange}>
        <DialogContent className="p-0 border border-gray-100 shadow-xl rounded-2xl max-w-sm w-full bg-white overflow-hidden">

    
          <div className="h-1 w-full bg-linear-to-r from-emerald-400 to-teal-400" />

          <div className="px-7 pt-7 pb-7 flex flex-col items-center gap-5">

            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-emerald-500" strokeWidth={1.75} />
            </div>

            <DialogHeader className="text-center space-y-1.5 p-0">
              <DialogTitle className="text-lg font-semibold text-gray-900 tracking-tight">
                Unblock this candidate?
              </DialogTitle>
              <p className="text-sm text-gray-400 leading-relaxed">
                <span className="text-gray-700 font-medium">{profile.name}</span>{" "}
                will regain full visibility in searches and platform access.
              </p>
            </DialogHeader>


            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
              <Unlock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-xs text-emerald-700 font-medium">
                Access will be restored instantly
              </span>
            </div>

            <DialogFooter className="w-full flex gap-3 p-0">
              <Button
                variant="outline"
                onClick={() => onUnblockDialogChange(false)}
                disabled={actionLoading}
                className="flex-1 h-10 rounded-xl border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={onUnblockConfirm}
                disabled={actionLoading}
                className="flex-1 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium shadow-sm"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-1.5" strokeWidth={2} />
                    Unblock
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}