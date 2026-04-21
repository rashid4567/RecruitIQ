import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MapPin, Building2, Users, Briefcase } from "lucide-react";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types";

interface Props {
  formData: JobFormData;
  setFormData: (updater: (prev: JobFormData) => JobFormData) => void;
  errors: Record<string, string>;
}

export default function Step1BasicInfo({ formData, setFormData, errors }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-gray-500 mt-1">Start with the core details of this position</p>
      </div>

      <div className="space-y-6">
        {/* Job Title */}
        <div>
          <Label>Job Title <span className="text-red-500">*</span></Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g., Senior Software Engineer (Backend)"
            className={`h-12 ${errors.title ? "border-red-500 focus:border-red-500 ring-red-200" : ""}`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Department */}
          <div>
            <Label>Department <span className="text-red-500">*</span></Label>
            <Select value={formData.department} onValueChange={(v) => setFormData((p) => ({ ...p, department: v }))}>
              <SelectTrigger className={`h-12 mt-2 ${errors.department ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {["Engineering", "Product", "Design", "Marketing", "Sales", "Data Science", "HR", "Finance", "Operations"].map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
          </div>

          {/* Positions */}
          <div>
            <Label>Number of Positions <span className="text-red-500">*</span></Label>
            <Input
              type="number"
              min={1}
              value={formData.positions}
              onChange={(e) => setFormData((p) => ({ ...p, positions: parseInt(e.target.value) || 1 }))}
              className={`h-12 mt-2 ${errors.positions ? "border-red-500" : ""}`}
            />
            {errors.positions && <p className="text-red-500 text-sm mt-1">{errors.positions}</p>}
          </div>
        </div>

        {/* Employment Type */}
        <div>
          <Label>Employment Type <span className="text-red-500">*</span></Label>
          <div className="grid grid-cols-4 gap-3 mt-2">
            {(["full-time", "part-time", "contract", "internship"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, jobType: t }))}
                className={`py-3 px-4 rounded-xl border-2 capitalize transition-all ${
                  formData.jobType === t
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {t.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4 p-5 bg-gray-50 rounded-2xl">
          <Label className="text-base">Location Details <span className="text-red-500">*</span></Label>
          <div className="grid grid-cols-3 gap-4">
            {["city", "state", "country"].map((field) => (
              <div key={field}>
                <Label className="text-sm capitalize">{field}</Label>
                <Input
                  value={formData.location[field as keyof typeof formData.location]}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      location: { ...p.location, [field]: e.target.value },
                    }))
                  }
                  className={`mt-1 ${errors[`location.${field}`] ? "border-red-500" : ""}`}
                  placeholder={`Enter ${field}`}
                />
                {errors[`location.${field}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`location.${field}`]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Remote Work */}
        <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="font-medium">Allow Remote Work</p>
              <p className="text-sm text-gray-500">Candidates can work from anywhere</p>
            </div>
          </div>
          <Switch
            checked={formData.isRemote}
            onCheckedChange={(c) => setFormData((p) => ({ ...p, isRemote: c }))}
          />
        </div>
      </div>
    </div>
  );
}