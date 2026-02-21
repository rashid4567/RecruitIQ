
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Ban, CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Candidate } from "../../../domain/entities/candidates.entity";

interface CandidateProfileDialogsProps {
  profile: Candidate;
  blockDialogOpen: boolean;
  unblockDialogOpen: boolean;
  actionLoading: boolean;
  onBlockDialogChange: (open: boolean) => void;
  onUnblockDialogChange: (open: boolean) => void;
  onBlockConfirm: () => void;
  onUnblockConfirm: () => void;
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
      {/* Block Dialog */}
      <AlertDialog open={blockDialogOpen} onOpenChange={onBlockDialogChange}>
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-rose-50 rounded-full">
                <ShieldAlert className="w-10 h-10 text-rose-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-xl">Block Candidate?</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              <span className="font-medium">{profile.name}</span> will lose access to the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:gap-4">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onBlockConfirm}
              disabled={actionLoading}
              className="flex-1 bg-rose-600 hover:bg-rose-700"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Ban className="w-4 h-4 mr-2" />
              )}
              Block
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unblock Dialog */}
      <AlertDialog open={unblockDialogOpen} onOpenChange={onUnblockDialogChange}>
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-emerald-50 rounded-full">
                <ShieldCheck className="w-10 h-10 text-emerald-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-xl">Unblock Candidate?</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Restore access for <span className="font-medium">{profile.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:gap-4">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onUnblockConfirm}
              disabled={actionLoading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Unblock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}