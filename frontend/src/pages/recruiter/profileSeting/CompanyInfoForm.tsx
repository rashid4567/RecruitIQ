// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"

// import type {
//   RecruiterProfileData,
//   RecruiterProfileResponse,
// } from "@/types/recruiter/recruiter.profile.type"

// import {
//   Building2,
//   Globe,
//   MapPin,
//   Users,
//   Briefcase,
//   ShieldCheck,
//   Calendar,
//   Crown,
//   Save,
//   Loader2,
// } from "lucide-react"

// interface CompanyInfoFormProps {
//   formData: Partial<RecruiterProfileData>
//   profile?: RecruiterProfileResponse
//   onSave: () => Promise<void>
//   onChange: (field: keyof RecruiterProfileData, value: string) => void
// }

// export function CompanyInfoForm({
//   formData,
//   profile,
//   onSave,
//   onChange,
// }: CompanyInfoFormProps) {
//   const [saving, setSaving] = useState(false)

//   const companySizes = [
//     "1-10",
//     "11-50",
//     "51-200",
//     "201-500",
//     "501-1000",
//     "1000+",
//   ]

//   const industries = [
//     "Technology",
//     "Finance",
//     "Healthcare",
//     "Education",
//     "Retail",
//     "Manufacturing",
//     "Consulting",
//     "Marketing",
//     "Real Estate",
//     "Other",
//   ]

//   const handleSave = async () => {
//     try {
//       setSaving(true)
//       await onSave()
//     } finally {
//       setSaving(false)
//     }
//   }

//   const isSaveDisabled = !formData.companyName || saving

//   return (
//     <div className="space-y-8">
//       {/* ================= COMPANY INFO ================= */}
//       <Card className="border-slate-200/50 shadow-lg overflow-hidden">
//         <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-blue-600" />

//         <CardHeader>
//           <div className="flex items-center gap-4">
//             <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
//               <Building2 className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <CardTitle>Company Information</CardTitle>
//               <CardDescription>
//                 Update your company details and branding
//               </CardDescription>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {/* Company Name + Website */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label>
//                 Company Name <span className="text-rose-500">*</span>
//               </Label>
//               <Input
//                 value={formData.companyName ?? ""}
//                 onChange={(e) => onChange("companyName", e.target.value)}
//                 placeholder="Enter company name"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Company Website</Label>
//               <div className="relative">
//                 <Input
//                   className="pl-11"
//                   value={formData.companyWebsite ?? ""}
//                   onChange={(e) =>
//                     onChange("companyWebsite", e.target.value)
//                   }
//                   placeholder="https://example.com"
//                 />
//                 <Globe className="absolute left-3 top-3.5 h-4 w-4 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           {/* Size + Industry */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label>Company Size</Label>
//               <Select
//                 value={formData.companySize}
//                 onValueChange={(v) => onChange("companySize", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select company size" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {companySizes.map((size) => (
//                     <SelectItem key={size} value={size}>
//                       <Users className="mr-2 h-4 w-4 inline-block" />
//                       {size} employees
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Industry</Label>
//               <Select
//                 value={formData.industry}
//                 onValueChange={(v) => onChange("industry", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select industry" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {industries.map((industry) => (
//                     <SelectItem key={industry} value={industry}>
//                       {industry}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Location */}
//           <div className="space-y-2">
//             <Label>Company Location</Label>
//             <div className="relative">
//               <Input
//                 className="pl-11"
//                 value={formData.location ?? ""}
//                 onChange={(e) => onChange("location", e.target.value)}
//                 placeholder="City, Country"
//               />
//               <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-blue-600" />
//             </div>
//           </div>

//           {/* Designation */}
//           <div className="space-y-2">
//             <Label>Your Designation</Label>
//             <Input
//               value={formData.designation ?? ""}
//               onChange={(e) => onChange("designation", e.target.value)}
//               placeholder="Senior Recruiter, HR Manager"
//             />
//           </div>

//           {/* Bio */}
//           <div className="space-y-2">
//             <Label>Company Bio</Label>
//             <Textarea
//               rows={5}
//               value={formData.bio ?? ""}
//               onChange={(e) => onChange("bio", e.target.value)}
//               placeholder="Tell candidates about your company culture, mission, and values..."
//             />
//             <p className="text-xs text-slate-500">
//               Visible to candidates (max 500 characters)
//             </p>
//           </div>
//         </CardContent>

//         <CardFooter className="flex justify-end gap-3 border-t pt-6">
//           <Button variant="outline" onClick={() => window.location.reload()}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSave}
//             disabled={isSaveDisabled}
//             className="gap-2"
//           >
//             {saving ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save className="h-4 w-4" />
//                 Save Changes
//               </>
//             )}
//           </Button>
//         </CardFooter>
//       </Card>

//       {/* ================= STATS ================= */}
//       {profile && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {/* Job Posts */}
//           <Card>
//             <CardContent className="p-6 space-y-3">
//               <div className="flex justify-between">
//                 <div>
//                   <p className="text-sm">Job Posts Used</p>
//                   <p className="text-2xl font-bold">
//                     {profile.jobPostsUsed}/5
//                   </p>
//                 </div>
//                 <Briefcase />
//               </div>
//               <Progress value={(profile.jobPostsUsed / 5) * 100} />
//             </CardContent>
//           </Card>

//           {/* Verification */}
//           <Card>
//             <CardContent className="p-6 space-y-3">
//               <ShieldCheck />
//               <p className="font-semibold capitalize">
//                 {profile.verificationStatus}
//               </p>
//               <Badge>
//                 {profile.verificationStatus === "verified"
//                   ? "Verified"
//                   : "In Review"}
//               </Badge>
//             </CardContent>
//           </Card>

//           {/* Member Since */}
//           <Card>
//             <CardContent className="p-6 space-y-3">
//               <Calendar />
//               <p className="font-semibold">
//                 {new Date(profile.createdAt).toDateString()}
//               </p>
//             </CardContent>
//           </Card>

//           {/* Subscription */}
//           <Card>
//             <CardContent className="p-6 space-y-3">
//               <Crown />
//               <p className="font-semibold capitalize">
//                 {profile.subscriptionStatus}
//               </p>
//               <Button size="sm" variant="outline">
//                 Upgrade Plan
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   )
// }
