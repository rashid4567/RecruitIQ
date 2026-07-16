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

    {
      urls: [
        "turn:13.200.121.126:3478?transport=udp",
        "turn:13.200.121.126:3478?transport=tcp",
      ],
      username: "recruitiq",
      credential: "RecruitIQ@123",
    },
  ],

  iceCandidatePoolSize: 10,
};

export const DEFAULT_MEDIA_CONSTRAINTS: MediaConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    channelCount: 2,
    sampleRate: 48000,
    sampleSize: 16,
  },

  video: {
    width: {
      ideal: 1280,
      max: 1920,
    },

    height: {
      ideal: 720,
      max: 1080,
    },

    frameRate: {
      ideal: 30,
      max: 60,
    },

    facingMode: "user",
  },
};
