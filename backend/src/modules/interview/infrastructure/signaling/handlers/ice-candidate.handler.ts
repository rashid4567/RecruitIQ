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

        if (!target) {
          return;
        }

        io.to(target.socketId).emit(SocketEvents.ICE_CANDIDATE, {
          candidate,
          from: socket.id,
        });
      },
    );
  }
}
