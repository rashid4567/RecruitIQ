import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Upload, X, Loader2 } from "lucide-react";

interface ProfileAvatarSectionProps {
  preview: string | null;
  initials: string;
  isEditing: boolean;
  isUploading: boolean;
  uploadProgress: number;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export function ProfileAvatarSection({
  preview,
  initials,
  isEditing,
  isUploading,
  uploadProgress,
  onFileChange,
  onRemove,
}: ProfileAvatarSectionProps) {
  return (
    <div className="p-6 bg-linear-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl border border-blue-100/50">
      <div className="relative mx-auto w-48 h-48 group">
        <Avatar className="h-full w-full border-4 border-white shadow-xl transition-transform group-hover:scale-105 duration-300">
          {preview ? (
            <AvatarImage src={preview} alt="Profile" className="object-cover" />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <AvatarFallback className="bg-transparent text-white text-4xl font-bold">
                {initials}
              </AvatarFallback>
            </div>
          )}
        </Avatar>

        {isEditing && (
          <div className="absolute -bottom-2 -right-2 flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="h-12 w-12 rounded-full bg-linear-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-105">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={onFileChange}
                    disabled={!isEditing || isUploading}
                  />
                </label>
              </TooltipTrigger>
              <TooltipContent>Upload new photo</TooltipContent>
            </Tooltip>

            {preview && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onRemove}
                    className="h-12 w-12 rounded-full bg-red-500 shadow-lg shadow-red-500/25 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-105"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Remove photo</TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-center mt-2 text-slate-600">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {isUploading && (
        <div className="mt-2 text-center">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500 mx-auto" />
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <h4 className="font-semibold text-slate-900 text-lg">Profile Photo</h4>
          <p className="text-sm text-slate-600 mt-1">Upload a professional headshot.</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="px-2 py-1 bg-slate-100 rounded-md">400×400px</span>
          <span className="px-2 py-1 bg-slate-100 rounded-md">JPG/PNG</span>
          <span className="px-2 py-1 bg-slate-100 rounded-md">Max 5MB</span>
        </div>
      </div>
    </div>
  );
}