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
      return this.socket;
    }

    this.socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    return this.socket;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  joinRoom(payload: JoinRoomPayload): void {
    this.socket?.emit(SocketEvents.JOIN_ROOM, payload);
  }

  leaveRoom(payload: LeaveRoomPayload): void {
    this.socket?.emit(SocketEvents.LEAVE_ROOM, payload);
  }

  sendOffer(payload: OfferPayload): void {
    this.socket?.emit(SocketEvents.OFFER, payload);
  }

  sendAnswer(payload: AnswerPayload): void {
    this.socket?.emit(SocketEvents.ANSWER, payload);
  }

  sendIceCandidate(payload: IceCandidatePayload): void {
    this.socket?.emit(SocketEvents.ICE_CANDIDATE, payload);
  }

  onRoomJoined(callback: (payload: RoomJoinedPayload) => void): void {
    this.socket?.on(SocketEvents.ROOM_JOINED, callback);
  }

  onJoinRoomFailed(callback: (payload: JoinRoomFailedPayload) => void): void {
    this.socket?.on(SocketEvents.JOIN_ROOM_FAILED, callback);
  }

  onUserJoined(callback: (payload: UserJoinedPayload) => void): void {
    this.socket?.on(SocketEvents.USER_JOINED, callback);
  }

  onUserLeft(callback: (payload: UserLeftPayload) => void): void {
    this.socket?.on(SocketEvents.USER_LEFT, callback);
  }

  onOffer(callback: (payload: OfferPayload) => void): void {
    this.socket?.on(SocketEvents.OFFER, callback);
  }

  onAnswer(callback: (payload: AnswerPayload) => void): void {
    this.socket?.on(SocketEvents.ANSWER, callback);
  }

  onIceCandidate(callback: (payload: IceCandidatePayload) => void): void {
    this.socket?.on(SocketEvents.ICE_CANDIDATE, callback);
  }

  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }
}

export const socketService = new SocketService();
