export interface MediaConstraints {
  audio: boolean | MediaTrackConstraints;
  video: boolean | MediaTrackConstraints;
}

export interface RTCConfigurationOptions {
  iceServers: RTCIceServer[];
}

export interface MediaStreams {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

export type PeerConnectionState =
  | "new"
  | "connecting"
  | "connected"
  | "disconnected"
  | "failed"
  | "closed";

export type IceConnectionState =
  | "new"
  | "checking"
  | "connected"
  | "completed"
  | "disconnected"
  | "failed"
  | "closed";

export type SignalingState =
  | "stable"
  | "have-local-offer"
  | "have-remote-offer"
  | "have-local-pranswer"
  | "have-remote-pranswer"
  | "closed";

export type CallState = "IDLE" | "CONNECTING" | "CONNECTED" | "ENDED";

export interface DeviceState {
  microphoneEnabled: boolean;
  cameraEnabled: boolean;
}

export interface WebRTCState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnectionState: PeerConnectionState;
  iceConnectionState: IceConnectionState;
  signalingState: SignalingState;
  callState: CallState;
  microphoneEnabled: boolean;
  cameraEnabled: boolean;
}
