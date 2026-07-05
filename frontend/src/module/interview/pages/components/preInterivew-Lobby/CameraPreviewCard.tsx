// "use client";

// import { useEffect, useRef } from "react";
// import { Camera, Mic, MicOff, VideoOff, Loader2, AlertTriangle } from "lucide-react";

// interface CameraPreviewCardProps {
//   stream: MediaStream | null;
//   isCameraEnabled: boolean;
//   isMuted: boolean;
//   loading: boolean;
//   error: string | null;
//   onToggleCamera: () => void;
//   onToggleMic: () => void;
// }

// export function CameraPreviewCard({
//   stream,
//   isCameraEnabled,
//   isMuted,
//   loading,
//   error,
//   onToggleCamera,
//   onToggleMic,
// }: CameraPreviewCardProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//     }
//   }, [stream]);

//   return (
//     <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
//       <div className="relative bg-slate-900 aspect-video flex items-center justify-center">
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           className={`h-full w-full object-cover ${
//             isCameraEnabled && stream ? "block" : "hidden"
//           }`}
//         />

//         {!loading && !error && (!stream || !isCameraEnabled) && (
//           <div className="flex flex-col items-center gap-3">
//             <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
//               <VideoOff className="w-7 h-7 text-slate-400" />
//             </div>
//             <p className="text-slate-300 text-sm font-medium">Camera is off</p>
//           </div>
//         )}

//         {loading && (
//           <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/80">
//             <Loader2 className="w-8 h-8 text-white animate-spin" />
//             <p className="text-white text-sm font-medium">Preparing camera...</p>
//           </div>
//         )}

//         {error && !loading && (
//           <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/90 px-6 text-center">
//             <AlertTriangle className="w-8 h-8 text-red-400" />
//             <p className="text-white text-sm font-semibold">{error}</p>
//             <p className="text-slate-400 text-xs">
//               Check your browser's camera and microphone permissions.
//             </p>
//           </div>
//         )}

//         {isMuted && !loading && (
//           <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-500/90 px-2.5 py-1 rounded-lg">
//             <MicOff className="w-3.5 h-3.5 text-white" />
//             <span className="text-xs font-semibold text-white">Muted</span>
//           </div>
//         )}
//       </div>

//       <div className="flex items-center justify-center gap-3 p-4 bg-slate-50">
//         <button
//           onClick={onToggleMic}
//           disabled={loading || !!error}
//           className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
//             isMuted
//               ? "bg-red-50 text-red-600 hover:bg-red-100"
//               : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
//           }`}
//         >
//           {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
//           {isMuted ? "Unmute" : "Mute"}
//         </button>
//         <button
//           onClick={onToggleCamera}
//           disabled={loading || !!error}
//           className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
//             !isCameraEnabled
//               ? "bg-red-50 text-red-600 hover:bg-red-100"
//               : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
//           }`}
//         >
//           {isCameraEnabled ? <Camera className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
//           {isCameraEnabled ? "Stop video" : "Start video"}
//         </button>
//       </div>
//     </div>
//   );
// }