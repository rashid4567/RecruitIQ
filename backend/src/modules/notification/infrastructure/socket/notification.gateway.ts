import { Server, Socket } from "socket.io";

export class NotificationGateway {
  private io: Server | null = null;

  initialize(io: Server): void {
    this.io = io;

    io.on("connection", (socket: Socket) => {
      socket.on("notification:join", (userId: string) => {
        socket.join(userId);
      });
    });
  }

  emitNotification(recipientId: string, notification: unknown): void {
    if (!this.io) {
      throw new Error("Socket.IO not initialized");
    }
    this.io.to(recipientId).emit("notification:new", notification);
  }

  emitUnreadCount(recipientId: string, count: number): void {
    if (!this.io) {
      throw new Error("Socket.IO not initialized");
    }
    this.io.to(recipientId).emit("notification:unread-count", count);
  }
}

export const notificationGateway = new NotificationGateway();
