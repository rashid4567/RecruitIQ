import { Server } from "socket.io";
import { SocketEvents } from "../socket.events";
import { JoinRoomHandler } from "./join-room.handler";
import { LeaveRoomHandler } from "./leave-room.handler";
import { OfferHandler } from "./offer.handler";
import { AnswerHandler } from "./answer.handler";
import { IceCandidateHandler } from "./ice-candidate.handler";
import { DisconnectHandler } from "./disconnect.handler";

export class SocketConnectionHandler {

  constructor(
    private readonly io: Server,
    private readonly joinRoomHandler: JoinRoomHandler,
    private readonly leaveRoomHandler: LeaveRoomHandler,
    private readonly offerHandler: OfferHandler,
    private readonly answerHandler: AnswerHandler,
    private readonly iceCandidateHandler: IceCandidateHandler,
    private readonly disconnectHandler: DisconnectHandler,
  ) {}

  register(): void {

    this.io.on(SocketEvents.CONNECTION, (socket) => {
      console.log("================================");
console.log("[SOCKET CONNECTED]");
console.log({
  socketId: socket.id,
});
console.log("================================");
      console.log(`Socket Connected : ${socket.id}`);
      this.joinRoomHandler.register(this.io, socket);
      this.leaveRoomHandler.register(this.io, socket);
      this.offerHandler.register(this.io, socket);
      this.answerHandler.register(this.io, socket);
      this.iceCandidateHandler.register(this.io, socket);
      this.disconnectHandler.register(socket);

    });

  }

}