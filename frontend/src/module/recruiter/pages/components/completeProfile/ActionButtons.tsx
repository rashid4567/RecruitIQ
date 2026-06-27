import { useNavigate } from "react-router-dom";
interface ActionButtonsProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  progress: number;
}


export function ActionButtons({ onSubmit, isSubmitting, progress }: ActionButtonsProps) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-8">
      <button
        type="button"
        onClick={() => navigate("/recruiter")}
        className="flex-1 py-4 border border-slate-300 rounded-2xl font-semibold text-slate-700 hover:bg-slate-50"
      >
        ← Back
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting || progress < 100}
        className={`flex-1 py-4 rounded-2xl font-semibold text-white transition-all flex items-center justify-center gap-3 ${
          isSubmitting || progress < 100
            ? "bg-slate-400 cursor-not-allowed"
            : "bg-linear-to-r from-blue-600 to-blue-700 hover:shadow-xl"
        }`}
      >
        {isSubmitting ? (
          <>Processing...</>
        ) : progress < 100 ? (
          `Complete Profile (${Math.round(progress)}%)`
        ) : (
          "Complete Setup & Continue →"
        )}
      </button>
    </div>
  );
}