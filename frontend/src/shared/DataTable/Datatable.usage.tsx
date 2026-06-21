// /**
//  * DataTable.usage.tsx
//  * ───────────────────
//  * Ready-to-use table components for every admin section.
//  * Copy the relevant function into your feature file and wire up your props.
//  *
//  * Tables covered:
//  *   1. RecruiterTable
//  *   2. CandidateTable
//  *   3. EmailLogTable
//  *   4. ActivityLogTable
//  *   5. SubscriptionTable
//  *   6. JobPostTable
//  */

// import { DataTable, type ColumnDef, type SkeletonCellPreset } from "./DataTable";
// import {
//   StatusBadge,
//   VerificationBadge,
//   EmailStatusBadge,
//   SubscriptionStatusBadge,
//   JobStatusBadge,
//   RoleBadge,
//   CountBadge,
//   formatDate,
//   getExperienceDisplay,
//   getInitials,
// } from "./table-helpers";

// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Eye,
//   MoreVertical,
//   ShieldCheck,
//   XCircle,
//   Ban,
//   Shield,
//   MapPin,
//   Briefcase,
//   Calendar,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// // ─── Types (replace with your domain imports) ─────────────────────────────────

// type Recruiter = {
//   id: string;
//   name?: string;
//   companyName?: string;
//   email: string;
//   isActive?: boolean;
//   verificationStatus?: string;
//   subscriptionStatus?: string;
//   jobPostsUsed?: number;
//   joinedDate?: string | Date;
// };

// type Candidate = {
//   userId: string;
//   name: string;
//   email: string;
//   profileImage?: string;
//   skills?: string[];
//   experienceYears?: number | { value: number };
//   preferredJobLocations?: string[];
//   registeredDate?: string | Date;
//   isActive: () => boolean;
// };

// type EmailLog = {
//   id: string;
//   recipientName: string;
//   recipientEmail: string;
//   subject: string;
//   type: string;
//   status: string;
//   sentAt?: string | Date;
// };

// type ActivityLog = {
//   id: string;
//   userName: string;
//   userEmail: string;
//   action: string;
//   entityType: string;
//   role: string;
//   ipAddress?: string;
//   timestamp?: string | Date;
// };

// type Subscription = {
//   id: string;
//   recruiterName: string;
//   recruiterEmail: string;
//   planName: string;
//   status: string;
//   startDate?: string | Date;
//   endDate?: string | Date;
//   amount?: number;
// };

// type JobPost = {
//   id: string;
//   title: string;
//   department?: string;
//   recruiterName: string;
//   companyName?: string;
//   employmentType?: string;
//   status: string;
//   applicationsCount?: number;
//   location?: string;
//   postedAt?: string | Date;
// };

// type RecruiterAction = "verify" | "reject" | "block" | "unblock";

// // ═════════════════════════════════════════════════════════════════════════════
// // 1. RECRUITER TABLE
// // ═════════════════════════════════════════════════════════════════════════════

// const RECRUITER_COLUMNS: ColumnDef[] = [
//   { key: "recruiter",     label: "Recruiter",    width: "w-[28%]" },
//   { key: "verification",  label: "Verification" },
//   { key: "subscription",  label: "Subscription" },
//   { key: "jobs",          label: "Jobs Posted",  align: "center" },
//   { key: "status",        label: "Status",       align: "center" },
//   { key: "joined",        label: "Joined" },
//   { key: "actions",       label: "Actions",      align: "right" },
// ];

// const RECRUITER_SKELETON: SkeletonCellPreset[] = [
//   "avatar+text", "badge", "badge", "center-sm", "center-md", "text", "action",
// ];

// interface RecruiterTableProps {
//   recruiters: Recruiter[];
//   loading: boolean;
//   pagination: { page: number; limit: number; total: number; totalPages: number };
//   actionLoading: Record<string, boolean>;
//   onAction: (recruiter: Recruiter, action: RecruiterAction) => void;
//   onViewProfile: (id: string) => void;
//   onPageChange: (page: number) => void;
//   onLimitChange?: (limit: number) => void;
// }

// export function RecruiterTable({
//   recruiters,
//   loading,
//   pagination,
//   actionLoading,
//   onAction,
//   onViewProfile,
//   onPageChange,
//   onLimitChange,
// }: RecruiterTableProps) {
//   return (
//     <DataTable
//       title="Recruiter List"
//       columns={RECRUITER_COLUMNS}
//       data={recruiters}
//       loading={loading}
//       pagination={pagination}
//       onPageChange={onPageChange}
//       onLimitChange={onLimitChange}
//       skeletonRowCount={6}
//       skeletonCellWidths={RECRUITER_SKELETON}
//       emptyMessage="No recruiters found"
//       renderRow={(recruiter) => {
//         const isActive = recruiter.isActive ?? true;
//         const isLoading = actionLoading[recruiter.id] ?? false;
//         const initials = getInitials(recruiter.companyName || recruiter.name);

//         return (
//           <tr
//             key={recruiter.id}
//             className="hover:bg-indigo-50/30 transition-colors duration-200 border-b last:border-0"
//           >
//             {/* Recruiter */}
//             <td className="px-6 py-5">
//               <div className="flex items-center gap-3.5">
//                 <Avatar className="h-11 w-11 ring-2 ring-white shadow-sm">
//                   <AvatarFallback
//                     className={cn(
//                       "text-white font-semibold text-sm",
//                       isActive
//                         ? "bg-linear-to-br from-emerald-500 to-emerald-600"
//                         : "bg-linear-to-br from-rose-500 to-rose-600",
//                     )}
//                   >
//                     {initials || "?"}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="min-w-0">
//                   <div className="font-medium text-slate-900 truncate max-w-55">
//                     {recruiter.companyName || recruiter.name}
//                   </div>
//                   <div className="text-sm text-slate-500 mt-0.5 truncate max-w-55">
//                     {recruiter.email}
//                   </div>
//                 </div>
//               </div>
//             </td>

//             {/* Verification */}
//             <td className="px-5 py-5">
//               <VerificationBadge status={recruiter.verificationStatus} />
//             </td>

//             {/* Subscription */}
//             <td className="px-5 py-5">
//               <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
//                 {recruiter.subscriptionStatus || "—"}
//               </Badge>
//             </td>

//             {/* Jobs posted */}
//             <td className="px-5 py-5 text-center font-medium text-slate-700">
//               {recruiter.jobPostsUsed ?? 0}
//             </td>

//             {/* Status */}
//             <td className="px-5 py-5 text-center">
//               <StatusBadge isActive={isActive} />
//             </td>

//             {/* Joined date */}
//             <td className="px-5 py-5 text-slate-600 text-sm">
//               {formatDate(recruiter.joinedDate)}
//             </td>

//             {/* Actions */}
//             <td className="px-6 py-5 text-right pr-8">
//               <div className="flex items-center justify-end gap-2">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-9 w-9 rounded-lg hover:bg-indigo-100 text-slate-600 hover:text-indigo-700"
//                   onClick={() => onViewProfile(recruiter.id)}
//                   disabled={isLoading}
//                   title="View profile"
//                 >
//                   <Eye className="h-4 w-4" />
//                 </Button>

//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-9 w-9 rounded-lg hover:bg-indigo-100 text-slate-600 hover:text-indigo-700"
//                       disabled={isLoading}
//                     >
//                       <MoreVertical className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-48">
//                     {recruiter.verificationStatus === "pending" && (
//                       <>
//                         <DropdownMenuItem
//                           onClick={() => onAction(recruiter, "verify")}
//                           className="text-emerald-600 focus:text-emerald-600"
//                         >
//                           <ShieldCheck className="mr-2 h-4 w-4" /> Verify
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => onAction(recruiter, "reject")}
//                           className="text-rose-600 focus:text-rose-600"
//                         >
//                           <XCircle className="mr-2 h-4 w-4" /> Reject
//                         </DropdownMenuItem>
//                       </>
//                     )}
//                     <DropdownMenuItem
//                       onClick={() => onAction(recruiter, isActive ? "block" : "unblock")}
//                     >
//                       {isActive ? (
//                         <><Ban className="mr-2 h-4 w-4" /> Block Recruiter</>
//                       ) : (
//                         <><Shield className="mr-2 h-4 w-4" /> Unblock Recruiter</>
//                       )}
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </td>
//           </tr>
//         );
//       }}
//     />
//   );
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // 2. CANDIDATE TABLE
// // ═════════════════════════════════════════════════════════════════════════════

// const CANDIDATE_COLUMNS: ColumnDef[] = [
//   { key: "candidate",   label: "Candidate",   width: "w-[26%]" },
//   { key: "skills",      label: "Skills",      width: "w-[20%]" },
//   { key: "experience",  label: "Experience",  width: "w-[11%]" },
//   { key: "location",    label: "Location",    width: "w-[14%]" },
//   { key: "apps",        label: "Apps",        width: "w-[9%]",  align: "center" },
//   { key: "status",      label: "Status",      width: "w-[10%]", align: "center" },
//   { key: "registered",  label: "Registered",  width: "w-[10%]" },
//   { key: "actions",     label: "Actions",     width: "w-[6%]",  align: "right" },
// ];

// const CANDIDATE_SKELETON: SkeletonCellPreset[] = [
//   "avatar+text", "tag-group", "text-icon", "text-icon", "center-md", "toggle", "text-icon", "action",
// ];

// interface CandidateTableProps {
//   candidates: Candidate[];
//   loading: boolean;
//   pagination: { page: number; limit: number; total: number; totalPages: number };
//   loadingMap: Record<string, boolean>;
//   onPageChange: (page: number) => void;
//   onLimitChange?: (limit: number) => void;
//   onRefresh?: () => void;
//   onToggleStatus: (id: string, name: string, action: "block" | "unblock") => void;
//   onViewProfile: (id: string) => void;
// }

// export function CandidateTable({
//   candidates,
//   loading,
//   pagination,
//   loadingMap,
//   onPageChange,
//   onLimitChange,
//   onRefresh,
//   onToggleStatus,
//   onViewProfile,
// }: CandidateTableProps) {
//   return (
//     <DataTable
//       title="Candidate List"
//       columns={CANDIDATE_COLUMNS}
//       data={candidates}
//       loading={loading}
//       pagination={pagination}
//       onPageChange={onPageChange}
//       onLimitChange={onLimitChange}
//       onRefresh={onRefresh}
//       skeletonRowCount={5}
//       skeletonCellWidths={CANDIDATE_SKELETON}
//       emptyMessage="No candidates found"
//       renderRow={(candidate) => {
//         const isActive = candidate.isActive();
//         const id = candidate.userId;
//         const isLoading = loadingMap[id] ?? false;
//         const skills = (candidate.skills ?? []).slice(0, 3);
//         const extraSkills = Math.max(0, (candidate.skills?.length ?? 0) - 3);

//         return (
//           <tr
//             key={id}
//             className="hover:bg-indigo-50/30 transition-colors duration-200 border-b last:border-0"
//           >
//             {/* Candidate */}
//             <td className="px-6 py-5">
//               <div className="flex items-center gap-3.5">
//                 <Avatar className="h-11 w-11 ring-2 ring-white shadow-sm">
//                   <AvatarImage
//                     src={candidate.profileImage}
//                     alt={candidate.name}
//                     className="object-cover"
//                   />
//                   <AvatarFallback
//                     className={cn(
//                       "text-white font-semibold text-sm",
//                       isActive
//                         ? "bg-linear-to-br from-emerald-500 to-emerald-600"
//                         : "bg-linear-to-br from-rose-500 to-rose-600",
//                     )}
//                   >
//                     {getInitials(candidate.name)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="min-w-0">
//                   <div className="font-medium text-slate-900 truncate max-w-50">
//                     {candidate.name}
//                   </div>
//                   <div className="text-sm text-slate-500 mt-0.5 truncate max-w-50">
//                     {candidate.email}
//                   </div>
//                 </div>
//               </div>
//             </td>

//             {/* Skills */}
//             <td className="px-5 py-5">
//               <div className="flex flex-wrap gap-1.5">
//                 {skills.map((skill) => (
//                   <Badge
//                     key={skill}
//                     variant="secondary"
//                     className="px-2.5 py-0.5 text-xs bg-slate-100/80 border border-slate-200 text-slate-700 font-medium rounded-full"
//                   >
//                     {skill}
//                   </Badge>
//                 ))}
//                 {extraSkills > 0 && (
//                   <Badge
//                     variant="outline"
//                     className="px-2 py-0.5 text-xs border-slate-300 text-slate-500 rounded-full"
//                   >
//                     +{extraSkills}
//                   </Badge>
//                 )}
//               </div>
//             </td>

//             {/* Experience */}
//             <td className="px-5 py-5 text-slate-700 text-sm">
//               <div className="flex items-center gap-2">
//                 <Briefcase className="h-4 w-4 text-slate-400" />
//                 {getExperienceDisplay(candidate.experienceYears)}
//               </div>
//             </td>

//             {/* Location */}
//             <td className="px-5 py-5 text-slate-600 text-sm">
//               <div className="flex items-center gap-2">
//                 <MapPin className="h-4 w-4 text-slate-400" />
//                 {candidate.preferredJobLocations?.[0] || "—"}
//               </div>
//             </td>

//             {/* Apps count */}
//             <td className="px-4 py-5 text-center">
//               <CountBadge count={(id.charCodeAt(0) % 15) + 3} />
//             </td>

//             {/* Status + toggle */}
//             <td className="px-4 py-5 text-center">
//               <StatusBadge
//                 isActive={isActive}
//                 withToggle
//                 onToggle={() =>
//                   onToggleStatus(id, candidate.name, isActive ? "block" : "unblock")
//                 }
//                 loading={isLoading}
//               />
//             </td>

//             {/* Registered date */}
//             <td className="px-5 py-5 text-slate-600 text-sm">
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-4 w-4 text-slate-400" />
//                 {formatDate(candidate.registeredDate)}
//               </div>
//             </td>

//             {/* Actions */}
//             <td className="px-6 py-5 text-right pr-8">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-9 w-9 rounded-lg hover:bg-indigo-100 text-slate-600 hover:text-indigo-700"
//                 onClick={() => onViewProfile(id)}
//                 disabled={isLoading}
//               >
//                 <Eye className="h-4 w-4" />
//               </Button>
//             </td>
//           </tr>
//         );
//       }}
//     />
//   );
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // 3. EMAIL LOG TABLE
// // ═════════════════════════════════════════════════════════════════════════════

// const EMAIL_LOG_COLUMNS: ColumnDef[] = [
//   { key: "recipient", label: "Recipient", width: "w-[26%]" },
//   { key: "subject",   label: "Subject",   width: "w-[28%]" },
//   { key: "type",      label: "Type" },
//   { key: "status",    label: "Status",    align: "center" },
//   { key: "sentAt",    label: "Sent At" },
//   { key: "actions",   label: "",          align: "right" },
// ];

// const EMAIL_LOG_SKELETON: SkeletonCellPreset[] = [
//   "avatar+text", "text", "badge-sm", "center-md", "text-icon", "action",
// ];

// interface EmailLogTableProps {
//   logs: EmailLog[];
//   loading: boolean;
//   pagination: { page: number; limit: number; total: number; totalPages: number };
//   onPageChange: (page: number) => void;
//   onLimitChange?: (limit: number) => void;
//   onViewDetails: (id: string) => void;
// }

// export function EmailLogTable({
//   logs,
//   loading,
//   pagination,
//   onPageChange,
//   onLimitChange,
//   onViewDetails,
// }: EmailLogTableProps) {
//   return (
//     <DataTable
//       title="Email Logs"
//       columns={EMAIL_LOG_COLUMNS}
//       data={logs}
//       loading={loading}
//       pagination={pagination}
//       onPageChange={onPageChange}
//       onLimitChange={onLimitChange}
//       skeletonRowCount={8}
//       skeletonCellWidths={EMAIL_LOG_SKELETON}
//       emptyMessage="No email logs found"
//       renderRow={(log) => (
//         <tr
//           key={log.id}
//           className="hover:bg-indigo-50/30 transition-colors duration-200 border-b last:border-0"
//         >
//           {/* Recipient */}
//           <td className="px-6 py-4">
//             <div className="font-medium text-slate-900 truncate max-w-55">
//               {log.recipientName}
//             </div>
//             <div className="text-sm text-slate-500 mt-0.5 truncate max-w-55">
//               {log.recipientEmail}
//             </div>
//           </td>

//           {/* Subject */}
//           <td className="px-5 py-4 text-slate-700 text-sm">
//             <div className="truncate max-w-xs">{log.subject}</div>
//           </td>

//           {/* Type */}
//           <td className="px-5 py-4">
//             <Badge
//               variant="secondary"
//               className="rounded-full px-3 py-1 text-xs font-medium capitalize"
//             >
//               {log.type}
//             </Badge>
//           </td>

//           {/* Status */}
//           <td className="px-5 py-4 text-center">
//             <EmailStatusBadge status={log.status} />
//           </td>

//           {/* Sent At */}
//           <td className="px-5 py-4 text-slate-600 text-sm">
//             <div className="flex items-center gap-2">
//               <Calendar className="h-4 w-4 text-slate-400" />
//               {formatDate(log.sentAt)}
//             </div>
//           </td>

//           {/* Actions */}
//           <td className="px-6 py-4 text-right pr-8">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-9 w-9 rounded-lg hover:bg-indigo-100 text-slate-600 hover:text-indigo-700"
//               onClick={() => onViewDetails(log.id)}
//             >
//               <Eye className="h-4 w-4" />
//             </Button>
//           </td>
//         </tr>
//       )}
//     />
//   );
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // 4. ACTIVITY LOG TABLE
// // ═════════════════════════════════════════════════════════════════════════════

// const ACTIVITY_LOG_COLUMNS: ColumnDef[] = [
//   { key: "user",      label: "User",       width: "w-[24%]" },
//   { key: "action",    label: "Action",     width: "w-[20%]" },
//   { key: "entity",    label: "Entity" },
//   { key: "role",      label: "Role",       align: "center" },
//   { key: "ip",        label: "IP Address" },
//   { key: "timestamp", label: "Timestamp" },
// ];

// const ACTIVITY_LOG_SKELETON: SkeletonCellPreset[] = [
//   "avatar+text", "text", "badge-sm", "center-md", "text", "text-icon",
// ];

// interface ActivityLogTableProps {
//   logs: ActivityLog[];
//   loading: boolean;
//   pagination: { page: number; limit: number; total: number; totalPages: number };
//   onPageChange: (page: number) => void;
//   onLimitChange?: (limit: number) => void;
// }

// export function ActivityLogTable({
//   logs,
//   loading,
//   pagination,
//   onPageChange,
//   onLimitChange,
// }: ActivityLogTableProps) {
//   return (
//     <DataTable
//       title="Activity Logs"
//       columns={ACTIVITY_LOG_COLUMNS}
//       data={logs}
//       loading={loading}
//       pagination={pagination}
//       onPageChange={onPageChange}
//       onLimitChange={onLimitChange}
//       skeletonRowCount={8}
//       skeletonCellWidths={ACTIVITY_LOG_SKELETON}
//       emptyMessage="No activity found"
//       renderRow={(log) => (
//         <tr
//           key={log.id}
//           className="hover:bg-indigo-50/30 transition-colors duration-200 border-b last:border-0"
//         >
//           {/* User */}
//           <td className="px-6 py-4">
//             <div className="font-medium text-slate-900 truncate max-w-50">
//               {log.userName}
//             </div>
//             <div className="text-sm text-slate-500 mt-0.5 truncate max-w-50">
//               {log.userEmail}
//             </div>
//           </td>

//           {/* Action */}
//           <td className="px-5 py-4 text-slate-700 text-sm font-medium">
//             {log.action}
//           </td>

//           {/* Entity */}
//           <td className="px-5 py-4">
//             <Badge
//               variant="outline"
//               className="rounded-full px-3 py-1 text-xs capitalize border-slate-200 text-slate-600"
//             >
//               {log.entityType}
//             </Badge>
//           </td>

//           {/* Role */}
//           <td className="px-5 py-4 text-center">
//             <RoleBadge role={log.role} />
//           </td>

//           {/* IP */}
//           <td className="px-5 py-4 text-slate-600 text-sm font-mono">
//             {log.ipAddress || "—"}
//           </td>

//           {/* Timestamp */}
//           <td className="px-5 py-4 text-slate-600 text-sm">
//             <div className="flex items-center gap-2">
//               <Calendar className="h-4 w-4 text-slate-400" />
//               {formatDate(log.timestamp)}
//             </div>
//           </td>
//         </tr>
//       )}
//     />
//   );
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // 5. SUBSCRIPTION TABLE
// // ═════════════════════════════════════════════════════════════════════════════

// const SUBSCRIPTION_COLUMNS: ColumnDef[] = [
//   { key: "recruiter",  label: "Recruiter",    width: "w-[26%]" },
//   { key: "plan",       label: "Plan" },
//   { key: "status",     label: "Status",       align: "center" },
//   { key: "startDate",  label: "Start Date" },
//   { key: "endDate",    label: "Expiry Date" },
//   { key: "amount",     label: "Amount",       align: "center" },
//   { key: "actions",    label: "",             align: "right" },
// ];

// const SUBSCRIPTION_SKELETON: SkeletonCellPreset[] = [
//   "avatar+text", "badge", "center-md", "text-icon", "text-icon", "center-sm", "action",
// ];

// interface SubscriptionTableProps {
//   subscriptions: Subscription[];
//   loading: boolean;
//   pagination: { page: number; limit: number; total: number; totalPages: number };
//   onPageChange: (page: number) => void;
//   onLimitChange?: (limit: number) => void;
//   onViewDetails: (id: string) => void;
// }

// export function SubscriptionTable({
//   subscriptions,
//   loading,
//   pagination,
//   onPageChange,
//   onLimitChange,
//   onViewDetails,
// }: SubscriptionTableProps) {
//   return (
//     <DataTable
//       title="Subscriptions"
//       columns={SUBSCRIPTION_COLUMNS}
//       data={subscriptions}
//       loading={loading}
//       pagination={pagination}
//       onPageChange={onPageChange}
//       onLimitChange={onLimitChange}
//       skeletonRowCount={6}
//       skeletonCellWidths={SUBSCRIPTION_SKELETON}
//       emptyMessage="No subscriptions found"
//       renderRow={(sub) => (
//         <tr
//           key={sub.id}
//           className="hover:bg-indigo-50/30 transition-colors duration-200 border-b last:border-0"
//         >
//           {/* Recruiter */}
//           <td className="px-6 py-5">
//             <div className="font-medium text-slate-900 truncate max-w-55">
//               {sub.recruiterName}
//             </div>
//             <div className="text-sm text-slate-500 mt-0.5 truncate max-w-55">
//               {sub.recruiterEmail}
//             </div>
//           </td>

//           {/* Plan */}
//           <td className="px-5 py-5">
//             <Badge className="rounded-full px-3.5 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
//               {sub.planName}
//             </Badge>
//           </td>

//           {/* Status */}
//           <td className="px-5 py-5 text-center">
//             <SubscriptionStatusBadge status={sub.status} />
//           </td>

//           {/* Start date */}
//           <td className="px-5 py-5 text-slate-600 text-sm">
//             <div className="flex items-center gap-2">
//               <Calendar className="h-4 w-4 text-slate-400" />
//               {formatDate(sub.startDate)}
//             </div>
//           </td>

//           {/* Expiry date */}
//           <td className="px-5 py-5 text-slate-600 text-sm">
//             <div className="flex items-center gap-2">
//               <Calendar className="h-4 w-4 text-slate-400" />
//               {formatDate(sub.endDate)}
//             </div>
//           </td>

//           {/* Amount */}
//           <td className="px-5 py-5 text-center font-semibold text-slate-900">
//             ₹{sub.amount?.toLocaleString() ?? "—"}
//           </td>

//           {/* Actions */}
//           <td className="px-6 py-5 text-right pr-8">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-9 w-9 rounded-lg hover:bg-indigo-100 text-slate-600 hover:text-indigo-700"
//               onClick={() => onViewDetails(sub.id)}
//             >
//               <Eye className="h-4 w-4" />
//             </Button>
//           </td>
//         </tr>
//       )}
//     />
//   );
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // 6. JOB POST TABLE
// // ═════════════════════════════════════════════════════════════════════════════

// const JOB_POST_COLUMNS: ColumnDef[] = [
//   { key: "title",        label: "Job Title",   width: "w-[26%]" },
//   { key: "recruiter",    label: "Recruiter",   width: "w-[20%]" },
//   { key: "type",         label: "Type" },
//   { key: "status",       label: "Status",      align: "center" },
//   { key: "applications", label: "Apps",        align: "center" },
//   { key: "location",     label: "Location" },
//   { key: "postedAt",     label: "Posted" },
//   { key: "actions",      label: "",            align: "right" },
// ];

// const JOB_POST_SKELETON: SkeletonCellPreset[] = [
//   "avatar+text", "text", "badge-sm", "center-md", "center-sm", "text-icon", "text-icon", "action",
// ];

// interface JobPostTableProps {
//   jobs: JobPost[];
//   loading: boolean;
//   pagination: { page: number; limit: number; total: number; totalPages: number };
//   onPageChange: (page: number) => void;
//   onLimitChange?: (limit: number) => void;
//   onViewJob: (id: string) => void;
// }

// export function JobPostTable({
//   jobs,
//   loading,
//   pagination,
//   onPageChange,
//   onLimitChange,
//   onViewJob,
// }: JobPostTableProps) {
//   return (
//     <DataTable
//       title="Job Posts"
//       columns={JOB_POST_COLUMNS}
//       data={jobs}
//       loading={loading}
//       pagination={pagination}
//       onPageChange={onPageChange}
//       onLimitChange={onLimitChange}
//       skeletonRowCount={6}
//       skeletonCellWidths={JOB_POST_SKELETON}
//       emptyMessage="No job posts found"
//       renderRow={(job) => (
//         <tr
//           key={job.id}
//           className="hover:bg-indigo-50/30 transition-colors duration-200 border-b last:border-0"
//         >
//           {/* Title */}
//           <td className="px-6 py-5">
//             <div className="font-medium text-slate-900 truncate max-w-55">
//               {job.title}
//             </div>
//             <div className="text-sm text-slate-500 mt-0.5 truncate max-w-55">
//               {job.department}
//             </div>
//           </td>

//           {/* Recruiter */}
//           <td className="px-5 py-5">
//             <div className="font-medium text-slate-800 text-sm truncate max-w-45">
//               {job.recruiterName}
//             </div>
//             <div className="text-xs text-slate-500 mt-0.5 truncate max-w-45">
//               {job.companyName}
//             </div>
//           </td>

//           {/* Employment type */}
//           <td className="px-5 py-5">
//             <Badge
//               variant="secondary"
//               className="rounded-full px-3 py-1 text-xs font-medium capitalize"
//             >
//               {job.employmentType || "—"}
//             </Badge>
//           </td>

//           {/* Status */}
//           <td className="px-5 py-5 text-center">
//             <JobStatusBadge status={job.status} />
//           </td>

//           {/* Applications */}
//           <td className="px-5 py-5 text-center">
//             <CountBadge count={job.applicationsCount ?? 0} />
//           </td>

//           {/* Location */}
//           <td className="px-5 py-5 text-slate-600 text-sm">
//             <div className="flex items-center gap-2">
//               <MapPin className="h-4 w-4 text-slate-400" />
//               {job.location || "—"}
//             </div>
//           </td>

//           {/* Posted date */}
//           <td className="px-5 py-5 text-slate-600 text-sm">
//             <div className="flex items-center gap-2">
//               <Calendar className="h-4 w-4 text-slate-400" />
//               {formatDate(job.postedAt)}
//             </div>
//           </td>

//           {/* Actions */}
//           <td className="px-6 py-5 text-right pr-8">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-9 w-9 rounded-lg hover:bg-indigo-100 text-slate-600 hover:text-indigo-700"
//               onClick={() => onViewJob(job.id)}
//             >
//               <Eye className="h-4 w-4" />
//             </Button>
//           </td>
//         </tr>
//       )}
//     />
//   );
// }