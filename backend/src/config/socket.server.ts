import { Server as HttpServer } from "http";
import { Server } from "socket.io";

import { NotificationGateway } from "../modules/notification/infrastructure/socket/notification.gateway";

export const notificationGateway = new NotificationGateway();

export function initializeSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  notificationGateway.initialize(io);

  return io;
}
