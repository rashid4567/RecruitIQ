import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { NotificationGateway } from "../modules/notification/infrastructure/socket/notification.gateway";
import { createSocketConnectionHandler } from "../modules/interview/infrastructure/signaling/container";
export const notificationGateway = new NotificationGateway();
export let io: Server;
export function initializeSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });
  notificationGateway.initialize(io);
  const interviewSocketHandler = createSocketConnectionHandler(io);

  interviewSocketHandler.register();

  return io;
}
