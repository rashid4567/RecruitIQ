import { useCallback, useEffect, useRef, useState } from "react";
import { WebRTCService } from "../../services/WebRTCService";
import { socketService } from "../../services/SocketService";

import type {
  AnswerPayload,
  IceCandidatePayload,
  JoinRoomFailedPayload,
  OfferPayload,
  RoomJoinedPayload,
  UserJoinedPayload,
  UserLeftPayload,
} from "../../types/socket.types";

import type {
  CallState,
  IceConnectionState,
  PeerConnectionState,
} from "../../types/webrtc.types";

export type ParticipantRole = "candidate" | "recruiter";
const JOIN_ROOM_TIMEOUT_MS = 15000;

interface UseInterviewCallParams {
  interviewId: string;
  roomId: string;
  userId: string;
  role: ParticipantRole;
  onCallEnded?: () => void;
  onError?: (message: string) => void;
}

interface UseInterviewCallReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  loading: boolean;
  error: string | null;
  callState: CallState;
  connectionState: PeerConnectionState;
  iceConnectionState: IceConnectionState;
  isMuted: boolean;
  isCameraEnabled: boolean;
  isScreenSharing: boolean;
  initialize: () => Promise<void>;
  toggleMicrophone: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => Promise<void>;
  endCall: () => Promise<void>;
}

export function useInterviewCall({
  interviewId,
  roomId,
  userId,
  role,
  onCallEnded,
  onError,
}: UseInterviewCallParams): UseInterviewCallReturn {
  const webRTCRef = useRef<WebRTCService | null>(null);
  if (!webRTCRef.current) {
    webRTCRef.current = new WebRTCService();
  }
  const webRTC = webRTCRef.current;
  const pendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const isInitializedRef = useRef(false);
  const hasJoinedRoomRef = useRef(false);
  const joinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callState, setCallState] = useState<CallState>("IDLE");
  const [connectionState, setConnectionState] =
    useState<PeerConnectionState>("new");
  const [iceConnectionState, setIceConnectionState] =
    useState<IceConnectionState>("new");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const callbacksRegisteredRef = useRef(false);

  const clearJoinTimeout = useCallback(() => {
    if (joinTimeoutRef.current) {
      clearTimeout(joinTimeoutRef.current);
      joinTimeoutRef.current = null;
    }
  }, []);

  const handleError = useCallback(
    (message: string, err?: unknown) => {
      console.error(`[useInterviewCall] ${message}`, err);
      setError(message);
      setCallState("ENDED");
      onError?.(message);
    },
    [onError],
  );

  const flushPendingIceCandidates = useCallback(async () => {
    const queued = pendingIceCandidatesRef.current;
    pendingIceCandidatesRef.current = [];

    for (const candidate of queued) {
      try {
        await webRTC.addIceCandidate(candidate);
      } catch (err) {
        console.error("[ICE] Failed to add queued candidate", err);
      }
    }
  }, [webRTC]);

  const createAndSendOffer = useCallback(async () => {
    try {
      console.log("[OFFER] Creating and sending offer.", { roomId, role });
      const offer = await webRTC.createOffer();
      socketService.sendOffer({ roomId, offer });
    } catch (err) {
      handleError("Failed to create offer.", err);
    }
  }, [webRTC, roomId, role, handleError]);

  const handleOffer = useCallback(
    async ({ offer }: OfferPayload) => {
      try {
        console.log("[OFFER] Received.", { roomId, role });
        await webRTC.setRemoteDescription(offer);
        await flushPendingIceCandidates();
        const answer = await webRTC.createAnswer();
        socketService.sendAnswer({ roomId, answer });
      } catch (err) {
        handleError("Failed to handle incoming offer.", err);
      }
    },
    [webRTC, roomId, role, flushPendingIceCandidates, handleError],
  );

  const handleAnswer = useCallback(
    async ({ answer }: AnswerPayload) => {
      try {
        console.log("[ANSWER] Received.", { roomId, role });
        await webRTC.setRemoteDescription(answer);
        await flushPendingIceCandidates();
      } catch (err) {
        handleError("Failed to handle incoming answer.", err);
      }
    },
    [webRTC, roomId, role, flushPendingIceCandidates, handleError],
  );

  const handleRemoteIceCandidate = useCallback(
    async ({ candidate }: IceCandidatePayload) => {
      try {
        console.log("[ICE] Received remote candidate.", { roomId, role });
        if (webRTC.hasRemoteDescription()) {
          await webRTC.addIceCandidate(candidate);
        } else {
          pendingIceCandidatesRef.current.push(candidate);
        }
      } catch (err) {
        console.error("[ICE] Failed to add candidate", err);
      }
    },
    [webRTC, roomId, role],
  );

  const handleUserJoined = useCallback(
    (_payload: UserJoinedPayload) => {
      console.log("[ROOM] User joined.", { roomId, role });

      if (role !== "recruiter") {
        return;
      }
      void createAndSendOffer();
    },
    [role, roomId, createAndSendOffer],
  );

  const handleUserLeft = useCallback(
    (_payload: UserLeftPayload) => {
      console.log("[ROOM] User left.", { roomId, role });
      setRemoteStream(null);
      setConnectionState("disconnected");
      setCallState("ENDED");
    },
    [roomId, role],
  );

  const handleRoomJoined = useCallback(
    (_payload: RoomJoinedPayload) => {
      console.log("[ROOM] Joined successfully.", {
        roomId,
        interviewId,
        role,
      });

      clearJoinTimeout();
      hasJoinedRoomRef.current = true;
      setLoading(false);
      setCallState("CONNECTING");
    },
    [clearJoinTimeout, roomId, interviewId, role],
  );

  const handleJoinRoomFailed = useCallback(
    (payload: JoinRoomFailedPayload) => {
      console.error("[ROOM] Join failed.", {
        roomId,
        interviewId,
        role,
        payload,
      });
      clearJoinTimeout();
      handleError(payload.message || "Failed to join the interview room.");
      setLoading(false);
      socketService.removeAllListeners();
      socketService.disconnect();
      webRTC.dispose();
      pendingIceCandidatesRef.current = [];
      isInitializedRef.current = false;
      hasJoinedRoomRef.current = false;
      callbacksRegisteredRef.current = false;
    },
    [clearJoinTimeout, handleError, webRTC, roomId, interviewId, role],
  );

  const registerWebRTCCallbacks = useCallback(() => {
    webRTC.onIceCandidate((candidate) => {
      socketService.sendIceCandidate({
        roomId,
        candidate: candidate.toJSON(),
      });
    });

    webRTC.onRemoteStream((stream) => {
      console.log("[REMOTE STREAM] Received.", {
        tracks: stream.getTracks().length,
      });
      setRemoteStream(stream);
    });

    webRTC.onConnectionStateChanged((state) => {
      setConnectionState(state);

      if (state === "connected") {
        setCallState("CONNECTED");
        console.log("[CONNECTION] Connected.", {
          roomId,
          role,
        });
        setLoading(false);
      }

      if (state === "disconnected") {
        console.warn("[CONNECTION] disconnected — may recover.", {
          roomId,
          role,
        });
      }
      if (state === "failed" || state === "closed") {
        console.error(`[CONNECTION] ${state}`, { roomId, role });
        setCallState("ENDED");
      }
    });

    webRTC.onIceConnectionStateChanged((state) => {
      console.log("[ICE]", state);

      setIceConnectionState(state);
    });
  }, [webRTC, roomId, role]);

  const registerSocketEvents = useCallback(() => {
    socketService.onRoomJoined(handleRoomJoined);
    socketService.onJoinRoomFailed(handleJoinRoomFailed);
    socketService.onUserJoined(handleUserJoined);
    socketService.onUserLeft(handleUserLeft);
    socketService.onOffer(handleOffer);
    socketService.onAnswer(handleAnswer);
    socketService.onIceCandidate(handleRemoteIceCandidate);
  }, [
    handleRoomJoined,
    handleJoinRoomFailed,
    handleUserJoined,
    handleUserLeft,
    handleOffer,
    handleAnswer,
    handleRemoteIceCandidate,
  ]);

  const initialize = useCallback(async () => {
    if (isInitializedRef.current) {
      console.log("[CALL] Already initialized.");
      return;
    }

    isInitializedRef.current = true;

    console.log("[CALL] Initializing interview call...", {
      interviewId,
      roomId,
      role,
      userId,
    });

    setError(null);
    setLoading(true);
    setCallState("CONNECTING");

    try {
      await webRTC.initialize();

      setLocalStream(webRTC.getLocalStream());
      setIsMuted(!webRTC.isMicrophoneEnabled());
      setIsCameraEnabled(webRTC.isCameraEnabled());
      if (!callbacksRegisteredRef.current) {
        console.log("[CALLBACKS] Registering Socket & WebRTC callbacks.");
        registerWebRTCCallbacks();
        registerSocketEvents();
        callbacksRegisteredRef.current = true;
      }
      socketService.connect();
      socketService.joinRoom({
        interviewId,
        roomId,
        userId,
        role,
      });

      clearJoinTimeout();

      joinTimeoutRef.current = setTimeout(() => {
        if (hasJoinedRoomRef.current) {
          return;
        }
        console.error("[ROOM] Join timeout.", {
          roomId,
          interviewId,
          role,
        });

        handleError("Timed out while joining the interview room.");
        socketService.removeAllListeners();
        socketService.disconnect();
        webRTC.dispose();
        pendingIceCandidatesRef.current = [];
        isInitializedRef.current = false;
        hasJoinedRoomRef.current = false;
        callbacksRegisteredRef.current = false;

        setLoading(false);
        setCallState("ENDED");
      }, JOIN_ROOM_TIMEOUT_MS);

      console.log("[CALL] Initialization completed.", {
        interviewId,
        roomId,
        role,
      });
    } catch (err) {
      console.error("[CALL] Initialization failed.", err);

      clearJoinTimeout();
      socketService.removeAllListeners();
      socketService.disconnect();
      webRTC.dispose();
      pendingIceCandidatesRef.current = [];
      isInitializedRef.current = false;
      hasJoinedRoomRef.current = false;
      callbacksRegisteredRef.current = false;
      setLoading(false);
      handleError("Failed to initialize the interview call.", err);
    }
  }, [
    webRTC,
    interviewId,
    roomId,
    userId,
    role,
    registerWebRTCCallbacks,
    registerSocketEvents,
    clearJoinTimeout,
    handleError,
  ]);

  const toggleMicrophone = useCallback(() => {
    const enabled = webRTC.toggleMicrophone();
    setIsMuted(!enabled);
  }, [webRTC]);

  const toggleCamera = useCallback(() => {
    const enabled = webRTC.toggleCamera();
    setIsCameraEnabled(enabled);
  }, [webRTC]);

  const toggleScreenShare = useCallback(async () => {
    try {
      if (isScreenSharing) {
        await webRTC.stopScreenShare();
        setIsScreenSharing(false);
      } else {
        await webRTC.startScreenShare();
        setIsScreenSharing(true);
      }
      setLocalStream(webRTC.getLocalStream());
    } catch (err) {
      handleError("Failed to toggle screen sharing.", err);
    }
  }, [webRTC, isScreenSharing, handleError]);

  const endCall = useCallback(async () => {
    try {
      console.log("[CALL] Ending...", { roomId, interviewId, role });
      clearJoinTimeout();

      if (hasJoinedRoomRef.current) {
        socketService.leaveRoom({ roomId });
        hasJoinedRoomRef.current = false;
      }

      socketService.removeAllListeners();
      socketService.disconnect();
      webRTC.dispose();
      isInitializedRef.current = false;
      pendingIceCandidatesRef.current = [];
      callbacksRegisteredRef.current = false;
      setLocalStream(null);
      setRemoteStream(null);
      setCallState("ENDED");
      setConnectionState("closed");
      setIceConnectionState("closed");
      setLoading(false);
      setError(null);
      onCallEnded?.();
      console.log("[CALL] Ended.", { roomId, interviewId, role });
    } catch (err) {
      console.error("[CALL] Failed to end call.", err);
      handleError("Failed to end the interview call.", err);
    } finally {
      clearJoinTimeout();
      pendingIceCandidatesRef.current = [];
    }
  }, [webRTC, roomId, interviewId, role, onCallEnded, clearJoinTimeout]);

  useEffect(() => {
    return () => {
      clearJoinTimeout();
      pendingIceCandidatesRef.current = [];
      if (isInitializedRef.current) {
        socketService.removeAllListeners();
        socketService.disconnect();
        webRTC.dispose();
        isInitializedRef.current = false;
        hasJoinedRoomRef.current = false;
        callbacksRegisteredRef.current = false;
      }
    };
  }, [clearJoinTimeout, webRTC]);

  return {
    localStream,
    remoteStream,
    loading,
    error,
    callState,
    connectionState,
    iceConnectionState,
    isMuted,
    isCameraEnabled,
    isScreenSharing,
    initialize,
    toggleMicrophone,
    toggleCamera,
    toggleScreenShare,
    endCall,
  };
}
