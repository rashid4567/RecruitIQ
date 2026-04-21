import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Calendar, Link as LinkIcon } from "lucide-react";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types";

interface Props {
  formData: JobFormData;
  setFormData: (updater: (prev: JobFormData) => JobFormData) => void;
  errors: Record<string, string>;
}

export default function Step4Compensation({ formData, setFormData, errors }: Props) {
  const currencies = [
    { code: "INR", symbol: "₹" },
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Compensation & Details</h2>
        <p className="text-gray-500 mt-1">Salary and application details</p>
      </div>

      <div className="space-y-6">
        {/* Salary */}
        <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5" /> Salary Range (Annual)
          </Label>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <Select
              value={formData.salary.currency}
              onValueChange={(v) => setFormData((p) => ({ ...p, salary: { ...p.salary, currency: v } }))}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-500">Min</span>
              <Input
                type="number"
                value={formData.salary.min || ""}
                onChange={(e) => setFormData((p) => ({ ...p, salary: { ...p.salary, min: parseInt(e.target.value) || 0 } }))}
                className={`pl-12 h-12 ${errors["salary.max"] ? "border-red-500" : ""}`}
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-500">Max</span>
              <Input
                type="number"
                value={formData.salary.max || ""}
                onChange={(e) => setFormData((p) => ({ ...p, salary: { ...p.salary, max: parseInt(e.target.value) || 0 } }))}
                className={`pl-12 h-12 ${errors["salary.max"] ? "border-red-500" : ""}`}
              />
            </div>
          </div>
          {errors["salary.max"] && <p className="text-red-500 text-sm mt-2">{errors["salary.max"]}</p>}
        </div>

        {/* Deadline */}
        <div>
          <Label>Application Deadline <span className="text-red-500">*</span></Label>
          <Input
            type="date"
            value={formData.expiresAt}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setFormData((p) => ({ ...p, expiresAt: e.target.value }))}
            className={`h-12 mt-2 ${errors.expiresAt ? "border-red-500" : ""}`}
          />
          {errors.expiresAt && <p className="text-red-500 text-sm mt-1">{errors.expiresAt}</p>}
        </div>

        {/* External Link */}
        <div>
          <Label>External Application Link (Optional)</Label>
          <Input
            type="url"
            value={formData.externalLink}
            onChange={(e) => setFormData((p) => ({ ...p, externalLink: e.target.value }))}
            placeholder="https://..."
            className="h-12 mt-2"
          />
        </div>
      </div>
    </div>
  );
}