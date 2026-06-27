import { UserRound, BriefcaseBusiness } from "lucide-react";
import type { UserRole } from "../types/auth.types";

export interface RoleConfig {
  id: UserRole;
  title: string;
  description: string;
  features: string[];
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

export const ROLE_SELECTION_CONFIG: RoleConfig[] = [
  {
    id: "candidate",
    icon: UserRound,
    title: "I'm looking for a job",
    description: "Find great opportunities and grow your career.",
    features: [
      "Smart job matching",
      "Easy profile creation",
      "Chat with recruiters",
      "Resume & portfolio tools",
    ],
  },
  {
    id: "recruiter",
    icon: BriefcaseBusiness,
    title: "I'm hiring talent",
    description: "Source and hire top candidates efficiently.",
    features: [
      "AI candidate search",
      "Powerful filters",
      "Hiring pipeline",
      "Hiring analytics",
    ],
  },
];
