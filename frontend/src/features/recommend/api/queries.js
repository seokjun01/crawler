import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  personalRecommendApi,
  randomRecommendApi,
  visitSaveApi,
} from "./index";

export const useRecommend = () => {
  return useMutation({
    mutationFn: async ({ mode, exclude }) => {
      const [res] = await Promise.all([
        mode === "personal"
          ? personalRecommendApi(exclude)
          : randomRecommendApi(),
        new Promise((r) => setTimeout(r, 1000)),
      ]);
      return res.data;
    },
  });
};

export const useSaveVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ kakaoPlaceId, placeName, categoryName }) =>
      visitSaveApi(kakaoPlaceId, placeName, categoryName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    },
  });
};
