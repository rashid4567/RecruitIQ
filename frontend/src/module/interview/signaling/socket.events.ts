export const SocketEvents = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  JOIN_ROOM: "join-room",
  LEAVE_ROOM: "leave-room",
  ROOM_JOINED: "room-joined",
  JOIN_ROOM_FAILED: "join-room-failed",
  USER_JOINED: "user-joined",
  USER_LEFT: "user-left",
  OFFER: "offer",
  ANSWER: "answer",
  ICE_CANDIDATE: "ice-candidate",
} as const;
