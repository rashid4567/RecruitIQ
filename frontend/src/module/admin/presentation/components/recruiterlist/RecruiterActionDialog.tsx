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
import { ShieldCheck, XCircle, Ban, ShieldOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecruiterActionDialogProps {
  open: boolean;
  recruiter: any;
  action: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RecruiterActionDialog({
  open,
  recruiter,
  action,
  onConfirm,
  onCancel,
}: RecruiterActionDialogProps) {
  if (!recruiter || !action) return null;

  const name = recruiter.companyName || recruiter.name || "this recruiter";

  const config = {
    verify: {
      title: "Verify Recruiter",
      description: `Grant verified status and full platform access to ${name}.`,
      icon: ShieldCheck,
      accentColor: "emerald",
      confirmText: "Verify",
    },
    reject: {
      title: "Reject Application",
      description: `Deny the verification request from ${name}. This cannot be undone.`,
      icon: XCircle,
      accentColor: "red",
      confirmText: "Reject",
    },
    block: {
      title: "Block Recruiter",
      description: `Immediately revoke all platform access for ${name}.`,
      icon: Ban,
      accentColor: "red",
      confirmText: "Block",
    },
    unblock: {
      title: "Unblock Recruiter",
      description: `Restore full platform access for ${name}.`,
      icon: ShieldOff,
      accentColor: "emerald",
      confirmText: "Unblock",
    },
  };

  const current = config[action as keyof typeof config];
  const Icon = current.icon;
  const isDestructive = current.accentColor === "red";

  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent className="max-w-md p-0 gap-0 border border-neutral-200/80 bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Accent Line */}
        <div
          className={cn(
            "h-1 w-full",
            isDestructive ? "bg-red-500" : "bg-emerald-500"
          )}
        />

        {/* Main Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon Container */}
            <div
              className={cn(
                "shrink-0 w-11 h-11 rounded-lg flex items-center justify-center",
                isDestructive
                  ? "bg-red-100 text-red-600"
                  : "bg-emerald-100 text-emerald-600"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
            </div>

            {/* Text Content */}
            <AlertDialogHeader className="space-y-1.5 text-left p-0 flex-1">
              <AlertDialogTitle className="text-base font-semibold text-neutral-900">
                {current.title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-neutral-500 leading-normal">
                {current.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-100" />

        {/* Footer */}
        <AlertDialogFooter className="p-4 bg-neutral-50/50 flex-row gap-2 sm:justify-end">
          <AlertDialogCancel className="h-9 px-4 rounded-md border border-neutral-200 bg-white text-neutral-600 text-sm font-medium hover:bg-neutral-100 hover:text-neutral-900 transition-colors m-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              "h-9 px-4 rounded-md text-sm font-medium text-white transition-colors m-0",
              isDestructive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            )}
          >
            {current.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
