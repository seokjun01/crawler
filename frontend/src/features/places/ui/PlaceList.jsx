import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import {
  useFavorites,
  useAddFavorite,
  useRemoveFavorite,
  usePlaces,
} from "../api/queries";

const RADIUS_OPTIONS = [
  { label: "100m", value: "100" },
  { label: "300m", value: "300" },
  { label: "500m", value: "500" },
  { label: "1km", value: "1000" },
  { label: "2km", value: "2000" },
];

const CATEGORY_OPTIONS = [
  { label: "전체", value: "", emoji: "🍽️" },
  { label: "한식", value: "한식", emoji: "🍚" },
  { label: "중식", value: "중식", emoji: "🥟" },
  { label: "일식", value: "일식", emoji: "🍣" },
  { label: "양식", value: "양식", emoji: "🍝" },
  { label: "분식", value: "분식", emoji: "🍲" },
  { label: "패스트푸드", value: "패스트푸드", emoji: "🍔" },
  { label: "치킨", value: "치킨", emoji: "🍗" },
  { label: "피자", value: "피자", emoji: "🍕" },
];

const formatDistance = (distance) => {
  const meter = parseInt(distance);
  return meter >= 1000 ? `${(meter / 1000).toFixed(1)}km` : `${meter}m`;
};

export function PlaceList({ latitude, longitude }) {
  const [radius, setRadius] = useState("1000");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const observerRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePlaces(latitude, longitude, radius);

  const allPlaces = useMemo(
    () => data?.pages.flatMap((page) => page.places || []) || [],
    [data],
  );

  const places = useMemo(
    () =>
      category
        ? allPlaces.filter((p) => p.categoryName?.includes(category))
        : allPlaces,
    [allPlaces, category],
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0 },
    );

    if (bottomRef.current) observerRef.current.observe(bottomRef.current);
    return () => observerRef.current?.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const { data: favorites = [] } = useFavorites();
  const favoriteIds = useMemo(
    () => new Set(favorites.map((f) => f.kakao_place_id)),
    [favorites],
  );
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const handleFavoriteToggle = (e, place) => {
    e.stopPropagation();
    if (favoriteIds.has(place.kakaoPlaceId)) {
      removeFavorite(place.kakaoPlaceId);
    } else {
      addFavorite({
        kakaoPlaceId: place.kakaoPlaceId,
        placeName: place.placeName,
        categoryName: place.categoryName.split(">").pop().trim(),
      });
    }
  };

  return (
    <div className="pb-20">
      {/* 거리 필터 */}
      <div className="px-5 pt-5 pb-3">
        <p className="body1 mb-2">거리 필터</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {RADIUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setRadius(option.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full body2 border ${
                radius === option.value
                  ? "bg-primary-cream text-primary-light font-semibold"
                  : "bg-white text-secondary border-input"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="px-5 pb-4">
        <p className="body1 mb-2">음식 카테고리</p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setCategory(option.value)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border body2 ${
                category === option.value
                  ? "bg-primary-cream text-primary-light font-semibold"
                  : "bg-white text-secondary border-input"
              }`}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 식당 목록 */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <p className="body1">식당 목록</p>
          <p className="caption1 text-muted">스크롤하여 더 보기</p>
        </div>

        <div className="flex flex-col">
          {places.map((place, idx) => (
            <button
              key={`${place.kakaoPlaceId}-${idx}`}
              onClick={() =>
                navigate(`/places/${place.kakaoPlaceId}`, {
                  state: {
                    placeName: place.placeName,
                    categoryName: place.categoryName,
                  },
                })
              }
              className="flex items-center justify-between py-4 border-b border-line text-left active:bg-hover"
            >
              <div className="flex items-center gap-3">
                <Heart
                  size={20}
                  onClick={(e) => handleFavoriteToggle(e, place)}
                  className={`cursor-pointer transition-colors ${favoriteIds.has(place.kakaoPlaceId) ? "text-error fill-red-500" : "text-faint"}`}
                />
                <div>
                  <p className="font-medium body3">{place.placeName}</p>
                  <p className="caption1 text-muted mt-0.5">
                    {place.categoryName}
                  </p>
                </div>
              </div>
              <p className="sub1 text-secondary flex-shrink-0">
                {formatDistance(place.distance)}
              </p>
            </button>
          ))}
        </div>

        {(isLoading || isFetchingNextPage) && (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 rounded-full border-2 border-black border-t-transparent animate-spin" />
          </div>
        )}
        {!hasNextPage && places.length > 0 && (
          <p className="text-center caption1 text-muted py-6">
            주변 식당을 모두 불러왔어요
          </p>
        )}
        {!isLoading && places.length === 0 && (
          <p className="text-center caption1 text-muted py-10">
            주변에 식당이 없어요
          </p>
        )}
        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
}
