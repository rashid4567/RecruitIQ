import { io, Socket } from "socket.io-client";

import { SocketEvents } from "../types/socket.events";

import type {
  JoinRoomPayload,
  LeaveRoomPayload,
  OfferPayload,
  AnswerPayload,
  IceCandidatePayload,
  UserJoinedPayload,
  UserLeftPayload,
  RoomJoinedPayload,
  JoinRoomFailedPayload,
} from "../types/socket.types";

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (this.socket?.connected) {
      console.log("[Socket] Already connected:", this.socket.id);
      return this.socket;
    }

    console.log("====================================");
    console.log("[Socket] Connecting...");
    console.log("URL:", import.meta.env.VITE_SOCKET_URL);
    console.log("====================================");

    this.socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("====================================");
      console.log("[Socket] Connected");
      console.log({
        socketId: this.socket?.id,
      });
      console.log("====================================");
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("====================================");
      console.warn("[Socket] Disconnected");
      console.warn({
        reason,
      });
      console.warn("====================================");
    });

    this.socket.on("connect_error", (error) => {
      console.error("====================================");
      console.error("[Socket] Connection Error");
      console.error(error);
      console.error("====================================");
    });

    return this.socket;
  }

  disconnect(): void {
    console.log("[Socket] Disconnect requested");
    this.socket?.disconnect();
    this.socket = null;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  joinRoom(payload: JoinRoomPayload): void {
    console.log("[Socket] JOIN_ROOM");
    console.log(payload);

    this.socket?.emit(SocketEvents.JOIN_ROOM, payload);
  }

  leaveRoom(payload: LeaveRoomPayload): void {
    console.log("[Socket] LEAVE_ROOM");
    console.log(payload);

    this.socket?.emit(SocketEvents.LEAVE_ROOM, payload);
  }

  sendOffer(payload: OfferPayload): void {
    console.log("[Socket] OFFER");
    console.log(payload);

    this.socket?.emit(SocketEvents.OFFER, payload);
  }

  sendAnswer(payload: AnswerPayload): void {
    console.log("[Socket] ANSWER");
    console.log(payload);

    this.socket?.emit(SocketEvents.ANSWER, payload);
  }

  sendIceCandidate(payload: IceCandidatePayload): void {
    console.log("[Socket] ICE_CANDIDATE");
    console.log(payload);

    this.socket?.emit(SocketEvents.ICE_CANDIDATE, payload);
  }

onRoomJoined(callback: (payload: RoomJoinedPayload) => void): void {
  console.log("======================================");
  console.log("[Socket] Register ROOM_JOINED listener");
  console.log({
    socketExists: !!this.socket,
    socketId: this.socket?.id,
  });
  console.log("======================================");

  this.socket?.on(SocketEvents.ROOM_JOINED, (payload) => {
    console.log("======================================");
    console.log("[Socket] ROOM_JOINED RECEIVED");
    console.log(payload);
    console.log("======================================");

    callback(payload);
  });
}

  onJoinRoomFailed(callback: (payload: JoinRoomFailedPayload) => void): void {
    this.socket?.on(SocketEvents.JOIN_ROOM_ERROR, (payload) => {
      console.error("[Socket] JOIN_ROOM_ERROR");
      console.error(payload);

      callback(payload);
    });
  }

  onUserJoined(callback: (payload: UserJoinedPayload) => void): void {
    this.socket?.on(SocketEvents.USER_JOINED, (payload) => {
      console.log("[Socket] USER_JOINED");
      console.log(payload);

      callback(payload);
    });
  }

  onUserLeft(callback: (payload: UserLeftPayload) => void): void {
    this.socket?.on(SocketEvents.USER_LEFT, (payload) => {
      console.log("[Socket] USER_LEFT");
      console.log(payload);

      callback(payload);
    });
  }

  onOffer(callback: (payload: OfferPayload) => void): void {
    this.socket?.on(SocketEvents.OFFER, (payload) => {
      console.log("[Socket] OFFER RECEIVED");
      console.log(payload);

      callback(payload);
    });
  }

  onAnswer(callback: (payload: AnswerPayload) => void): void {
    this.socket?.on(SocketEvents.ANSWER, (payload) => {
      console.log("[Socket] ANSWER RECEIVED");
      console.log(payload);

      callback(payload);
    });
  }

  onIceCandidate(callback: (payload: IceCandidatePayload) => void): void {
    this.socket?.on(SocketEvents.ICE_CANDIDATE, (payload) => {
      console.log("[Socket] ICE_CANDIDATE RECEIVED");
      console.log(payload);

      callback(payload);
    });
  }

  removeAllListeners(): void {
    console.log("[Socket] Removing all listeners");
    this.socket?.removeAllListeners();
  }
}

export const socketService = new SocketService();