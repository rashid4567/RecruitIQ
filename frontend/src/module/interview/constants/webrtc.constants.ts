import type { MediaConstraints } from "../types/webrtc.types";

export const WEBRTC_CONFIGURATION: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
      ],
    },
  ],
};

export const DEFAULT_MEDIA_CONSTRAINTS: MediaConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: {
      ideal: 30,
      max: 30,
    },
    facingMode: "user",
  },
};