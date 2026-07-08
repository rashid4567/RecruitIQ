import {
  Room,
  RoomParticipant,
  RoomRepository,
} from "../../domain/repository/room.repository";

export class InMemoryRoomRepository implements RoomRepository {
  private readonly rooms = new Map<string, Room>();

  create(roomId: string, interviewId: string): Room {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        roomId,
        interviewId,
        participants: new Map(),
      });
    }
    return this.rooms.get(roomId)!;
  }

  get(roomId: string) {
    return this.rooms.get(roomId);
  }

  delete(roomId: string): void {
    this.rooms.delete(roomId);
  }

  join(roomId: string, participant: RoomParticipant): void {
    const room = this.rooms.get(roomId);

    if (!room) {
      throw new Error("Room not found");
    }
    room.participants.set(participant.socketId, participant);
  }

  leave(roomId: string, socketId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    room.participants.delete(socketId);
    if (room.participants.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  getParticipant(
    roomId: string,
    socketId: string,
  ): RoomParticipant | undefined {
    return this.rooms.get(roomId)?.participants.get(socketId);
  }

  getOtherParticipant(
    roomId: string,
    socketId: string,
  ): RoomParticipant | undefined {
    const room = this.rooms.get(roomId);
    if (!room) {
      return undefined;
    }

    for (const participant of room.participants.values()) {
      if (participant.socketId !== socketId) {
        return participant;
      }
    }
    return undefined;
  }

  findRoomBySocketId(socketId: string): Room | undefined {
    for (const room of this.rooms.values()) {
      if (room.participants.has(socketId)) {
        return room;
      }
    }
    return undefined;
  }
}
