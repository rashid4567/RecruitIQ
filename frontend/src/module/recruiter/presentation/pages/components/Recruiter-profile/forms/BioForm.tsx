import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, AlertCircle } from "lucide-react";

interface BioSectionProps {
  register: any;
  errors: Record<string, any>;
  bioLength: number;
  wordCount: number;
  isEditing: boolean;
}

export function BioSection({ 
  register, 
  errors, 
  bioLength, 
  wordCount, 
  isEditing 
}: BioSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <FileText className="h-5 w-5 text-amber-500" />
        Professional Bio
      </h3>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-medium text-slate-700 flex items-center justify-between">
          <span>About You & Your Company <span className="text-red-500">*</span></span>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              bioLength > 450 
                ? "bg-red-100 text-red-700" 
                : bioLength > 400
                ? "bg-amber-100 text-amber-700"
                : "bg-green-100 text-green-700"
            }`}>
              {bioLength}/500
            </span>
            <span className="text-xs text-slate-500">{wordCount} words</span>
          </div>
        </Label>
        
        <Textarea
          id="bio"
          {...register("bio")}
          disabled={!isEditing}
          rows={5}
          className={`min-h-35 resize-y ${
            errors.bio 
              ? "border-red-300 focus:ring-red-500/20" 
              : "border-slate-200"
          } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
          placeholder="Tell us about your professional background, expertise, and what makes you unique as a recruiter..."
        />
        
        {errors.bio && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.bio.message}
          </p>
        )}
        
        {bioLength < 10 && isEditing && (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Minimum 10 characters required
          </p>
        )}
      </div>
    </div>
  );
}