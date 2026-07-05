import { Server, Socket } from "socket.io";
import { RoomRepository } from "../../../domain/repository/room.repository";
import { SocketEvents } from "../socket.events";
import { IceCandidatePayload } from "../socket.types";

export class IceCandidateHandler {
  constructor(private readonly roomRepository: RoomRepository) {}

  register(io: Server, socket: Socket): void {
    socket.on(
      SocketEvents.ICE_CANDIDATE,
      ({ roomId, candidate }: IceCandidatePayload) => {
        const target = this.roomRepository.getOtherParticipant(
          roomId,
          socket.id,
        );

        console.log("================================");
console.log("[ICE] Candidate Received");
console.log({
    roomId,
    from: socket.id,
});

        if (!target) {
          console.warn(`[ICE] No participant found in room ${roomId}`);
          return;
        }

        io.to(target.socketId).emit(SocketEvents.ICE_CANDIDATE, {
          candidate,
          from: socket.id,
        });

        console.log("================================");
console.log("[ICE] Candidate Received");
console.log({
    roomId,
    from: socket.id,
});

        console.log(`[ICE] ${socket.id} -> ${target.socketId}`);
      },
    );
  }
}
