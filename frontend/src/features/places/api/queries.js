import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteListApi, favoriteSaveApi, favoriteDeleteApi } from "./index";

export const useFavorites = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await favoriteListApi();
      return res.data.favorites?.block1 || [];
    },
  });
};

// 상태 선언(useState + useEffect) 를 => ReactQuery로 custom hook화 함
