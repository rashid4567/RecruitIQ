export const SocketEvents = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  JOIN_ROOM: "join-room",
  ROOM_JOINED: "room-joined",
  JOIN_ROOM_ERROR: "join-room-error",
  USER_JOINED: "user-joined",
  USER_LEFT: "user-left",
  OFFER: "offer",
  ANSWER: "answer",
  ICE_CANDIDATE: "ice-candidate",
  LEAVE_ROOM : "leave-room",
} as const;