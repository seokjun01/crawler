import { api } from "../../../shared/api";

export const getRoomsApi = () => {
  return api("GET", "/api/chat/rooms");
};

export const createRoomApi = (title, maxMembers) => {
  return api("POST", "/api/chat/rooms", { title, max_members: maxMembers });
};

export const getRoomInfoApi = (roomId) => {
  return api("GET", `/api/chat/rooms/${roomId}`);
};

export const joinRoomApi = (roomId) => {
  return api("POST", `/api/chat/rooms/${roomId}/join`);
};

export const leaveRoomApi = (roomId) => {
  return api("POST", `/api/chat/rooms/${roomId}/leave`);
};

export const deleteRoomApi = (roomId) => {
  return api("POST", `/api/chat/rooms/${roomId}`);
};

export const getMessagesApi = (roomId) => {
  return api("GET", `/api/chat/rooms/${roomId}/messages`);
};
