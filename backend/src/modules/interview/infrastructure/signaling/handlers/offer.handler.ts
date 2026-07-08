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
        return;
      }

      io.to(target.socketId).emit(SocketEvents.OFFER, {
        offer,
        from: socket.id,
      });
    });
  }
}
