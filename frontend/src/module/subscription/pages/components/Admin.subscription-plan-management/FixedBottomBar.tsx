interface FixedBottomBarProps {
  isEditMode: boolean;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export default function FixedBottomBar({
  isEditMode,
  saving,
  onSave,
  onCancel,
}: FixedBottomBarProps) {
  return (
    <div className="fixed bottom-0 left-65 right-0 border-t border-zinc-200 bg-white px-8 py-4 flex justify-end gap-4 z-40">
      <button
        onClick={onCancel}
        className="px-6 py-2.5 text-zinc-700 font-medium hover:bg-zinc-100 rounded-xl"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="px-8 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-70 flex items-center gap-2"
      >
        {saving ? "Saving..." : isEditMode ? "Update Plan" : "Create Plan"}
      </button>
    </div>
  );
}
