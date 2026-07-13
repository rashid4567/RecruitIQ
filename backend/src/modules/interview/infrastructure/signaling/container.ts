import { Server } from "socket.io";
import { InMemoryRoomRepository } from "../repository/InMemoryRoomRepository";
import { JoinRoomHandler } from "./handlers/join-room.handler";
import { LeaveRoomHandler } from "./handlers/leave-room.handler";
import { OfferHandler } from "./handlers/offer.handler";
import { AnswerHandler } from "./handlers/answer.handler";
import { IceCandidateHandler } from "./handlers/ice-candidate.handler";
import { DisconnectHandler } from "./handlers/disconnect.handler";
import { SocketConnectionHandler } from "./handlers/connection.handler";
import { validateInterviewUC } from "../../presentation/di/interview.module";
import { ChatMessageHandler } from "./handlers/chat-message.handler";
import { EndInterviewHandler } from "./handlers/end-interview.handler";

export const roomRepository = new InMemoryRoomRepository();

export function createSocketConnectionHandler(
  io: Server,
): SocketConnectionHandler {
  const joinRoomHandler = new JoinRoomHandler(
    roomRepository,
    validateInterviewUC,
  );
  const leaveRoomHandler = new LeaveRoomHandler(roomRepository);
  const offerHandler = new OfferHandler(roomRepository);
  const answerHandler = new AnswerHandler(roomRepository);
  const iceCandidateHandler = new IceCandidateHandler(roomRepository);
  const chatMessageHandler = new ChatMessageHandler(roomRepository);
  const disconnectHandler = new DisconnectHandler(roomRepository);
  const endInterviewHandler = new EndInterviewHandler(roomRepository);
  return new SocketConnectionHandler(
    io,
    joinRoomHandler,
    leaveRoomHandler,
    offerHandler,
    answerHandler,
    iceCandidateHandler,
    chatMessageHandler,
    disconnectHandler,
    endInterviewHandler
  );
}

