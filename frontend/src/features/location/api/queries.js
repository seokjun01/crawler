import { useQuery } from "@tanstack/react-query";
import { locationGetApi } from "./index";

export const useUserLocation = () => {
  return useQuery({
    queryKey: ["location"],
    queryFn: async () => {
      const res = await locationGetApi();
      return res.data;
    },
  });
};
