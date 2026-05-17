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
import { Candidate } from "../../../domain/entities/candidates.entity";

interface CandidateProfileDialogsProps {
  profile: Candidate;
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
        <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-sm w-full overflow-visible">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl" />

            <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20" />

            <div
              className="absolute inset-0 opacity-[0.03] rounded-3xl"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />

            <div className="absolute inset-0 bg-linear-to-br from-rose-950/80 via-slate-950/75 to-slate-900/90 rounded-3xl" />

            <div className="relative px-8 pt-10 pb-8 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-rose-500/30 blur-xl scale-150" />
                <div className="relative w-16 h-16 rounded-2xl bg-rose-500/20 ring-1 ring-rose-400/30 flex items-center justify-center">
                  <ShieldX
                    className="w-8 h-8 text-rose-300"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              <DialogHeader className="text-center space-y-2 p-0">
                <DialogTitle className="text-xl font-semibold text-white tracking-tight">
                  Block candidate
                </DialogTitle>
                <p className="text-sm text-white/50 leading-relaxed">
                  <span className="text-white/80 font-medium">
                    {profile.name}
                  </span>{" "}
                  will be removed from searches and recommendations immediately.
                </p>
              </DialogHeader>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 ring-1 ring-rose-500/20">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="text-xs text-rose-300/90">
                  This action can be reversed later
                </span>
              </div>

              <DialogFooter className="w-full flex gap-3 p-0">
                <Button
                  variant="ghost"
                  onClick={() => onBlockDialogChange(false)}
                  disabled={actionLoading}
                  className="flex-1 h-11 rounded-xl text-white/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onBlockConfirm}
                  disabled={actionLoading}
                  className="flex-1 h-11 rounded-xl bg-rose-500/90 hover:bg-rose-500 text-white border border-rose-400/30 shadow-lg shadow-rose-950/40 transition-all duration-200 font-medium"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShieldX className="w-4 h-4 mr-2" strokeWidth={2} />
                      Block
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={unblockDialogOpen} onOpenChange={onUnblockDialogChange}>
        <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-sm w-full overflow-visible">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl" />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20" />
            <div
              className="absolute inset-0 opacity-[0.03] rounded-3xl"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />

            <div className="absolute inset-0 bg-linear-to-br from-emerald-950/80 via-slate-950/75 to-slate-900/90 rounded-3xl" />

            <div className="relative px-8 pt-10 pb-8 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-emerald-500/30 blur-xl scale-150" />
                <div className="relative w-16 h-16 rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-400/30 flex items-center justify-center">
                  <ShieldCheck
                    className="w-8 h-8 text-emerald-300"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              <DialogHeader className="text-center space-y-2 p-0">
                <DialogTitle className="text-xl font-semibold text-white tracking-tight">
                  Unblock candidate
                </DialogTitle>
                <p className="text-sm text-white/50 leading-relaxed">
                  <span className="text-white/80 font-medium">
                    {profile.name}
                  </span>{" "}
                  will regain full visibility in searches and platform access.
                </p>
              </DialogHeader>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-xs text-emerald-300/90">
                  Access will be restored instantly
                </span>
              </div>

              <DialogFooter className="w-full flex gap-3 p-0">
                <Button
                  variant="ghost"
                  onClick={() => onUnblockDialogChange(false)}
                  disabled={actionLoading}
                  className="flex-1 h-11 rounded-xl text-white/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onUnblockConfirm}
                  disabled={actionLoading}
                  className="flex-1 h-11 rounded-xl bg-emerald-500/90 hover:bg-emerald-500 text-white border border-emerald-400/30 shadow-lg shadow-emerald-950/40 transition-all duration-200 font-medium"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-2" strokeWidth={2} />
                      Unblock
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
