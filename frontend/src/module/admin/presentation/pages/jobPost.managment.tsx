"use client";

import { useState } from "react";
import {
  Users,
  Mail,
  Briefcase,
  Search,
  Download,
  ChevronDown,
  Filter,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  Edit,
  Trash2,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  Building,
  ExternalLink,
  Shield,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Sidebar from "@/components/admin/sideBar";

// ==================== TYPES ====================
interface Recruiter {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar: string;
  phone: string;
  totalJobs: number;
}

interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship" | "Remote";
  salary: string;
  status: "active" | "pending" | "blocked" | "expired";
  postedDate: string;
  expiryDate: string;
  applications: number;
  views: number;
  isBlocked: boolean;
  recruiter: Recruiter;
  description: string;
  requirements: string[];
  benefits: string[];
}

// ==================== MOCK DATA ====================
const initialJobPosts: JobPost[] = [
  {
    id: "JOB-001",
    title: "Senior Frontend Developer",
    company: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    status: "active",
    postedDate: "2024-01-15",
    expiryDate: "2024-02-15",
    applications: 45,
    views: 230,
    isBlocked: false,
    recruiter: {
      id: "r1",
      name: "Alice Johnson",
      email: "alice.j@techinnovations.com",
      company: "Tech Innovations Inc.",
      avatar: "",
      phone: "+1 (555) 123-4567",
      totalJobs: 12,
    },
    description:
      "We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for building and maintaining high-performance web applications using modern technologies.",
    requirements: [
      "5+ years of experience in frontend development",
      "Expert knowledge of React, TypeScript, and modern CSS",
      "Experience with state management (Redux, Zustand, or similar)",
      "Strong understanding of web performance optimization",
      "Excellent communication and teamwork skills",
    ],
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "Flexible work arrangements",
      "Professional development budget",
    ],
  },
  {
    id: "JOB-002",
    title: "Product Manager",
    company: "Global Solutions Ltd.",
    location: "New York, NY",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    status: "pending",
    postedDate: "2024-01-18",
    expiryDate: "2024-02-18",
    applications: 32,
    views: 180,
    isBlocked: false,
    recruiter: {
      id: "r2",
      name: "Bob Smith",
      email: "bob.s@globalsolutions.com",
      company: "Global Solutions Ltd.",
      avatar: "",
      phone: "+1 (555) 234-5678",
      totalJobs: 25,
    },
    description:
      "Seeking an experienced Product Manager to lead our product initiatives and drive innovation across our platform.",
    requirements: [
      "3+ years of product management experience",
      "Strong understanding of Agile methodology",
      "Excellent communication and leadership skills",
      "Data-driven decision making",
    ],
    benefits: [
      "Remote-friendly",
      "Annual bonus",
      "Stock options",
      "Unlimited PTO",
    ],
  },
  {
    id: "JOB-003",
    title: "UX Designer",
    company: "Creative Minds Agency",
    location: "Los Angeles, CA",
    type: "Contract",
    salary: "$80,000 - $100,000",
    status: "blocked",
    postedDate: "2024-01-10",
    expiryDate: "2024-02-10",
    applications: 18,
    views: 95,
    isBlocked: true,
    recruiter: {
      id: "r3",
      name: "Charlie Brown",
      email: "charlie.b@creativeminds.com",
      company: "Creative Minds Agency",
      avatar: "",
      phone: "+1 (555) 345-6789",
      totalJobs: 5,
    },
    description:
      "Creative Minds is hiring a talented UX Designer to create intuitive and engaging user experiences.",
    requirements: [
      "Figma expertise required",
      "Strong portfolio showcasing UX work",
      "User research and testing skills",
      "Wireframing and prototyping experience",
    ],
    benefits: ["Creative environment", "Flexible hours", "Project bonuses"],
  },
  {
    id: "JOB-004",
    title: "Backend Engineer",
    company: "Future Connect",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    status: "active",
    postedDate: "2024-01-20",
    expiryDate: "2024-02-20",
    applications: 67,
    views: 320,
    isBlocked: false,
    recruiter: {
      id: "r4",
      name: "Diana Prince",
      email: "diana.p@futureconnect.com",
      company: "Future Connect",
      avatar: "",
      phone: "+1 (555) 456-7890",
      totalJobs: 18,
    },
    description:
      "Join our backend team and build scalable systems that power millions of users worldwide.",
    requirements: [
      "Node.js or Python expertise",
      "Database design and optimization",
      "RESTful API development",
      "Cloud services experience (AWS/GCP)",
    ],
    benefits: [
      "Work from anywhere",
      "Top-tier hardware",
      "Learning budget",
      "Health benefits",
    ],
  },
  {
    id: "JOB-005",
    title: "Data Scientist",
    company: "Healthcare Innovations",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$140,000 - $180,000",
    status: "expired",
    postedDate: "2023-12-01",
    expiryDate: "2024-01-01",
    applications: 89,
    views: 450,
    isBlocked: false,
    recruiter: {
      id: "r5",
      name: "Eve Adams",
      email: "eve.a@healthcareinnovations.com",
      company: "Healthcare Innovations",
      avatar: "",
      phone: "+1 (555) 567-8901",
      totalJobs: 8,
    },
    description:
      "Looking for a Data Scientist to drive insights and build ML models for healthcare applications.",
    requirements: [
      "Python/R proficiency",
      "Machine Learning expertise",
      "Statistical analysis skills",
      "Healthcare domain knowledge preferred",
    ],
    benefits: [
      "Meaningful work",
      "Research opportunities",
      "Conference budget",
      "Sabbatical",
    ],
  },
  {
    id: "JOB-006",
    title: "DevOps Engineer",
    company: "Tech Innovations Inc.",
    location: "Remote",
    type: "Remote",
    salary: "$115,000 - $145,000",
    status: "active",
    postedDate: "2024-01-22",
    expiryDate: "2024-02-22",
    applications: 28,
    views: 156,
    isBlocked: false,
    recruiter: {
      id: "r1",
      name: "Alice Johnson",
      email: "alice.j@techinnovations.com",
      company: "Tech Innovations Inc.",
      avatar: "",
      phone: "+1 (555) 123-4567",
      totalJobs: 12,
    },
    description:
      "We need a DevOps Engineer to manage our infrastructure and improve deployment processes.",
    requirements: [
      "AWS/GCP certification preferred",
      "Docker and Kubernetes expertise",
      "CI/CD pipeline experience",
      "Infrastructure as Code (Terraform/Pulumi)",
    ],
    benefits: [
      "100% remote",
      "Equipment stipend",
      "Async-first culture",
      "Wellness program",
    ],
  },
  {
    id: "JOB-007",
    title: "Marketing Manager",
    company: "Global Solutions Ltd.",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$90,000 - $120,000",
    status: "pending",
    postedDate: "2024-01-25",
    expiryDate: "2024-02-25",
    applications: 41,
    views: 210,
    isBlocked: false,
    recruiter: {
      id: "r2",
      name: "Bob Smith",
      email: "bob.s@globalsolutions.com",
      company: "Global Solutions Ltd.",
      avatar: "",
      phone: "+1 (555) 234-5678",
      totalJobs: 25,
    },
    description:
      "Lead our marketing efforts and brand strategy to expand our market presence.",
    requirements: [
      "Digital marketing expertise",
      "SEO/SEM experience",
      "Team leadership skills",
      "Budget management",
    ],
    benefits: [
      "Performance bonuses",
      "Career growth",
      "Team events",
      "Modern office",
    ],
  },
];

// ==================== HEADER ====================
function Header() {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant="secondary"
            className="gap-1.5 bg-primary/10 text-primary border-0"
          >
            <Shield className="w-3.5 h-3.5" />
            HireSmart Admin
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Job Post Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage, review, and moderate all job postings on the platform
        </p>
      </div>
      <Avatar className="w-11 h-11 ring-2 ring-border">
        <AvatarImage src="" />
        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
          AD
        </AvatarFallback>
      </Avatar>
    </header>
  );
}

// ==================== FILTERS ====================
const tabs = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "pending", label: "Pending Approval" },
  { id: "blocked", label: "Blocked" },
  { id: "expired", label: "Expired" },
];

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalJobs: number;
}

function Filters({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  totalJobs,
}: FiltersProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="flex items-center gap-1 p-1.5 bg-muted rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium rounded-lg transition-all",
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search job posts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-72 h-11 rounded-xl bg-card"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 h-11 rounded-xl">
                <Filter className="w-4 h-4" />
                Advanced Filters
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem>By Date Posted</DropdownMenuItem>
              <DropdownMenuItem>By Applications</DropdownMenuItem>
              <DropdownMenuItem>By Job Type</DropdownMenuItem>
              <DropdownMenuItem>By Location</DropdownMenuItem>
              <DropdownMenuItem>By Recruiter</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Clear Filters</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">{totalJobs}</span> job
          posts
        </p>
        <Button className="gap-2 h-10 rounded-xl bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </div>
    </div>
  );
}

// ==================== JOB TABLE ====================
const ITEMS_PER_PAGE = 5;

interface JobTableProps {
  jobs: JobPost[];
  onToggleBlock: (job: JobPost) => void;
  onViewJob: (job: JobPost) => void;
}

function JobTable({ jobs, onToggleBlock, onViewJob }: JobTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJobs = jobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusBadge = (status: JobPost["status"]) => {
    const config = {
      active: {
        class: "bg-emerald-100 text-emerald-700 border-emerald-200",
        label: "Active",
      },
      pending: {
        class: "bg-amber-100 text-amber-700 border-amber-200",
        label: "Pending",
      },
      blocked: {
        class: "bg-red-100 text-red-700 border-red-200",
        label: "Blocked",
      },
      expired: {
        class: "bg-gray-100 text-gray-600 border-gray-200",
        label: "Expired",
      },
    };
    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border",
          config[status].class,
        )}
      >
        {config[status].label}
      </span>
    );
  };

  const getTypeBadge = (type: JobPost["type"]) => {
    const colors: Record<string, string> = {
      "Full-time": "bg-blue-50 text-blue-700",
      "Part-time": "bg-orange-50 text-orange-700",
      Contract: "bg-purple-50 text-purple-700",
      Internship: "bg-pink-50 text-pink-700",
      Remote: "bg-teal-50 text-teal-700",
    };
    return (
      <span
        className={cn(
          "px-2 py-0.5 text-xs font-medium rounded-md",
          colors[type] || "bg-gray-50 text-gray-700",
        )}
      >
        {type}
      </span>
    );
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getApplicationsBar = (applications: number) => {
    const percentage = Math.min((applications / 100) * 100, 100);
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-foreground w-8">
          {applications}
        </span>
        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Job Details
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Posted By
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Applications
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Active
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Posted
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedJobs.map((job) => (
              <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {job.company}
                        </span>
                        {getTypeBadge(job.type)}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {job.views} views
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 ring-2 ring-border">
                      <AvatarImage src={job.recruiter.avatar} />
                      <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                        {job.recruiter.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {job.recruiter.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                        {job.recruiter.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">{getStatusBadge(job.status)}</td>
                <td className="px-6 py-5">
                  {getApplicationsBar(job.applications)}
                </td>
                <td className="px-6 py-5">
                  <Switch
                    checked={!job.isBlocked}
                    onCheckedChange={() => onToggleBlock(job)}
                    className="data-[state=checked]:bg-primary"
                  />
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-medium text-foreground">
                    {formatDate(job.postedDate)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Exp: {formatDate(job.expiryDate)}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem
                        onClick={() => onViewJob(job)}
                        className="gap-2.5"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5">
                        <Edit className="w-4 h-4" />
                        Edit Job
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5">
                        <ExternalLink className="w-4 h-4" />
                        View Public Page
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleBlock(job)}
                        className={cn(
                          "gap-2.5",
                          job.isBlocked ? "text-emerald-600" : "text-amber-600",
                        )}
                      >
                        {job.isBlocked ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Unblock Job
                          </>
                        ) : (
                          <>
                            <Ban className="w-4 h-4" />
                            Block Job
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5 text-destructive focus:text-destructive">
                        <Trash2 className="w-4 h-4" />
                        Delete Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-border bg-muted/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="gap-1.5 rounded-lg"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <div className="flex items-center gap-1 mx-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                "w-9 h-9 text-sm font-medium rounded-lg transition-all",
                currentPage === page
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {page}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="gap-1.5 rounded-lg"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-border text-sm text-muted-foreground">
        © 2025 HireSmart Admin. All rights reserved.
      </div>
    </div>
  );
}

// ==================== VIEW MODAL ====================
interface ViewModalProps {
  job: JobPost | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleBlock: (job: JobPost) => void;
}

function ViewModal({ job, isOpen, onClose, onToggleBlock }: ViewModalProps) {
  if (!job) return null;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getStatusBadge = (status: JobPost["status"]) => {
    const config = {
      active: {
        class: "bg-emerald-100 text-emerald-700 border-emerald-200",
        label: "Active",
      },
      pending: {
        class: "bg-amber-100 text-amber-700 border-amber-200",
        label: "Pending Review",
      },
      blocked: {
        class: "bg-red-100 text-red-700 border-red-200",
        label: "Blocked",
      },
      expired: {
        class: "bg-gray-100 text-gray-600 border-gray-200",
        label: "Expired",
      },
    };
    return (
      <span
        className={cn(
          "inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-full border",
          config[status].class,
        )}
      >
        {config[status].label}
      </span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shrink-0">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <DialogTitle className="text-xl font-bold">
                  {job.title}
                </DialogTitle>
                {getStatusBadge(job.status)}
              </div>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Building className="w-4 h-4" />
                {job.company}
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Location
                  </span>
                </div>
                <p className="font-semibold text-foreground">{job.location}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Job Type
                  </span>
                </div>
                <p className="font-semibold text-foreground">{job.type}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Salary
                  </span>
                </div>
                <p className="font-semibold text-foreground text-sm">
                  {job.salary}
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Applications
                  </span>
                </div>
                <p className="font-semibold text-foreground">
                  {job.applications}
                </p>
              </div>
            </div>

            {/* Dates & Views */}
            <div className="flex flex-wrap items-center gap-6 p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Posted:</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatDate(job.postedDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Expires:</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatDate(job.expiryDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Views:</span>
                <span className="text-sm font-semibold text-foreground">
                  {job.views}
                </span>
              </div>
            </div>

            {/* Recruiter Info */}
            <div className="p-5 border border-border rounded-xl bg-gradient-to-br from-muted/30 to-transparent">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                Posted By (Recruiter)
              </h3>
              <div className="flex items-start gap-4">
                <Avatar className="w-14 h-14 ring-2 ring-border">
                  <AvatarImage src={job.recruiter.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-lg font-semibold">
                    {job.recruiter.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-lg">
                    {job.recruiter.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {job.recruiter.company}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      {job.recruiter.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4" />
                      {job.recruiter.phone}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    <span className="font-medium text-foreground">
                      {job.recruiter.totalJobs}
                    </span>{" "}
                    jobs posted on platform
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </Button>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Job Description
              </h3>
              <p className="text-foreground leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Requirements
              </h3>
              <ul className="space-y-2.5">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Benefits
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((benefit, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="rounded-lg py-1.5 px-3"
                    >
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-muted-foreground">
              Job ID:{" "}
              <span className="font-mono font-semibold text-foreground">
                {job.id}
              </span>
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-xl"
              >
                Close
              </Button>
              {job.isBlocked ? (
                <Button
                  onClick={() => {
                    onToggleBlock(job);
                    onClose();
                  }}
                  className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle className="w-4 h-4" />
                  Unblock Job
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => {
                    onToggleBlock(job);
                    onClose();
                  }}
                  className="gap-2 rounded-xl"
                >
                  <Ban className="w-4 h-4" />
                  Block Job
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== BLOCK CONFIRMATION DIALOG ====================
interface BlockDialogProps {
  job: JobPost | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function BlockConfirmDialog({
  job,
  isOpen,
  onClose,
  onConfirm,
}: BlockDialogProps) {
  if (!job) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3">
            {job.isBlocked ? (
              <>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                Unblock Job Post
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Ban className="w-5 h-5 text-red-600" />
                </div>
                Block Job Post
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-2">
            {job.isBlocked ? (
              <>
                Are you sure you want to unblock <strong>{job.title}</strong> at{" "}
                <strong>{job.company}</strong>? This will make the job visible
                to candidates again.
              </>
            ) : (
              <>
                Are you sure you want to block <strong>{job.title}</strong> at{" "}
                <strong>{job.company}</strong>? This will hide the job from
                candidates and notify the recruiter.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              "rounded-xl",
              job.isBlocked
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-destructive hover:bg-destructive/90",
            )}
          >
            {job.isBlocked ? "Unblock" : "Block"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ==================== MAIN COMPONENT ====================
export default function JobPostManagement() {
  const [jobPosts, setJobPosts] = useState<JobPost[]>(initialJobPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [jobToBlock, setJobToBlock] = useState<JobPost | null>(null);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);

  const handleToggleBlock = (job: JobPost) => {
    setJobToBlock(job);
    setIsBlockDialogOpen(true);
  };

  const confirmToggleBlock = () => {
    if (!jobToBlock) return;
    setJobPosts((prev) =>
      prev.map((job) =>
        job.id === jobToBlock.id
          ? {
              ...job,
              isBlocked: !job.isBlocked,
              status: !job.isBlocked ? "blocked" : "active",
            }
          : job,
      ),
    );
    setIsBlockDialogOpen(false);
    setJobToBlock(null);
  };

  const handleViewJob = (job: JobPost) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
  };

  const filteredJobs = jobPosts.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.recruiter.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && job.status === "active") ||
      (activeTab === "pending" && job.status === "pending") ||
      (activeTab === "blocked" && job.status === "blocked") ||
      (activeTab === "expired" && job.status === "expired");

    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <Header />
        <Filters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          totalJobs={filteredJobs.length}
        />
        <JobTable
          jobs={filteredJobs}
          onToggleBlock={handleToggleBlock}
          onViewJob={handleViewJob}
        />
        <ViewModal
          job={selectedJob}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onToggleBlock={handleToggleBlock}
        />
        <BlockConfirmDialog
          job={jobToBlock}
          isOpen={isBlockDialogOpen}
          onClose={() => setIsBlockDialogOpen(false)}
          onConfirm={confirmToggleBlock}
        />
      </main>
    </div>
  );
}
