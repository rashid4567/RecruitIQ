// "use client";

// import { useState } from "react";
// import { X } from "lucide-react";

// interface ReasonPromptModalProps {
//   open: boolean;
//   title: string;
//   description?: string;
//   confirmLabel: string;
//   confirmTone?: "danger" | "primary";
//   submitting?: boolean;
//   onConfirm: (reason: string) => void;
//   onClose: () => void;
// }

// export function ReasonPromptModal({
//   open,
//   title,
//   description,
//   confirmLabel,
//   confirmTone = "primary",
//   submitting = false,
//   onConfirm,
//   onClose,
// }: ReasonPromptModalProps) {
//   const [reason, setReason] = useState("");

//   if (!open) return null;

//   const confirmClasses =
//     confirmTone === "danger"
//       ? "bg-red-600 hover:bg-red-700"
//       : "bg-indigo-600 hover:bg-indigo-700";

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
//       <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200">
//         <div className="flex items-start justify-between p-5 border-b border-slate-100">
//           <div>
//             <h3 className="text-base font-bold text-slate-900">{title}</h3>
//             {description && (
//               <p className="text-sm text-slate-500 mt-1">{description}</p>
//             )}
//           </div>
//           <button
//             onClick={onClose}
//             className="text-slate-400 hover:text-slate-600 transition-colors"
//             aria-label="Close"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="p-5">
//           <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
//             Reason
//           </label>
//           <textarea
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//             rows={3}
//             placeholder="Add a short reason..."
//             className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
//           />
//         </div>

//         <div className="flex gap-3 p-5 pt-0">
//           <button
//             onClick={onClose}
//             disabled={submitting}
//             className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => reason.trim() && onConfirm(reason.trim())}
//             disabled={submitting || !reason.trim()}
//             className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 ${confirmClasses}`}
//           >
//             {submitting ? "Submitting..." : confirmLabel}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }