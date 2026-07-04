import { Server, Socket } from "socket.io";
import { RoomRepository } from "../../../domain/repository/room.repository";
import { SocketEvents } from "../socket.events";
import { JoinRoomPayload } from "../socket.types";
import { ValidateInterviewRoomAccessUseCase } from "../../../application/usecase/common/ValidateInterviewRoomAccessUseCase";

export class JoinRoomHandler {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly validateInterviewRoomAccessUseCase: ValidateInterviewRoomAccessUseCase,
  ) {}

  register(io: Server, socket: Socket): void {
    socket.on(SocketEvents.JOIN_ROOM, async (payload: JoinRoomPayload) => {
      try {
        const room = await this.validateInterviewRoomAccessUseCase.execute({
          interviewId: payload.interviewId,
          userId: payload.userId,
          role: payload.role,
        });

        this.roomRepository.create(room.roomId, room.interviewId);
        this.roomRepository.join(room.roomId, {
          userId: payload.userId,
          socketId: socket.id,
          role: payload.role,
        });

        socket.join(room.roomId);
        socket.to(room.roomId).emit(SocketEvents.USER_JOINED, {
          userId: payload.userId,
          role: payload.role,
        });

        console.info(`[JOIN_ROOM] ${payload.userId} joined ${room.roomId}`);
      } catch (error) {
        socket.emit(SocketEvents.JOIN_ROOM_ERROR, {
          message:
            error instanceof Error ? error.message : "Unable to join room.",
        });
      }
    });
  }
}
