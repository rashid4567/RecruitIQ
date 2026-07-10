import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { notificationGateway } from "../modules/notification/infrastructure/socket/notification.gateway";
import { createSocketConnectionHandler } from "../modules/interview/infrastructure/signaling/container";
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
