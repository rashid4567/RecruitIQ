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
    socket.on(
      SocketEvents.JOIN_ROOM,
      async (payload: JoinRoomPayload) => {
        console.log("======================================");
        console.log("[JOIN_ROOM] Request Received");
        console.log({
          socketId: socket.id,
          payload,
        });
        console.log("======================================");

        try {
          console.log("[JOIN_ROOM] Validating interview access...");

          const room =
            await this.validateInterviewRoomAccessUseCase.execute({
              interviewId: payload.interviewId,
              userId: payload.userId,
              role: payload.role,
            });

          console.log("[JOIN_ROOM] Validation successful");
          console.log(room);

          this.roomRepository.create(room.roomId, room.interviewId);

          console.log("[JOIN_ROOM] Room ensured");

          this.roomRepository.join(room.roomId, {
            socketId: socket.id,
            userId: payload.userId,
            role: payload.role,
          });

          console.log("[JOIN_ROOM] Participant added");

          socket.join(room.roomId);

          console.log(
            `[JOIN_ROOM] Socket ${socket.id} joined socket room ${room.roomId}`,
          );

          // Notify the joining participant.
          socket.emit(SocketEvents.ROOM_JOINED, {
            roomId: room.roomId,
            interviewId: room.interviewId,
          });

          console.log("[JOIN_ROOM] ROOM_JOINED emitted");

          // Notify everyone else already in the room.
          socket.to(room.roomId).emit(SocketEvents.USER_JOINED, {
            socketId: socket.id,
            userId: payload.userId,
            role: payload.role,
          });

          console.log("[JOIN_ROOM] USER_JOINED emitted to other participants");

          const currentRoom = this.roomRepository.get(room.roomId);

          console.log(
            `[JOIN_ROOM] Participants: ${
              currentRoom?.participants.size ?? 0
            }`,
          );

          console.log(
            `[JOIN_ROOM] ${payload.role} (${payload.userId}) successfully joined ${room.roomId}`,
          );
        } catch (error) {
          console.error("======================================");
          console.error("[JOIN_ROOM] Failed");
          console.error(error);
          console.error("======================================");

          socket.emit(SocketEvents.JOIN_ROOM_ERROR, {
            message:
              error instanceof Error
                ? error.message
                : "Unable to join interview room.",
          });
        }
      },
    );
  }
}