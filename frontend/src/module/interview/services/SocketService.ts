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
  ChatMessagePayload,
  ChatMessageReceivedPayload,
} from "../types/socket.types";

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }
    this.socket = io(import.meta.env.VITE_SOCKET_URL, {
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

  sendChatMessage(payload: ChatMessagePayload): void {
    this.socket?.emit(SocketEvents.CHAT_MESSAGE, payload);
  }

  onRoomJoined(callback: (payload: RoomJoinedPayload) => void): void {
    this.socket?.on(SocketEvents.ROOM_JOINED, (payload) => {
      callback(payload);
    });
  }

  onJoinRoomFailed(callback: (payload: JoinRoomFailedPayload) => void): void {
    this.socket?.on(SocketEvents.JOIN_ROOM_ERROR, (payload) => {
      callback(payload);
    });
  }

  onUserJoined(callback: (payload: UserJoinedPayload) => void): void {
    this.socket?.off(SocketEvents.USER_JOINED);

    this.socket?.on(SocketEvents.USER_JOINED, (payload) => {
      callback(payload);
    });
  }

  onUserLeft(callback: (payload: UserLeftPayload) => void): void {
    this.socket?.on(SocketEvents.USER_LEFT, (payload) => {
      callback(payload);
    });
  }

  onOffer(callback: (payload: OfferPayload) => void): void {
    this.socket?.on(SocketEvents.OFFER, (payload) => {
      callback(payload);
    });
  }

  onAnswer(callback: (payload: AnswerPayload) => void): void {
    this.socket?.on(SocketEvents.ANSWER, (payload) => {
      callback(payload);
    });
  }

  onIceCandidate(callback: (payload: IceCandidatePayload) => void): void {
    this.socket?.on(SocketEvents.ICE_CANDIDATE, (payload) => {
      callback(payload);
    });
  }

  onChatMessage(callback: (payload: ChatMessageReceivedPayload) => void): void {
    this.socket?.off(SocketEvents.CHAT_MESSAGE);

    this.socket?.on(SocketEvents.CHAT_MESSAGE, (payload) => {
      callback(payload);
    });
  }

  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }
}

export const socketService = new SocketService();