import type { MediaConstraints } from "../types/webrtc.types";

export const WEBRTC_CONFIGURATION: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
      ],
    },
  ],
};

export const DEFAULT_MEDIA_CONSTRAINTS: MediaConstraints = {
  audio: true,
  video: {
    width: 1280,
    height: 720,
    frameRate: {
      ideal: 30,
    },
  },
};