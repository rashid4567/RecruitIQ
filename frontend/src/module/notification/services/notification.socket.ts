import { io, Socket } from "socket.io-client";
import type { Notification } from "../types/notification.types";

class NotificationSocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    return this.socket;
  }

  join(userId: string): void {
    if (!this.socket) return;

    this.socket.emit("notification:join", userId);
  }

  onNotification(callback: (notification: Notification) => void): void {
    if (!this.socket) return;

    this.socket.off("notification:new");

    this.socket.on("notification:new", (notification: Notification) => {
      callback(notification);
    });
  }

  onUnreadCount(callback: (count: number) => void): void {
    if (!this.socket) return;

    this.socket.off("notification:unread-count");

    this.socket.on("notification:unread-count", (count: number) => {
      callback(count);
    });
  }

  offNotification(): void {
    this.socket?.off("notification:new");
  }

  offUnreadCount(): void {
    this.socket?.off("notification:unread-count");
  }

  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const notificationSocket = new NotificationSocketService();