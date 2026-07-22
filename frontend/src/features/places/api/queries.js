import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  favoriteListApi,
  favoriteSaveApi,
  favoriteDeleteApi,
  placeDetailApi,
  reviewGetApi,
  reviewSaveApi,
  reviewUpdateApi,
  reviewDeleteApi,
  nearbyApi,
} from "./index";

// 상태 선언(useState + useEffect) 를 => ReactQuery로 custom hook화 함
export const useFavorites = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await favoriteListApi();
      return res.data.favorites?.block1 || [];
    },
  });
};

export const usePlaceDetail = (kakaoPlaceId, placeName) => {
  return useQuery({
    queryKey: ["placeDetail", kakaoPlaceId],
    queryFn: async () => {
      const res = await placeDetailApi(kakaoPlaceId, placeName);
      const rawMenus = res.data.menus;
      const parsedMenus =
        typeof rawMenus === "string" ? JSON.parse(rawMenus) : rawMenus;
      return Array.isArray(parsedMenus) ? parsedMenus : [];
    },
  });
};

export const useReviews = (kakaoPlaceId) => {
  return useQuery({
    queryKey: ["reviews", kakaoPlaceId],
    queryFn: async () => {
      const res = await reviewGetApi(kakaoPlaceId);
      return res.data.reviews?.block1 || [];
    },
  });
};

// mutation 훅 추가
export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ kakaoPlaceId, placeName, categoryName }) =>
      favoriteSaveApi(kakaoPlaceId, placeName, categoryName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (kakaoPlaceId) => favoriteDeleteApi(kakaoPlaceId),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export const useAddReview = (kakaoPlaceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ placeName, categoryName, menuName, rating, content }) =>
      reviewSaveApi(
        kakaoPlaceId,
        placeName,
        categoryName,
        menuName,
        rating,
        content,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", kakaoPlaceId] });
    },
  });
};

export const useUpdateReview = (kakaoPlaceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ visitHistoryId, menuName, rating, content }) =>
      reviewUpdateApi(kakaoPlaceId, visitHistoryId, menuName, rating, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", kakaoPlaceId] });
    },
  });
};

export const useDeleteReview = (kakaoPlaceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (visitHistoryId) =>
      reviewDeleteApi(kakaoPlaceId, visitHistoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", kakaoPlaceId] });
    },
  });
};

export const usePlaces = (latitude, longitude, radius) => {
  return useInfiniteQuery({
    queryKey: ["places", latitude, longitude, radius],
    queryFn: async ({ pageParam }) => {
      const res = await nearbyApi(latitude, longitude, radius, "", pageParam);
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.isEnd) return undefined;
      if (allPages.length >= 45) return undefined;
      return allPages.length + 1;
    },
    enabled: !!latitude && !!longitude,
  });
};
