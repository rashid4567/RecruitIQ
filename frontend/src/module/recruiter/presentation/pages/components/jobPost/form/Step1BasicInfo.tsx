// Step1BasicInfo.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MapPin, Building2, Users, Briefcase } from "lucide-react";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types";

interface Step1BasicInfoProps {
  formData: JobFormData;
  setFormData: (updater: (prev: JobFormData) => JobFormData) => void;
}

export default function Step1BasicInfo({ formData, setFormData }: Step1BasicInfoProps) {
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
            className="h-12"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Department */}
          <div>
            <Label className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Department <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.department}
              onValueChange={(v) => setFormData((p) => ({ ...p, department: v }))}
            >
              <SelectTrigger className="h-12 mt-2">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {["Engineering", "Product", "Design", "Marketing", "Sales", "Data Science", "HR", "Finance", "Operations"].map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Number of Positions */}
          <div>
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Number of Positions <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min={1}
              value={formData.positions}
              onChange={(e) => setFormData((p) => ({ ...p, positions: parseInt(e.target.value) || 1 }))}
              className="h-12 mt-2"
            />
          </div>
        </div>

        {/* Employment Type */}
        <div>
          <Label className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Employment Type <span className="text-red-500">*</span>
          </Label>
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

        {/* Location Section */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location Details
          </Label>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm">City</Label>
              <Input
                value={formData.location.city}
                onChange={(e) => setFormData((p) => ({ 
                  ...p, 
                  location: { ...p.location, city: e.target.value }
                }))}
                placeholder="e.g., Mumbai"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">State</Label>
              <Input
                value={formData.location.state}
                onChange={(e) => setFormData((p) => ({ 
                  ...p, 
                  location: { ...p.location, state: e.target.value }
                }))}
                placeholder="e.g., Maharashtra"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Country</Label>
              <Input
                value={formData.location.country}
                onChange={(e) => setFormData((p) => ({ 
                  ...p, 
                  location: { ...p.location, country: e.target.value }
                }))}
                placeholder="e.g., India"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Remote Work Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="font-medium">Remote Work</p>
              <p className="text-sm text-gray-500">Candidates can work remotely</p>
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