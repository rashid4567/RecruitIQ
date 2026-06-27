
import { Upload, Check } from "lucide-react";

interface LogoUploadProps {
  logoPreview: string | null;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LogoUpload({ logoPreview, onLogoUpload }: LogoUploadProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-900">Company Logo (Optional)</label>
      <div
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
          logoPreview ? "border-green-400 bg-green-50" : "border-slate-300 hover:border-blue-400 hover:bg-blue-50"
        }`}
      >
        <input type="file" accept="image/*" onChange={onLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
        
        <div className="flex flex-col items-center gap-4">
          {logoPreview ? (
            <div className="relative">
              <img src={logoPreview} alt="Logo" className="w-28 h-28 rounded-2xl object-cover shadow-md" />
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            </div>
          ) : (
            <Upload className="h-12 w-12 text-slate-400" />
          )}
          <div>
            <p className="text-slate-600 font-medium">Click to upload company logo</p>
            <p className="text-xs text-slate-500 mt-1">PNG, JPG, WebP • Max 2MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}