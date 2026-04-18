export interface JobCardProps {
  id: string;
  category: string;
  status: "Active" | "Paused" | "Expired" | "Draft";
  title: string;
  description: string;
  postedDate: string;
  expiresDate: string;
  location: string;
  jobType: string;
  salary: string;
  views: number;
  applications: number;
  shortlisted: number;
  avgAiScore: number;
  positionsFilled: number;
  department: string;
  requiredSkills: string[];
  // For modal
  applicants?: Applicant[]; // You can populate this later
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  aiScore: number;
  appliedDate: string;
  status: "pending" | "shortlisted" | "rejected" | "interviewed";
  experience: string;
}
export type ViewMode = "grid" | "list";