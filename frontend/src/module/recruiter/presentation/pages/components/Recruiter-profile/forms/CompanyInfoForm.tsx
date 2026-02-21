import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Users, 
  Award, 
  Globe, 
  ExternalLink,
  AlertCircle 
} from "lucide-react";
import { COMPANY_SIZES, INDUSTRIES } from "../../../constants/recruiter.constants";

interface CompanyInfoFormProps {
  register: any;
  errors: Record<string, any>;
  watch: any;
  setValue: any;
  trigger: any;
  isEditing: boolean;
  profile?: any;
}

export function CompanyInfoForm({ 
  register, 
  errors, 
  watch,
  setValue,
  trigger,
  isEditing,
  profile 
}: CompanyInfoFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <Building className="h-5 w-5 text-indigo-500" />
        Company Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-medium text-slate-700 flex items-center justify-between">
            <span>Company Name <span className="text-red-500">*</span></span>
            {errors.companyName && (
              <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.companyName.message}
              </span>
            )}
          </Label>
          <div className="relative group">
            <Input
              id="companyName"
              {...register("companyName")}
              disabled={!isEditing}
              className={`h-12 pl-11 ${
                errors.companyName 
                  ? "border-red-300 focus:ring-red-500/20" 
                  : "border-slate-200"
              } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
              placeholder="Acme Inc."
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Building className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Company Size */}
        <div className="space-y-2">
          <Label htmlFor="companySize" className="text-sm font-medium text-slate-700 flex items-center justify-between">
            <span>Company Size <span className="text-red-500">*</span></span>
            {errors.companySize && (
              <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.companySize.message}
              </span>
            )}
          </Label>
          <div className="relative">
            <Select
              disabled={!isEditing}
              value={watch("companySize")?.toString()}
              onValueChange={(value) => {
                setValue("companySize", parseInt(value, 10), { shouldValidate: true });
                trigger("companySize");
              }}
            >
              <SelectTrigger className={`h-12 pl-11 ${
                errors.companySize 
                  ? "border-red-300 focus:ring-red-500/20" 
                  : "border-slate-200"
              } ${!isEditing ? "bg-slate-50" : "bg-white"}`}>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {COMPANY_SIZES.map(({ value, label, range }) => (
                  <SelectItem key={value} value={value.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>{label}</span>
                      <Badge variant="outline" className="ml-2 text-xs">{range}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center pointer-events-none">
              <Users className="h-4 w-4 text-rose-600" />
            </div>
          </div>
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label htmlFor="industry" className="text-sm font-medium text-slate-700 flex items-center justify-between">
            <span>Industry <span className="text-red-500">*</span></span>
            {errors.industry && (
              <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.industry.message}
              </span>
            )}
          </Label>
          <div className="relative">
            <Select
              disabled={!isEditing}
              value={watch("industry")}
              onValueChange={(value) => {
                setValue("industry", value, { shouldValidate: true });
                trigger("industry");
              }}
            >
              <SelectTrigger className={`h-12 pl-11 ${
                errors.industry 
                  ? "border-red-300 focus:ring-red-500/20" 
                  : "border-slate-200"
              } ${!isEditing ? "bg-slate-50" : "bg-white"}`}>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center pointer-events-none">
              <Award className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Company Website */}
        <div className="space-y-2">
          <Label htmlFor="companyWebsite" className="text-sm font-medium text-slate-700 flex items-center justify-between">
            <span>Company Website</span>
            {errors.companyWebsite && (
              <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.companyWebsite.message}
              </span>
            )}
          </Label>
          <div className="relative group">
            <Input
              id="companyWebsite"
              {...register("companyWebsite")}
              disabled={!isEditing}
              className={`h-12 pl-11 ${
                errors.companyWebsite 
                  ? "border-red-300 focus:ring-red-500/20" 
                  : "border-slate-200"
              } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
              placeholder="https://company.com"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center">
              <Globe className="h-4 w-4 text-sky-600" />
            </div>
            {profile?.companyWebsite && !isEditing && (
              <a
                href={profile.companyWebsite}
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