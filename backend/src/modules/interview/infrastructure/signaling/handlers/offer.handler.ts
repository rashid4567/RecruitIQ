import { Server, Socket } from "socket.io";
import { RoomRepository } from "../../../domain/repository/room.repository";
import { SocketEvents } from "../socket.events";
import { OfferPayload } from "../socket.types";

export class OfferHandler {
  constructor(private readonly roomRepository: RoomRepository) {}

  register(io: Server, socket: Socket): void {
    socket.on(SocketEvents.OFFER, ({ roomId, offer }: OfferPayload) => {
      const target = this.roomRepository.getOtherParticipant(roomId, socket.id);

      if (!target) {
      console.warn("================================");
console.warn("[OFFER] No participant found");
console.warn({
  roomId,
  from: socket.id,
});
console.warn("================================");
        return;
      }

      io.to(target.socketId).emit(SocketEvents.OFFER, {
        offer,
        from: socket.id,
      });
      console.log("================================");
console.log("[OFFER] Received");
console.log({
  roomId,
  from: socket.id,
  to: target.socketId,
});
console.log("================================");
    });
  }
}
