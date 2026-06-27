import { Lock } from "lucide-react";

export default function EnterpriseCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-linear-to-r from-blue-600 to-purple-600">
        <Lock className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">Enterprise Plan</h3>
      <p className="text-sm text-slate-600 mb-4">
        Get unlimited everything with dedicated account manager and priority
        support.
      </p>
      <button className="w-full px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
        Learn More
      </button>
    </div>
  );
}
