// Step4Compensation.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Calendar, Link as LinkIcon } from "lucide-react";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types";

interface Step4CompensationProps {
  formData: JobFormData;
  setFormData: (updater: (prev: JobFormData) => JobFormData) => void;
}

export default function Step4Compensation({ formData, setFormData }: Step4CompensationProps) {
  const currencies = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  ];

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || "₹";
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Compensation & Details</h2>
        <p className="text-gray-500 mt-1">Salary range, deadlines, and external links</p>
      </div>

      <div className="space-y-6">
        {/* Salary Range */}
        <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl">
          <Label className="flex items-center gap-2 text-lg font-semibold">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Salary Range (Annual)
          </Label>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <Select
              value={formData.salary.currency}
              onValueChange={(v) => setFormData((p) => ({ 
                ...p, 
                salary: { ...p.salary, currency: v }
              }))}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.symbol} {c.code} - {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {getCurrencySymbol(formData.salary.currency)}
              </span>
              <Input
                type="number"
                placeholder="Min"
                value={formData.salary.min || ""}
                onChange={(e) => setFormData((p) => ({ 
                  ...p, 
                  salary: { ...p.salary, min: parseInt(e.target.value) || 0 }
                }))}
                className="pl-8 h-12"
              />
            </div>
            
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {getCurrencySymbol(formData.salary.currency)}
              </span>
              <Input
                type="number"
                placeholder="Max"
                value={formData.salary.max || ""}
                onChange={(e) => setFormData((p) => ({ 
                  ...p, 
                  salary: { ...p.salary, max: parseInt(e.target.value) || 0 }
                }))}
                className="pl-8 h-12"
              />
            </div>
          </div>
          {formData.salary.min > formData.salary.max && formData.salary.max > 0 && (
            <p className="text-red-500 text-sm mt-2">Minimum salary cannot exceed maximum salary</p>
          )}
        </div>

        {/* Application Deadline */}
        <div>
          <Label className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Application Deadline
          </Label>
          <Input
            type="date"
            value={formData.expiresAt}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setFormData((p) => ({ ...p, expiresAt: e.target.value }))}
            className="h-12 mt-2"
          />
          <p className="text-xs text-gray-400 mt-1">
            Applications will close after this date
          </p>
        </div>

        {/* External Link */}
        <div>
          <Label className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            External Application Link
          </Label>
          <Input
            type="url"
            value={formData.externalLink}
            onChange={(e) => setFormData((p) => ({ ...p, externalLink: e.target.value }))}
            placeholder="https://careers.company.com/apply"
            className="h-12 mt-2"
          />
          <p className="text-xs text-gray-400 mt-1">
            If provided, candidates will be redirected to this link to apply
          </p>
        </div>
      </div>
    </div>
  );
}