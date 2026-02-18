// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Lock,
//   Shield,
//   ShieldCheck,
//   AlertCircle,
//   Check,
//   Eye,
//   EyeOff,
//   Loader2,
//   Key,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   Info,
//   Fingerprint,
//   Clock,
//   Smartphone,
//   History,
// } from "lucide-react";
// import { toast } from "sonner";
// import { updatePasswordUC } from "@/module/auth/presentation/di/auth";

// // Password validation interface
// interface PasswordValidation {
//   length: boolean;
//   uppercase: boolean;
//   lowercase: boolean;
//   number: boolean;
//   special: boolean;
// }

// // Password strength result
// interface PasswordStrength {
//   strength: "Weak" | "Fair" | "Good" | "Strong";
//   color: string;
//   bg: string;
//   score: number;
// }

// export function SecuritySection() {
//   // ===============================
//   // STATE
//   // ===============================
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
  
//   // Visibility toggles
//   const [showCurrent, setShowCurrent] = useState(false);
//   const [showNew, setShowNew] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
  
//   // Validation state
//   const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
//     length: false,
//     uppercase: false,
//     lowercase: false,
//     number: false,
//     special: false,
//   });
  
//   const [touched, setTouched] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   });

//   // ===============================
//   // PASSWORD VALIDATION
//   // ===============================
//   useEffect(() => {
//     if (newPassword) {
//       setPasswordValidation({
//         length: newPassword.length >= 8,
//         uppercase: /[A-Z]/.test(newPassword),
//         lowercase: /[a-z]/.test(newPassword),
//         number: /[0-9]/.test(newPassword),
//         special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
//       });
//     }
//   }, [newPassword]);

//   // ===============================
//   // PASSWORD STRENGTH CALCULATION
//   // ===============================
//   const getPasswordStrength = (): PasswordStrength => {
//     const validCount = Object.values(passwordValidation).filter(Boolean).length;
    
//     if (validCount <= 2) {
//       return { 
//         strength: "Weak", 
//         color: "text-red-500", 
//         bg: "bg-red-500",
//         score: validCount * 20 
//       };
//     }
//     if (validCount <= 3) {
//       return { 
//         strength: "Fair", 
//         color: "text-amber-500", 
//         bg: "bg-amber-500",
//         score: validCount * 20 
//       };
//     }
//     if (validCount <= 4) {
//       return { 
//         strength: "Good", 
//         color: "text-blue-500", 
//         bg: "bg-blue-500",
//         score: validCount * 20 
//       };
//     }
//     return { 
//       strength: "Strong", 
//       color: "text-emerald-500", 
//       bg: "bg-emerald-500",
//       score: 100 
//     };
//   };

//   // ===============================
//   // VALIDATION FUNCTIONS
//   // ===============================
//   const validateForm = (): boolean => {
//     // Mark all fields as touched
//     setTouched({
//       current: true,
//       new: true,
//       confirm: true,
//     });

//     // Check required fields
//     if (!currentPassword) {
//       toast.error("Current password is required");
//       return false;
//     }

//     if (!newPassword) {
//       toast.error("New password is required");
//       return false;
//     }

//     if (!confirmPassword) {
//       toast.error("Please confirm your new password");
//       return false;
//     }

//     // Check password strength
//     if (newPassword.length < 8) {
//       toast.error("Password must be at least 8 characters long");
//       return false;
//     }

//     if (!/[A-Z]/.test(newPassword)) {
//       toast.error("Password must contain at least one uppercase letter");
//       return false;
//     }

//     if (!/[a-z]/.test(newPassword)) {
//       toast.error("Password must contain at least one lowercase letter");
//       return false;
//     }

//     if (!/[0-9]/.test(newPassword)) {
//       toast.error("Password must contain at least one number");
//       return false;
//     }

//     if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
//       toast.error("Password must contain at least one special character");
//       return false;
//     }

//     // Check password match
//     if (newPassword !== confirmPassword) {
//       toast.error("New passwords do not match");
//       return false;
//     }

//     // Check if new password is same as old
//     if (newPassword === currentPassword) {
//       toast.error("New password must be different from current password");
//       return false;
//     }

//     return true;
//   };

//   // ===============================
//   // HANDLERS
//   // ===============================
//   const handleUpdatePassword = async () => {
//     if (!validateForm()) return;

//     try {
//       setLoading(true);

//       // Execute use case
//       await updatePasswordUC.execute({
//         currentPassword,
//         newPassword,
//       });

//       // Success
//       toast.success("Password updated successfully!", {
//         description: "Your password has been changed. Use it on your next login.",
//         duration: 5000,
//         icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
//       });

//       // Reset form
//       setCurrentPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//       setTouched({
//         current: false,
//         new: false,
//         confirm: false,
//       });
      
//     } catch (error: any) {
//       // Handle domain errors
//       const errorMessage = error?.message || "Failed to update password";
      
//       toast.error("Password update failed", {
//         description: errorMessage,
//         duration: 4000,
//         icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const strength = getPasswordStrength();
//   const isNewPasswordValid = Object.values(passwordValidation).every(Boolean);

//   // ===============================
//   // RENDER
//   // ===============================
//   return (
//     <div className="space-y-6 max-w-4xl mx-auto">
//       {/* MAIN SECURITY CARD */}
//       <Card className="border-slate-200/50 shadow-lg overflow-hidden transition-all hover:shadow-xl">
//         {/* Top accent bar */}
//         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500" />

//         <CardHeader className="pb-4 border-b border-slate-100">
//           <div className="flex items-start justify-between">
//             <div className="flex items-center gap-4">
//               {/* Icon */}
//               <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
//                 <Shield className="h-7 w-7 text-white" />
//               </div>
              
//               {/* Title */}
//               <div>
//                 <CardTitle className="text-2xl text-slate-900">Security Settings</CardTitle>
//                 <CardDescription className="text-base mt-1">
//                   Manage your password and account security preferences
//                 </CardDescription>
//               </div>
//             </div>

//             {/* Status Badge */}
//             <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1.5">
//               <ShieldCheck className="h-4 w-4 mr-1.5" />
//               Active
//             </Badge>
//           </div>
//         </CardHeader>

//         <CardContent className="pt-6 space-y-8">
//           {/* ===============================
//               CHANGE PASSWORD SECTION
//           =============================== */}
//           <div className="space-y-6">
//             {/* Section Header */}
//             <div className="flex items-center gap-3">
//               <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center">
//                 <Key className="h-4 w-4 text-rose-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-slate-900">
//                 Change Password
//               </h3>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* LEFT COLUMN - Password Fields */}
//               <div className="space-y-5">
//                 {/* Current Password */}
//                 <div className="space-y-2">
//                   <Label htmlFor="current-password" className="text-sm font-medium text-slate-700 flex items-center justify-between">
//                     <span>Current Password <span className="text-red-500">*</span></span>
//                     {touched.current && !currentPassword && (
//                       <span className="text-xs text-red-500 flex items-center gap-1">
//                         <AlertCircle className="h-3 w-3" />
//                         Required
//                       </span>
//                     )}
//                   </Label>
//                   <div className="relative group">
//                     <Input
//                       id="current-password"
//                       type={showCurrent ? "text" : "password"}
//                       value={currentPassword}
//                       onChange={(e) => setCurrentPassword(e.target.value)}
//                       onBlur={() => setTouched(prev => ({ ...prev, current: true }))}
//                       className={`h-12 pl-11 pr-11 text-base transition-all ${
//                         touched.current && !currentPassword
//                           ? "border-red-300 focus-visible:ring-red-500/20"
//                           : "border-slate-200 focus-visible:ring-rose-500/20"
//                       }`}
//                       placeholder="Enter current password"
//                       disabled={loading}
//                     />
//                     <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-2 top-2 h-8 w-8 hover:bg-slate-100"
//                       onClick={() => setShowCurrent(!showCurrent)}
//                       disabled={loading}
//                     >
//                       {showCurrent ? (
//                         <EyeOff className="h-4 w-4 text-slate-500" />
//                       ) : (
//                         <Eye className="h-4 w-4 text-slate-500" />
//                       )}
//                     </Button>
//                   </div>
//                 </div>

//                 {/* New Password */}
//                 <div className="space-y-2">
//                   <Label htmlFor="new-password" className="text-sm font-medium text-slate-700 flex items-center justify-between">
//                     <span>New Password <span className="text-red-500">*</span></span>
//                     {touched.new && !newPassword && (
//                       <span className="text-xs text-red-500 flex items-center gap-1">
//                         <AlertCircle className="h-3 w-3" />
//                         Required
//                       </span>
//                     )}
//                   </Label>
//                   <div className="relative group">
//                     <Input
//                       id="new-password"
//                       type={showNew ? "text" : "password"}
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       onBlur={() => setTouched(prev => ({ ...prev, new: true }))}
//                       className={`h-12 pl-11 pr-11 text-base transition-all ${
//                         touched.new && !newPassword
//                           ? "border-red-300 focus-visible:ring-red-500/20"
//                           : "border-slate-200 focus-visible:ring-rose-500/20"
//                       }`}
//                       placeholder="Create new password"
//                       disabled={loading}
//                     />
//                     <Key className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-2 top-2 h-8 w-8 hover:bg-slate-100"
//                       onClick={() => setShowNew(!showNew)}
//                       disabled={loading}
//                     >
//                       {showNew ? (
//                         <EyeOff className="h-4 w-4 text-slate-500" />
//                       ) : (
//                         <Eye className="h-4 w-4 text-slate-500" />
//                       )}
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Confirm Password */}
//                 <div className="space-y-2">
//                   <Label htmlFor="confirm-password" className="text-sm font-medium text-slate-700 flex items-center justify-between">
//                     <span>Confirm Password <span className="text-red-500">*</span></span>
//                     {touched.confirm && !confirmPassword && (
//                       <span className="text-xs text-red-500 flex items-center gap-1">
//                         <AlertCircle className="h-3 w-3" />
//                         Required
//                       </span>
//                     )}
//                   </Label>
//                   <div className="relative group">
//                     <Input
//                       id="confirm-password"
//                       type={showConfirm ? "text" : "password"}
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       onBlur={() => setTouched(prev => ({ ...prev, confirm: true }))}
//                       className={`h-12 pl-11 pr-11 text-base transition-all ${
//                         touched.confirm && !confirmPassword
//                           ? "border-red-300 focus-visible:ring-red-500/20"
//                           : "border-slate-200 focus-visible:ring-rose-500/20"
//                       }`}
//                       placeholder="Confirm new password"
//                       disabled={loading}
//                     />
//                     <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-2 top-2 h-8 w-8 hover:bg-slate-100"
//                       onClick={() => setShowConfirm(!showConfirm)}
//                       disabled={loading}
//                     >
//                       {showConfirm ? (
//                         <EyeOff className="h-4 w-4 text-slate-500" />
//                       ) : (
//                         <Eye className="h-4 w-4 text-slate-500" />
//                       )}
//                     </Button>
//                   </div>
                  
//                   {/* Password match indicator */}
//                   {confirmPassword && newPassword && (
//                     <div className="flex items-center gap-2 mt-2 text-sm">
//                       {confirmPassword === newPassword ? (
//                         <>
//                           <CheckCircle className="h-4 w-4 text-emerald-500" />
//                           <span className="text-emerald-600 font-medium">
//                             Passwords match
//                           </span>
//                         </>
//                       ) : (
//                         <>
//                           <XCircle className="h-4 w-4 text-red-500" />
//                           <span className="text-red-600 font-medium">
//                             Passwords don't match
//                           </span>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* RIGHT COLUMN - Password Requirements */}
//               <div className="space-y-4">
//                 {/* Strength Meter */}
//                 {newPassword && (
//                   <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
//                     <div className="flex items-center justify-between mb-3">
//                       <span className="text-sm font-medium text-slate-700">
//                         Password Strength
//                       </span>
//                       <Badge className={`${strength.color} bg-opacity-10 border-none`}>
//                         {strength.strength}
//                       </Badge>
//                     </div>
                    
//                     {/* Progress Bar */}
//                     <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
//                       <div
//                         className={`h-full ${strength.bg} transition-all duration-500`}
//                         style={{ width: `${strength.score}%` }}
//                       />
//                     </div>

//                     {/* Requirements List */}
//                     <div className="space-y-2">
//                       <p className="text-xs font-medium text-slate-500 mb-2">
//                         Password must contain:
//                       </p>
//                       <div className="grid grid-cols-2 gap-2">
//                         {[
//                           { key: 'length', label: '8+ characters' },
//                           { key: 'uppercase', label: 'Uppercase letter' },
//                           { key: 'lowercase', label: 'Lowercase letter' },
//                           { key: 'number', label: 'Number' },
//                           { key: 'special', label: 'Special character' },
//                         ].map(({ key, label }) => (
//                           <div key={key} className="flex items-center gap-2 text-sm">
//                             {passwordValidation[key as keyof PasswordValidation] ? (
//                               <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
//                             ) : (
//                               <XCircle className="h-4 w-4 text-slate-300 flex-shrink-0" />
//                             )}
//                             <span className={
//                               passwordValidation[key as keyof PasswordValidation]
//                                 ? "text-emerald-600 text-xs"
//                                 : "text-slate-400 text-xs"
//                             }>
//                               {label}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Security Tips Card */}
//                 <div className="p-5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-xl border border-indigo-100">
//                   <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2 mb-3">
//                     <Shield className="h-4 w-4" />
//                     Security Tips
//                   </h4>
//                   <ul className="space-y-2 text-xs text-indigo-700">
//                     <li className="flex items-start gap-2">
//                       <Check className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
//                       <span>Use a unique password you don't use elsewhere</span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <Clock className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
//                       <span>Change password every 90 days</span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <Fingerprint className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
//                       <span>Enable 2FA for additional security</span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <History className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
//                       <span>Don't reuse old passwords</span>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Separator className="my-2" />

//           {/* ===============================
//               ACTION BUTTONS
//           =============================== */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2 text-sm text-slate-500">
//               <Info className="h-4 w-4" />
//               <span>Make sure your password is strong and memorable</span>
//             </div>
            
//             <Button
//               onClick={handleUpdatePassword}
//               disabled={loading}
//               className="h-12 px-8 gap-3 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl transition-all disabled:opacity-70"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <ShieldCheck className="h-5 w-5" />
//                   Update Password
//                 </>
//               )}
//             </Button>
//           </div>

//           {/* ===============================
//               RECENT ACTIVITY CARD
//           =============================== */}
//           <div className="mt-8 p-5 bg-slate-50 rounded-xl border border-slate-200">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
//                 <History className="h-4 w-4 text-blue-600" />
//               </div>
//               <h4 className="text-sm font-semibold text-slate-900">
//                 Recent Security Activity
//               </h4>
//             </div>
            
//             <div className="space-y-3">
//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center gap-3">
//                   <Smartphone className="h-4 w-4 text-slate-400" />
//                   <span className="text-slate-600">Last password change</span>
//                 </div>
//                 <span className="text-slate-900 font-medium">28 days ago</span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center gap-3">
//                   <Fingerprint className="h-4 w-4 text-slate-400" />
//                   <span className="text-slate-600">Two-factor authentication</span>
//                 </div>
//                 <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
//                   Not enabled
//                 </Badge>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

    
//     </div>
//   );
// }