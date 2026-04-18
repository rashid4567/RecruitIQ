import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types"; 

interface Step4CompensationProps {
  formData: JobFormData;
  setFormData: (updater: (prev: JobFormData) => JobFormData) => void;
}

export default function Step4Compensation({ formData, setFormData }: Step4CompensationProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Compensation & Details</h2>
        <p className="text-gray-500 mt-1">Salary range and application deadline</p>
      </div>

      <div className="p-6 bg-emerald-50 rounded-2xl">
        <Label>Salary Range (Annual)</Label>
        <div className="grid grid-cols-3 gap-4 mt-3">
          <Select
            value={formData.salary.currency}
            onValueChange={(v) => setFormData((p) => ({ ...p, salary: { ...p.salary, currency: v } }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Min"
            value={formData.salary.min}
            onChange={(e) => setFormData((p) => ({ ...p, salary: { ...p.salary, min: +e.target.value } }))}
          />
          <Input
            type="number"
            placeholder="Max"
            value={formData.salary.max}
            onChange={(e) => setFormData((p) => ({ ...p, salary: { ...p.salary, max: +e.target.value } }))}
          />
        </div>
      </div>

      <div>
        <Label>Application Deadline</Label>
        <Input
          type="date"
          value={formData.expiresAt}
          onChange={(e) => setFormData((p) => ({ ...p, expiresAt: e.target.value }))}
        />
      </div>
    </div>
  );
}