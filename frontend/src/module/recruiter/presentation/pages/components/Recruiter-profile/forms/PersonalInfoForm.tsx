import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Briefcase,
  MapPin,
  Linkedin,
  ExternalLink,
  Check,
  AlertCircle,
  Mail,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PersonalInfoFormProps {
  register: any;
  errors: Record<string, any>;
  touchedFields: Record<string, boolean>;
  isEditing: boolean;
  profile?: any;
  onUpdateEmailClick: () => void;
  currentEmail?: string;
}

export function PersonalInfoForm({
  register,
  errors,
  touchedFields,
  isEditing,
  profile,
  onUpdateEmailClick,
  currentEmail = "",
}: PersonalInfoFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <User className="h-5 w-5 text-blue-500" />
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-slate-700 flex items-center justify-between">
            <span>Full Name <span className="text-red-500">*</span></span>
            {errors.fullName && (
              <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.fullName.message}
              </span>
            )}
          </Label>
          <div className="relative group">
            <Input
              id="fullName"
              {...register("fullName")}
              disabled={!isEditing}
              className={`h-12 pl-11 transition-all ${
                errors.fullName
                  ? "border-red-300 focus:ring-red-500/20"
                  : "border-slate-200"
              } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
              placeholder="John Doe"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <User className="h-4 w-4 text-slate-600" />
            </div>
            {touchedFields.fullName && !errors.fullName && isEditing && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
          </div>
        </div>

        {/* Email Address - New Field (Same row style as Name) */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-slate-700 flex items-center justify-between">
            <span>Email Address <span className="text-red-500">*</span></span>
            {errors.email && (
              <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email.message}
              </span>
            )}
          </Label>

          <div className="relative group">
            <Input
              id="email"
              value={currentEmail}
              disabled
              className="h-12 pl-11 bg-slate-50 border-slate-200 text-slate-700 cursor-default"
              placeholder="you@example.com"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>

            {/* Update Email Button */}
            <Button
              type="button"
              onClick={onUpdateEmailClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 text-xs font-medium bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 shadow-sm"
              disabled={!isEditing} 
            >
              <Edit3 className="h-3.5 w-3.5" />
              Update
            </Button>
          </div>

          {profile?.email && (
            <p className="text-xs text-slate-500 mt-1">
              Verified email • Changes require verification
            </p>
          )}
        </div>

        {/* Designation */}
        <div className="space-y-2">
          <Label htmlFor="designation" className="text-sm font-medium text-slate-700 flex items-center justify-between">
            <span>Designation <span className="text-red-500">*</span></span>
            {errors.designation && (
              <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.designation.message}
              </span>
            )}
          </Label>
          <div className="relative group">
            <Input
              id="designation"
              {...register("designation")}
              disabled={!isEditing}
              className={`h-12 pl-11 ${
                errors.designation
                  ? "border-red-300 focus:ring-red-500/20"
                  : "border-slate-200"
              } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
              placeholder="Senior Technical Recruiter"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-slate-700 flex items-center justify-between">
            <span>Location</span>
            {errors.location && (
              <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.location.message}
              </span>
            )}
          </Label>
          <div className="relative group">
            <Input
              id="location"
              {...register("location")}
              disabled={!isEditing}
              className={`h-12 pl-11 ${
                errors.location
                  ? "border-red-300 focus:ring-red-500/20"
                  : "border-slate-200"
              } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
              placeholder="San Francisco, CA"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-amber-600" />
            </div>
          </div>
        </div>

        {/* LinkedIn URL */}
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl" className="text-sm font-medium text-slate-700 flex items-center justify-between">
            <span>LinkedIn Profile</span>
            {errors.linkedinUrl && (
              <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.linkedinUrl.message}
              </span>
            )}
          </Label>
          <div className="relative group">
            <Input
              id="linkedinUrl"
              {...register("linkedinUrl")}
              disabled={!isEditing}
              className={`h-12 pl-11 ${
                errors.linkedinUrl
                  ? "border-red-300 focus:ring-red-500/20"
                  : "border-slate-200"
              } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
              placeholder="https://linkedin.com/in/username"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Linkedin className="h-4 w-4 text-[#0A66C2]" />
            </div>
            {profile?.linkedinUrl && !isEditing && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}