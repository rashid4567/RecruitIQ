import { useCallback, useEffect, useRef, useState } from "react";
import { WebRTCService } from "../../services/WebRTCService";
import { socketService } from "../../services/SocketService";

import type {
  AnswerPayload,
  ChatMessageReceivedPayload,
  IceCandidatePayload,
  JoinRoomFailedPayload,
  OfferPayload,
  RoomJoinedPayload,
  UserJoinedPayload,
  UserLeftPayload,
  InterviewEndedPayload,
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
  messages: ChatMessageReceivedPayload[];
  sendMessage: (message: string) => void;
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
  const [messages, setMessages] = useState<ChatMessageReceivedPayload[]>([]);

  const clearJoinTimeout = useCallback(() => {
    if (joinTimeoutRef.current) {
      clearTimeout(joinTimeoutRef.current);
      joinTimeoutRef.current = null;
    }
  }, []);

  const handleError = useCallback(
    (message: string, _err?: unknown) => {
      setError(message);
      setCallState("ENDED");
      onError?.(message);
    },
    [onError],
  );

  const handleChatMessage = useCallback(
    (payload: ChatMessageReceivedPayload) => {
      setMessages((prev) => {
        const next = [...prev, payload];

        return next.slice(-100);
      });
    },
    [],
  );

  const flushPendingIceCandidates = useCallback(async () => {
    const queued = pendingIceCandidatesRef.current;
    pendingIceCandidatesRef.current = [];

    for (const candidate of queued) {
      try {
        await webRTC.addIceCandidate(candidate);
      } catch (err) {}
    }
  }, [webRTC]);
  const createAndSendOffer = useCallback(async () => {
    try {
      const offer = await webRTC.createOffer();

      socketService.sendOffer({
        roomId,
        offer,
      });
    } catch (err) {
      handleError("Failed to create offer.", err);
    }
  }, [webRTC, roomId, role, handleError]);

  const handleOffer = useCallback(
    async (payload: OfferPayload) => {
      try {
        await webRTC.handleOffer(payload.offer);
        await flushPendingIceCandidates();
        const answer = await webRTC.createAnswer();
        socketService.sendAnswer({
          roomId,
          answer,
        });
      } catch (err) {
        console.error("[SIGNALING] Failed handling offer.", err);
      }
    },
    [roomId, webRTC, flushPendingIceCandidates],
  );

  const handleAnswer = useCallback(
    async (payload: AnswerPayload) => {
      try {
        await webRTC.handleAnswer(payload.answer);

        await flushPendingIceCandidates();
      } catch (err) {
        console.error("[SIGNALING] Failed handling answer.", err);
      }
    },
    [webRTC, flushPendingIceCandidates],
  );

  const handleRemoteIceCandidate = useCallback(
    async ({ candidate }: IceCandidatePayload) => {
      try {
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
    async (_payload: UserJoinedPayload) => {
      if (role !== "recruiter") {
        return;
      }

      try {
        if (webRTC.getSignalingState() !== "stable") {
          return;
        }

        await createAndSendOffer();
      } catch (err) {}
    },
    [role, webRTC, createAndSendOffer],
  );
  const handleUserLeft = useCallback(
    (_payload: UserLeftPayload) => {
      setRemoteStream(null);
      setConnectionState("disconnected");
    },
    [role],
  );

  const handleInterviewEnded = useCallback(
    (_payload: InterviewEndedPayload) => {
      setRemoteStream(null);
      webRTC.dispose();
      socketService.removeAllListeners();
      socketService.disconnect();
      pendingIceCandidatesRef.current = [];
      hasJoinedRoomRef.current = false;
      callbacksRegisteredRef.current = false;
      isInitializedRef.current = false;

      setCallState("ENDED");
      setConnectionState("closed");
      setIceConnectionState("closed");

      onCallEnded?.();
    },
    [webRTC, onCallEnded],
  );

  const handleRoomJoined = useCallback((_payload: RoomJoinedPayload) => {
    clearJoinTimeout();

    hasJoinedRoomRef.current = true;

    setCallState("CONNECTING");
    setLoading(false);
  }, []);

  const handleJoinRoomFailed = useCallback(
    (payload: JoinRoomFailedPayload) => {
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
      setRemoteStream(stream);
    });

    webRTC.onConnectionStateChanged((state) => {
      setConnectionState(state);

      switch (state) {
        case "connected":
          setCallState("CONNECTED");
          break;
        case "connecting":
          setCallState("CONNECTING");
          break;
        case "disconnected":
          break;
        case "failed":
          webRTC.dispose();
          isInitializedRef.current = false;
          setRemoteStream(null);
          setCallState("ENDED");
          break;
        case "closed":
          break;
      }
    });
    webRTC.onIceConnectionStateChanged((state) => {
      setIceConnectionState(state);
    });
  }, [webRTC, roomId, role]);

  const registerSocketEvents = useCallback(() => {
    socketService.onRoomJoined(handleRoomJoined);
    socketService.onJoinRoomFailed(handleJoinRoomFailed);
    socketService.onUserJoined(handleUserJoined);
    socketService.onUserLeft(handleUserLeft);
    socketService.onInterviewEnded(handleInterviewEnded);
    socketService.onOffer(handleOffer);
    socketService.onAnswer(handleAnswer);
    socketService.onChatMessage(handleChatMessage);
    socketService.onIceCandidate(handleRemoteIceCandidate);
  }, [
    handleRoomJoined,
    handleJoinRoomFailed,
    handleUserJoined,
    handleUserLeft,
    handleInterviewEnded,
    handleOffer,
    handleAnswer,
    handleChatMessage,
    handleRemoteIceCandidate,
  ]);

  const initialize = useCallback(async () => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;
    setError(null);
    setMessages([]);
    setLoading(true);
    setCallState("CONNECTING");

    try {
      await webRTC.initialize();
     const stream = webRTC.getLocalStream();

if (stream) {
  setLocalStream(new MediaStream(stream.getTracks()));
}
      setIsMuted(!webRTC.isMicrophoneEnabled());
      setIsCameraEnabled(webRTC.isCameraEnabled());

      const socket = socketService.connect();

      if (!socket.connected) {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Socket connection timeout"));
          }, 10000);

          socket.once("connect", () => {
            clearTimeout(timeout);

            resolve();
          });

          socket.once("connect_error", (err) => {
            clearTimeout(timeout);

            reject(err);
          });
        });
      }

      if (!callbacksRegisteredRef.current) {
        registerWebRTCCallbacks();
        registerSocketEvents();

        callbacksRegisteredRef.current = true;
      }
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
    } catch (err) {
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

  const stream = webRTC.getLocalStream();

  if (stream) {
    setLocalStream(new MediaStream(stream.getTracks()));
  }
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

  const sendMessage = useCallback(
    (message: string) => {
      const text = message.trim();

      if (!text) {
        return;
      }

      const sentAt = new Date().toISOString();

      socketService.sendChatMessage({
        roomId,
        message: text,
      });

      setMessages((prev) => [
        ...prev,
        {
          roomId,
          senderId: userId,
          senderRole: role,
          message: text,
          sentAt,
        },
      ]);
    },
    [roomId, role, userId],
  );

  const endCall = useCallback(async () => {
    try {
      clearJoinTimeout();

      if (hasJoinedRoomRef.current) {
        socketService.leaveRoom({ roomId });
        hasJoinedRoomRef.current = false;
      }

      socketService.removeAllListeners();
      socketService.disconnect();

      webRTC.dispose();

      isInitializedRef.current = false;
      callbacksRegisteredRef.current = false;
      pendingIceCandidatesRef.current = [];

      setLocalStream(null);
      setRemoteStream(null);
      setMessages([]);
      setIsMuted(false);
      setIsCameraEnabled(true);
      setIsScreenSharing(false);

      setCallState("ENDED");
      setConnectionState("closed");
      setIceConnectionState("closed");

      setLoading(false);
      setError(null);

      onCallEnded?.();
    } catch (err) {
      handleError("Failed to end the interview call.", err);
    } finally {
      clearJoinTimeout();
      pendingIceCandidatesRef.current = [];
    }
  }, [
    webRTC,
    roomId,
    interviewId,
    role,
    onCallEnded,
    clearJoinTimeout,
    handleError,
  ]);

  useEffect(() => {
    return () => {
      clearJoinTimeout();
      pendingIceCandidatesRef.current = [];
      if (isInitializedRef.current) {
        socketService.removeAllListeners();
        setMessages([]);
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
    messages,
    sendMessage,
    initialize,
    toggleMicrophone,
    toggleCamera,
    toggleScreenShare,
    endCall,
  };
}
