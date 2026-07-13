import { Server } from "socket.io";
import { SocketEvents } from "../socket.events";
import { JoinRoomHandler } from "./join-room.handler";
import { LeaveRoomHandler } from "./leave-room.handler";
import { OfferHandler } from "./offer.handler";
import { AnswerHandler } from "./answer.handler";
import { IceCandidateHandler } from "./ice-candidate.handler";
import { DisconnectHandler } from "./disconnect.handler";
import { ChatMessageHandler } from "./chat-message.handler";
import { EndInterviewHandler } from "./end-interview.handler";

export class SocketConnectionHandler {
  constructor(
    private readonly io: Server,
    private readonly joinRoomHandler: JoinRoomHandler,
    private readonly leaveRoomHandler: LeaveRoomHandler,
    private readonly offerHandler: OfferHandler,
    private readonly answerHandler: AnswerHandler,
    private readonly iceCandidateHandler: IceCandidateHandler,
    private readonly chatMessageHandler: ChatMessageHandler,
    private readonly disconnectHandler: DisconnectHandler,
    private readonly endInterviewHandler: EndInterviewHandler,
  ) {}

  register(): void {
    this.io.on(SocketEvents.CONNECTION, (socket) => {
      this.joinRoomHandler.register(this.io, socket);
      this.leaveRoomHandler.register(this.io, socket);
      this.offerHandler.register(this.io, socket);
      this.answerHandler.register(this.io, socket);
      this.iceCandidateHandler.register(this.io, socket);
      this.chatMessageHandler.register(this.io, socket);
      this.disconnectHandler.register(socket);
      this.endInterviewHandler.register(this.io, socket);
    });
  }
}
