// import type { CountdownResult } from "@/module/interview/hooks/common/Usecountdown";
// import type { LobbyInterviewDetails } from "@/module/interview/types/Lobby.types";
// import { Calendar, Clock, MapPin, Timer, Video } from "lucide-react";


// interface InterviewInfoCardProps {
//   details: LobbyInterviewDetails;
//   countdown: CountdownResult;
// }

// const STATUS_STYLES: Record<string, string> = {
//   SCHEDULED: "bg-indigo-50 text-indigo-700 border-indigo-200",
//   RESCHEDULED: "bg-amber-50 text-amber-700 border-amber-200",
//   ONGOING: "bg-emerald-50 text-emerald-700 border-emerald-200",
//   COMPLETED: "bg-slate-100 text-slate-600 border-slate-200",
//   CANCELLED: "bg-red-50 text-red-700 border-red-200",
//   NO_SHOW: "bg-red-50 text-red-700 border-red-200",
// };

// function formatScheduledAt(scheduledAt: string): { date: string; time: string } {
//   const d = new Date(scheduledAt);
//   return {
//     date: d.toLocaleDateString(undefined, {
//       weekday: "long",
//       month: "long",
//       day: "numeric",
//     }),
//     time: d.toLocaleTimeString(undefined, {
//       hour: "2-digit",
//       minute: "2-digit",
//     }),
//   };
// }

// export function InterviewInfoCard({ details, countdown }: InterviewInfoCardProps) {
//   const { date, time } = formatScheduledAt(details.scheduledAt);
//   const statusStyle = STATUS_STYLES[details.status] ?? STATUS_STYLES.SCHEDULED;

//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <h2 className="text-xl font-bold text-slate-900">{details.title}</h2>
//           <p className="text-sm text-slate-500 mt-0.5">Round {details.round}</p>
//         </div>
//         <span
//           className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle}`}
//         >
//           {details.status.replace("_", " ")}
//         </span>
//       </div>

//       <div className="grid grid-cols-2 gap-3 text-sm">
//         <div className="flex items-center gap-2 text-slate-600">
//           <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
//           <span>{date}</span>
//         </div>
//         <div className="flex items-center gap-2 text-slate-600">
//           <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
//           <span>
//             {time} &middot; {details.durationInMinutes} min
//           </span>
//         </div>
//         <div className="flex items-center gap-2 text-slate-600">
//           <Video className="w-4 h-4 text-indigo-600 shrink-0" />
//           <span>{details.mode === "ONLINE" ? "Online interview" : "In person"}</span>
//         </div>
//         {details.mode === "OFFLINE" && details.location && (
//           <div className="flex items-center gap-2 text-slate-600">
//             <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
//             <span>{details.location}</span>
//           </div>
//         )}
//       </div>

//       {details.mode === "ONLINE" && !countdown.hasEnded && (
//         <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
//           <Timer className="w-4 h-4 text-slate-400" />
//           <span className="text-sm text-slate-500">
//             {countdown.hasStarted ? "Started" : "Starts in"}
//           </span>
//           <span className="text-sm font-bold text-slate-900 font-mono">
//             {countdown.label}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }