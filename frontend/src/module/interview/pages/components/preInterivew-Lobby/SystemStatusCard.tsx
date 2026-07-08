// import { CheckCircle2, XCircle, HelpCircle, Wifi, WifiOff } from "lucide-react";
// import type { PermissionState } from "@/module/interview/hooks/common/Usemediadevices";
// import type { ConnectionInfo } from "@/module/interview/hooks/common/Useconnectionquality"; 
// import type { JSX } from "react";

// interface SystemStatusCardProps {
//   cameraPermission: PermissionState;
//   microphonePermission: PermissionState;
//   connection: ConnectionInfo;
//   isBrowserSupported: boolean;
// }

// function permissionRow(label: string, state: PermissionState) {
//   const map: Record<PermissionState, { icon: JSX.Element; text: string; tone: string }> = {
//     granted: {
//       icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
//       text: "Granted",
//       tone: "text-emerald-700",
//     },
//     denied: {
//       icon: <XCircle className="w-4 h-4 text-red-600" />,
//       text: "Denied — check browser settings",
//       tone: "text-red-700",
//     },
//     prompt: {
//       icon: <HelpCircle className="w-4 h-4 text-amber-600" />,
//       text: "Not yet requested",
//       tone: "text-amber-700",
//     },
//     unknown: {
//       icon: <HelpCircle className="w-4 h-4 text-slate-400" />,
//       text: "Unknown",
//       tone: "text-slate-500",
//     },
//   };
//   const { icon, text, tone } = map[state];
//   return (
//     <div className="flex items-center justify-between text-sm">
//       <span className="text-slate-600">{label}</span>
//       <span className={`flex items-center gap-1.5 font-medium ${tone}`}>
//         {icon}
//         {text}
//       </span>
//     </div>
//   );
// }

// const CONNECTION_LABEL: Record<ConnectionInfo["quality"], string> = {
//   excellent: "Excellent",
//   good: "Good",
//   fair: "Fair",
//   poor: "Poor",
//   offline: "Offline",
//   unknown: "Unknown",
// };

// export function SystemStatusCard({
//   cameraPermission,
//   microphonePermission,
//   connection,
//   isBrowserSupported,
// }: SystemStatusCardProps) {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 space-y-3">
//       <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
//         System check
//       </h3>

//       <div className="flex items-center justify-between text-sm">
//         <span className="text-slate-600">Browser compatibility</span>
//         <span
//           className={`flex items-center gap-1.5 font-medium ${
//             isBrowserSupported ? "text-emerald-700" : "text-red-700"
//           }`}
//         >
//           {isBrowserSupported ? (
//             <CheckCircle2 className="w-4 h-4 text-emerald-600" />
//           ) : (
//             <XCircle className="w-4 h-4 text-red-600" />
//           )}
//           {isBrowserSupported ? "Supported" : "Unsupported browser"}
//         </span>
//       </div>

//       {permissionRow("Camera permission", cameraPermission)}
//       {permissionRow("Microphone permission", microphonePermission)}

//       <div className="flex items-center justify-between text-sm">
//         <span className="text-slate-600">Connection</span>
//         <span
//           className={`flex items-center gap-1.5 font-medium ${
//             connection.quality === "offline" || connection.quality === "poor"
//               ? "text-red-700"
//               : connection.quality === "fair"
//                 ? "text-amber-700"
//                 : connection.quality === "unknown"
//                   ? "text-slate-500"
//                   : "text-emerald-700"
//           }`}
//         >
//           {connection.quality === "offline" ? (
//             <WifiOff className="w-4 h-4 text-red-600" />
//           ) : (
//             <Wifi className="w-4 h-4" />
//           )}
//           {CONNECTION_LABEL[connection.quality]}
//         </span>
//       </div>
//     </div>
//   );
// }