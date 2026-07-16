import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X, Loader2, Camera } from "lucide-react";

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
    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-5">

    
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-gray-50 shadow-md">
            <Avatar className="w-full h-full rounded-2xl">
              {preview ? (
                <AvatarImage src={preview} alt="Profile" className="object-cover" />
              ) : (
                <AvatarFallback className="bg-gray-900 text-white text-3xl font-bold rounded-2xl w-full h-full flex items-center justify-center">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
          </div>

         
          {isUploading && (
            <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm">
              <Loader2 className="w-3.5 h-3.5 text-gray-500 animate-spin" />
            </span>
          )}
        </div>

     
        {isEditing && (
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-xl transition-colors shadow-sm">
                    <Camera className="w-3.5 h-3.5" />
                    {preview ? "Change photo" : "Upload photo"}
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
              <TooltipContent>Upload a new profile photo</TooltipContent>
            </Tooltip>

            {preview && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onRemove}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-medium rounded-xl transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </TooltipTrigger>
                <TooltipContent>Remove current photo</TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </div>

      {/* Upload progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-1.5">
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-center text-gray-400">
            Uploading… {uploadProgress}%
          </p>
        </div>
      )}

      {/* Info */}
      <div className="border-t border-gray-50 pt-4 space-y-2">
        <div>
          <h4 className="text-sm font-semibold text-gray-800">Profile Photo</h4>
          <p className="text-xs text-gray-400 mt-0.5">Upload a professional headshot.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["400 × 400 px", "JPG / PNG / WebP", "Max 5 MB"].map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-400 text-xs rounded-lg font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}