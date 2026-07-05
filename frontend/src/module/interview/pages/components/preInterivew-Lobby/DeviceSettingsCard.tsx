// import type { MediaDeviceOption } from "@/module/interview/hooks/common/Usemediadevices";
// import { ChevronDown } from "lucide-react";


// interface DeviceSettingsCardProps {
//   cameras: MediaDeviceOption[];
//   microphones: MediaDeviceOption[];
//   speakers: MediaDeviceOption[];
//   supportsSpeakerSelection: boolean;
//   selectedCameraId: string;
//   selectedMicrophoneId: string;
//   selectedSpeakerId: string;
//   onSelectCamera: (deviceId: string) => void;
//   onSelectMicrophone: (deviceId: string) => void;
//   onSelectSpeaker: (deviceId: string) => void;
//   micLevel: number;
// }

// function DeviceSelect({
//   label,
//   options,
//   value,
//   onChange,
//   disabled,
//   disabledHint,
// }: {
//   label: string;
//   options: MediaDeviceOption[];
//   value: string;
//   onChange: (id: string) => void;
//   disabled?: boolean;
//   disabledHint?: string;
// }) {
//   return (
//     <div>
//       <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
//         {label}
//       </label>
//       <div className="relative">
//         <select
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           disabled={disabled || options.length === 0}
//           className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//         >
//           {options.length === 0 ? (
//             <option>No device found</option>
//           ) : (
//             options.map((opt) => (
//               <option key={opt.deviceId} value={opt.deviceId}>
//                 {opt.label}
//               </option>
//             ))
//           )}
//         </select>
//         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
//       </div>
//       {disabled && disabledHint && (
//         <p className="text-xs text-slate-400 mt-1">{disabledHint}</p>
//       )}
//     </div>
//   );
// }

// export function DeviceSettingsCard({
//   cameras,
//   microphones,
//   speakers,
//   supportsSpeakerSelection,
//   selectedCameraId,
//   selectedMicrophoneId,
//   selectedSpeakerId,
//   onSelectCamera,
//   onSelectMicrophone,
//   onSelectSpeaker,
//   micLevel,
// }: DeviceSettingsCardProps) {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 space-y-4">
//       <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
//         Device settings
//       </h3>

//       <DeviceSelect
//         label="Camera"
//         options={cameras}
//         value={selectedCameraId}
//         onChange={onSelectCamera}
//       />
//       <DeviceSelect
//         label="Microphone"
//         options={microphones}
//         value={selectedMicrophoneId}
//         onChange={onSelectMicrophone}
//       />
//       <DeviceSelect
//         label="Speaker"
//         options={speakers}
//         value={selectedSpeakerId}
//         onChange={onSelectSpeaker}
//         disabled={!supportsSpeakerSelection}
//         disabledHint="Your browser doesn't support speaker selection."
//       />

//       <div className="pt-2">
//         <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
//           Microphone level
//         </label>
//         <div className="flex items-center gap-2">
//           <div className="flex gap-0.5 flex-1">
//             {Array.from({ length: 20 }).map((_, i) => (
//               <div
//                 key={i}
//                 className={`h-2 flex-1 rounded-sm transition-colors ${
//                   i < Math.ceil((micLevel / 100) * 20) ? "bg-indigo-600" : "bg-slate-200"
//                 }`}
//               />
//             ))}
//           </div>
//           <span className="text-xs font-semibold text-slate-500 w-9 text-right">
//             {micLevel}%
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }