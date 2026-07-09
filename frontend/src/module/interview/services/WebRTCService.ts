import {
  DEFAULT_MEDIA_CONSTRAINTS,
  WEBRTC_CONFIGURATION,
} from "../constants/webrtc.constants";

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private onIceCandidateCallback?: (candidate: RTCIceCandidate) => void;
  private onRemoteStreamCallback?: (stream: MediaStream) => void;
  private onConnectionStateChangedCallback?: (
    state: RTCPeerConnectionState,
  ) => void;
  private onSignalingStateChangedCallback?: (state: RTCSignalingState) => void;
  private onIceConnectionStateChangedCallback?: (
    state: RTCIceConnectionState,
  ) => void;

  getPeerConnection(): RTCPeerConnection {
    if (!this.peerConnection) {
      throw new Error("PeerConnection is not initialized.");
    }

    return this.peerConnection;
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  private async createLocalStream(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(
        DEFAULT_MEDIA_CONSTRAINTS,
      );
    } catch (error) {
      console.error("Unable to access camera/microphone.", error);
      throw error;
    }
  }

  private createPeerConnection(): void {
    this.peerConnection = new RTCPeerConnection(WEBRTC_CONFIGURATION);
    this.remoteStream = new MediaStream();
    if (!this.localStream) {
      throw new Error("Local stream is not initialized.");
    }

    for (const track of this.localStream.getTracks()) {
      this.peerConnection.addTrack(track, this.localStream);
    }
    this.registerPeerConnectionEvents();
  }

  private registerPeerConnectionEvents(): void {
    if (!this.peerConnection) {
      return;
    }

    this.peerConnection.onicecandidate = (event) => {
      if (!event.candidate) {
        return;
      }
      this.onIceCandidateCallback?.(event.candidate);
    };

    this.peerConnection.ontrack = (event) => {
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream();
      }
      event.streams[0].getTracks().forEach((track) => {
        const exists = this.remoteStream!.getTracks().some(
          (t) => t.id === track.id,
        );
        if (!exists) {
          this.remoteStream!.addTrack(track);
        }
      });
      this.onRemoteStreamCallback?.(this.remoteStream);
    };

    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection!.connectionState;
      this.onConnectionStateChangedCallback?.(state);

      switch (state) {
        case "connected":
          break;
        case "connecting":
          break;
        case "disconnected":
          break;
        case "failed":
          break;
        case "closed":
          break;
      }
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      const state = this.peerConnection!.iceConnectionState;
      this.onIceConnectionStateChangedCallback?.(state);
    };

    this.peerConnection.onsignalingstatechange = () => {
      const state = this.peerConnection!.signalingState;
      this.onSignalingStateChangedCallback?.(state);
    };

    this.peerConnection.onicegatheringstatechange = () => {
      console.log("[ICE GATHERING]", this.peerConnection!.iceGatheringState);
    };

    this.peerConnection.onnegotiationneeded = () => {
      console.log("[NEGOTIATION NEEDED]");
    };
  }

  private async replaceTrack(
    kind: "audio" | "video",
    newTrack: MediaStreamTrack,
  ): Promise<void> {
    const peerConnection = this.getPeerConnection();
    const sender = peerConnection
      .getSenders()
      .find((sender) => sender.track?.kind === kind);

    if (!sender) {
      return;
    }
    await sender.replaceTrack(newTrack);
  }
  async startScreenShare(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const screenTrack = stream.getVideoTracks()[0];
      if (!screenTrack) {
        return;
      }
      await this.replaceTrack("video", screenTrack);
      if (this.localStream) {
        const oldTrack = this.getVideoTrack();
        if (oldTrack) {
          this.localStream.removeTrack(oldTrack);
          oldTrack.stop();
        }
        this.localStream.addTrack(screenTrack);
        screenTrack.onended = async () => {
          await this.stopScreenShare();
        };
      }
    } catch (err) {
      console.error("Failed to start screen sharing", err);
    }
  }

  async stopScreenShare(): Promise<void> {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const cameraTrack = cameraStream.getVideoTracks()[0];
      if (!cameraTrack) {
        return;
      }

      await this.replaceTrack("video", cameraTrack);
      if (this.localStream) {
        const oldTrack = this.getVideoTrack();
        if (oldTrack) {
          this.localStream.removeTrack(oldTrack);

          oldTrack.stop();
        }
        this.localStream.addTrack(cameraTrack);
      }
    } catch (error) {
      console.error("Failed to stop screen sharing.", error);
    }
  }

  async initialize(): Promise<void> {
    if (this.peerConnection) {
      return;
    }

    await this.createLocalStream();
    this.createPeerConnection();
  }
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    try {
      const peerConnection = this.getPeerConnection();
      if (peerConnection.signalingState !== "stable") {
        throw new Error(
          `Cannot create offer while signaling state is ${peerConnection.signalingState}`,
        );
      }
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("[OFFER] Failed to create SDP offer.", error);
      throw error;
    }
  }

  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    try {
      const peerConnection = this.getPeerConnection();
      if (peerConnection.signalingState !== "have-remote-offer") {
        console.warn(
          `[ANSWER] Unexpected signaling state: ${peerConnection.signalingState}`,
        );
      }
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      return answer;
    } catch (error) {
      throw error;
    }
  }

  async handleOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    await this.setRemoteDescription(offer);
  }

  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    await this.setRemoteDescription(answer);
  }

  async setRemoteDescription(
    description: RTCSessionDescriptionInit,
  ): Promise<void> {
    const peerConnection = this.getPeerConnection();
    await peerConnection.setRemoteDescription(description);
  }

  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    const peerConnection = this.getPeerConnection();

    await peerConnection.addIceCandidate(candidate);
  }
  onSignalingStateChanged(callback: (state: RTCSignalingState) => void): void {
    this.onSignalingStateChangedCallback = callback;
  }

  onIceConnectionStateChanged(
    callback: (state: RTCIceConnectionState) => void,
  ): void {
    this.onIceConnectionStateChangedCallback = callback;
  }

  onIceCandidate(callback: (candidate: RTCIceCandidate) => void): void {
    this.onIceCandidateCallback = callback;
  }

  onRemoteStream(callback: (stream: MediaStream) => void): void {
    this.onRemoteStreamCallback = callback;
  }

  onConnectionStateChanged(
    callback: (state: RTCPeerConnectionState) => void,
  ): void {
    this.onConnectionStateChangedCallback = callback;
  }

  getConnectionState(): RTCPeerConnectionState {
    return this.getPeerConnection().connectionState;
  }

  getRemoteTracks(): MediaStreamTrack[] {
    return this.remoteStream?.getTracks() ?? [];
  }

  getSignalingState(): RTCSignalingState {
    return this.getPeerConnection().signalingState;
  }

  getLocalTracks(): MediaStreamTrack[] {
    return this.localStream?.getTracks() ?? [];
  }

  getVideoTrack(): MediaStreamTrack | undefined {
    return this.localStream?.getVideoTracks()[0];
  }

  getAudioTrack(): MediaStreamTrack | undefined {
    return this.localStream?.getAudioTracks()[0];
  }

  getRemoteVideoTrack(): MediaStreamTrack | undefined {
    return this.remoteStream?.getVideoTracks()[0];
  }

  getRemoteAudioTrack(): MediaStreamTrack | undefined {
    return this.remoteStream?.getAudioTracks()[0];
  }

  hasLocalStream(): boolean {
    return this.localStream !== null;
  }
  hasRemoteDescription(): boolean {
    return !!this.getPeerConnection().remoteDescription;
  }

  hasRemoteStream(): boolean {
    return this.remoteStream !== null;
  }

  isConnected(): boolean {
    return this.peerConnection?.connectionState === "connected";
  }

  toggleMicrophone(enabled?: boolean): boolean {
    const audioTrack = this.getAudioTrack();
    if (!audioTrack) {
      return false;
    }
    if (enabled !== undefined) {
      audioTrack.enabled = enabled;
    } else {
      audioTrack.enabled = !audioTrack.enabled;
    }
    return audioTrack.enabled;
  }

  toggleCamera(enabled?: boolean): boolean {
    const videoTrack = this.getVideoTrack();
    if (!videoTrack) {
      return false;
    }
    if (enabled !== undefined) {
      videoTrack.enabled = enabled;
    } else {
      videoTrack.enabled = !videoTrack.enabled;
    }
    return videoTrack.enabled;
  }
  isMicrophoneEnabled(): boolean {
    return this.getAudioTrack()?.enabled ?? false;
  }
  isCameraEnabled(): boolean {
    return this.getVideoTrack()?.enabled ?? false;
  }
  isScreenSharing(): boolean {
    const track = this.getVideoTrack();

    if (!track) {
      return false;
    }

    return track.label.toLowerCase().includes("screen");
  }

  stopLocalStream(): void {
    this.localStream?.getTracks().forEach((track) => {
      track.stop();
    });
    this.localStream = null;
  }

  closePeerConnection(): void {
    if (!this.peerConnection) {
      return;
    }

    this.peerConnection.ontrack = null;
    this.peerConnection.onicecandidate = null;
    this.peerConnection.onconnectionstatechange = null;
    this.peerConnection.oniceconnectionstatechange = null;
    this.peerConnection.onsignalingstatechange = null;
    this.peerConnection.onicegatheringstatechange = null;
    this.peerConnection.onnegotiationneeded = null;
    this.peerConnection.close();
    this.peerConnection = null;
  }

  isInitialized(): boolean {
    return this.peerConnection !== null;
  }

  clearRemoteStream(): void {
    this.remoteStream?.getTracks().forEach((track) => {
      track.stop();
    });

    this.remoteStream = null;
  }

  dispose(): void {
    this.stopLocalStream();
    this.clearRemoteStream();
    this.closePeerConnection();
    this.onIceCandidateCallback = undefined;
    this.onRemoteStreamCallback = undefined;
    this.onConnectionStateChangedCallback = undefined;
    this.onIceConnectionStateChangedCallback = undefined;
    this.onSignalingStateChangedCallback = undefined;
  }
  close(): void {
    this.dispose();
  }
}
