import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoomsApi,
  joinRoomApi,
  deleteRoomApi,
  createRoomApi,
} from "./index";

export const useRooms = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await getRoomsApi();
      return res.data?.rooms?.block1 || [];
    },
  });
};

export const useJoinRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId) => joinRoomApi(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId) => deleteRoomApi(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, maxMembers }) => createRoomApi(title, maxMembers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};
