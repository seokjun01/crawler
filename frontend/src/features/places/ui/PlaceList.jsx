import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  nearbyApi,
  favoriteListApi,
  favoriteSaveApi,
  favoriteDeleteApi,
} from "../api";
import { Heart } from "lucide-react";

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
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const navigate = useNavigate();
  const observerRef = useRef(null);
  const bottomRef = useRef(null);
  const loadingRef = useRef(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);

  // category를 ref로도 들고 있어야 fetchPlaces 클로저에서 최신값 읽힘
  const categoryRef = useRef(category);
  useEffect(() => {
    categoryRef.current = category;
  }, [category]);

  const fetchPlaces = useCallback(
    async (currentPage, reset = false) => {
      if (!latitude || !longitude) return;
      if (loadingRef.current) return;
      if (!hasMoreRef.current && !reset) return;
      if (currentPage >= 45) {
        hasMoreRef.current = false;
        setHasMore(false);
        return;
      }

      loadingRef.current = true;
      setLoading(true);
      try {
        const response = await nearbyApi(
          latitude,
          longitude,
          radius,
          // 카테고리 필터는 백엔드에 보내지 않음 - 프론트에서 처리
          "",
          currentPage,
        );
        const { places: newPlaces, isEnd } = response.data;

        // 카테고리 클라이언트 필터링
        // categoryRef.current: 최신 카테고리 값 (클로저 stale 방지)
        const filtered = categoryRef.current
          ? (newPlaces || []).filter((p) =>
              p.categoryName?.includes(categoryRef.current),
            )
          : newPlaces || [];

        // isEnd가 true면 더 이상 페이지 없음
        if (isEnd) {
          hasMoreRef.current = false;
          setHasMore(false);
        }
        if (!newPlaces || newPlaces.length === 0) {
          hasMoreRef.current = false;
          setHasMore(false);
          return;
        }

        // reset=true면 새 목록, false면 기존에 append
        setPlaces((prev) => (reset ? filtered : [...prev, ...filtered]));
      } catch (e) {
        console.error("식당 목록 조회 실패", e);
      } finally {
        loadingRef.current = false;
        setLoading(false);
        if (observerRef.current && bottomRef.current) {
          observerRef.current.unobserve(bottomRef.current);
          observerRef.current.observe(bottomRef.current);
        }
      }
    },
    [latitude, longitude, radius],
  );

  // 즐겨찾기 초기 로드
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await favoriteListApi();
        const ids = (res.data.favorites?.block1 || []).map(
          (f) => f.kakao_place_id,
        );
        setFavoriteIds(new Set(ids));
      } catch (e) {}
    };
    fetchFavorites();
  }, []);

  // radius/category/위치 바뀌면 초기화 후 1페이지
  useEffect(() => {
    pageRef.current = 1;
    hasMoreRef.current = true;
    setPlaces([]);
    setHasMore(true);
    fetchPlaces(1, true);
  }, [radius, category, latitude, longitude, fetchPlaces]);

  // 무한스크롤 observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !loadingRef.current
        ) {
          const nextPage = pageRef.current + 1;
          pageRef.current = nextPage;
          fetchPlaces(nextPage, false);
        }
      },
      { threshold: 0 },
    );

    if (bottomRef.current) observerRef.current.observe(bottomRef.current);
    return () => observerRef.current?.disconnect();
  }, [fetchPlaces]);

  const handleFavoriteToggle = async (e, place) => {
    e.stopPropagation();
    try {
      if (favoriteIds.has(place.kakaoPlaceId)) {
        await favoriteDeleteApi(place.kakaoPlaceId);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(place.kakaoPlaceId);
          return next;
        });
      } else {
        await favoriteSaveApi(
          place.kakaoPlaceId,
          place.placeName,
          place.categoryName.split(">").pop().trim(),
        );
        setFavoriteIds((prev) => new Set([...prev, place.kakaoPlaceId]));
      }
    } catch (e) {}
  };

  return (
    <div className="pb-20">
      {/* 거리 필터 */}
      <div className="px-5 pt-5 pb-3">
        <p className="text-sm font-bold mb-2">거리 필터</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {RADIUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setRadius(option.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border ${
                radius === option.value
                  ? "bg-primary-cream text-primary-light font-semibold"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="px-5 pb-4">
        <p className="text-sm font-bold mb-2">음식 카테고리</p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setCategory(option.value)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium ${
                category === option.value
                  ? "bg-primary-cream text-primary-light font-semibold"
                  : "bg-white text-gray-500 border-gray-200"
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
          <p className="text-sm font-bold">식당 목록</p>
          <p className="text-xs text-gray-400">스크롤하여 더 보기</p>
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
              className="flex items-center justify-between py-4 border-b border-gray-100 text-left active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Heart
                  size={20}
                  onClick={(e) => handleFavoriteToggle(e, place)}
                  className={`cursor-pointer transition-colors ${favoriteIds.has(place.kakaoPlaceId) ? "text-red-500 fill-red-500" : "text-gray-300"}`}
                />
                <div>
                  <p className="font-medium text-sm">{place.placeName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {place.categoryName}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 flex-shrink-0">
                {formatDistance(place.distance)}
              </p>
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 rounded-full border-2 border-black border-t-transparent animate-spin" />
          </div>
        )}
        {!hasMore && places.length > 0 && (
          <p className="text-center text-xs text-gray-400 py-6">
            주변 식당을 모두 불러왔어요
          </p>
        )}
        {!loading && places.length === 0 && (
          <p className="text-center text-xs text-gray-400 py-10">
            주변에 식당이 없어요
          </p>
        )}
        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
}
