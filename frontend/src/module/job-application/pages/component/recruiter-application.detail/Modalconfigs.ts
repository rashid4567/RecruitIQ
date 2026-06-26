import { UserCheck, CalendarPlus, Trophy, UserX } from "lucide-react";
import type { ModalAction, ModalConfig } from "./Index";

export const MODAL_CONFIGS: Record<Exclude<ModalAction, null>, ModalConfig> = {
  shortlist: {
    title: "Shortlist this candidate?",
    description:
      "The candidate will be moved to the Shortlisted stage and may be notified of their progress.",
    confirmLabel: "Yes, shortlist",
    confirmClass: "bg-blue-600 hover:bg-blue-700",
    Icon: UserCheck,
    iconClass: "bg-blue-50 text-blue-600",
  },
  interview: {
    title: "Schedule an interview?",
    description:
      "The candidate's status will be updated to Interview Scheduled. You can coordinate timing separately.",
    confirmLabel: "Confirm scheduling",
    confirmClass: "bg-amber-500 hover:bg-amber-600",
    Icon: CalendarPlus,
    iconClass: "bg-amber-50 text-amber-600",
  },
  select: {
    title: "Mark as Selected?",
    description:
      "This will mark the candidate as the chosen applicant for this role. This action can be revisited.",
    confirmLabel: "Yes, select candidate",
    confirmClass: "bg-emerald-600 hover:bg-emerald-700",
    Icon: Trophy,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  reject: {
    title: "Reject this candidate?",
    description: "The candidate will be removed from consideration.",
    confirmLabel: "Reject candidate",
    confirmClass: "bg-red-600 hover:bg-red-700",
    Icon: UserX,
    iconClass: "bg-red-50 text-red-600",
    requireReason: false,
    reasonLabel: "Reason for rejection (Optional)",
    reasonPlaceholder: "Optional feedback for the candidate",
  },
};
