import { Wifi, Camera, Mic, Volume2, FileText, IdCard } from "lucide-react";

const ITEMS = [
  { icon: Wifi, label: "Stable internet connection" },
  { icon: Camera, label: "Working camera" },
  { icon: Mic, label: "Working microphone" },
  { icon: Volume2, label: "Quiet, well-lit place" },
  { icon: FileText, label: "Resume ready to reference" },
  { icon: IdCard, label: "Government ID handy (if required)" },
];

export default function PreparationChecklist() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">
        Before you join
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ITEMS.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-2.5 text-sm text-slate-600 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
          >
            <Icon size={15} className="text-indigo-500 shrink-0" />
            {label}
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-400 mt-3">
        You'll get a chance to test your camera and mic in the lobby right
        before the room opens.
      </p>
    </div>
  );
}