import { Button } from "@/components/ui/button";
import { Edit, Save, X, Loader2 } from "lucide-react";

interface ProfileActionsFooterProps {
  isEditing: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  hasErrors: boolean;
  onEdit: () => void;
  onCancel: () => void;
}

export function ProfileActionsFooter({
  isEditing,
  isDirty,
  isSubmitting,
  isUploading,
  hasErrors,
  onEdit,
  onCancel,
}: ProfileActionsFooterProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200">
      <div className="flex items-center gap-2 text-sm">
        {isEditing ? (
          <>
            <div className={`h-2 w-2 rounded-full ${isDirty ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
            <span className="text-slate-600">
              {isDirty 
                ? "You have unsaved changes. Save or cancel to continue."
                : "No changes made yet."}
            </span>
          </>
        ) : (
          <>
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-slate-600">Ready to update your profile information?</span>
          </>
        )}
      </div>

      <div className="flex gap-3">
        {isEditing ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-11 px-6 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              disabled={isSubmitting || isUploading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 px-6 gap-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300 disabled:opacity-70"
              disabled={isSubmitting || !isDirty || hasErrors || isUploading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="default"
            onClick={onEdit}
            className="h-11 px-6 gap-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
}