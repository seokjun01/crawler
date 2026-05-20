import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  nearbyApi,
  favoriteListApi,
  favoriteSaveApi,
  favoriteDeleteApi,
} from "../api";

const RADIUS_OPTIONS = [
  { label: "300m", value: "300" },
  { label: "500m", value: "500" },
  { label: "1km", value: "1000" },
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

// 카카오 응답 포맷팅 (1200 -> 1.2 )
const formatDistance = (distance) => {
  const meter = parseInt(distance);
  return meter >= 1000 ? `${(meter / 1000).toFixed(1)}km` : `${meter}m`;
};

export function PlaceList({ latitude, longitude }) {
  const [radius, setRadius] = useState("500");
  const [category, setCategory] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // 카카오 API가 page파라미터 지원
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const navigate = useNavigate();

  const observerRef = useRef(null);
  const bottomRef = useRef(null);

  const fetchPlaces = useCallback(
    async (currentPage, reset = false) => {
      if (!latitude || !longitude) return;
      if (loading) return;

      setLoading(true);
      try {
        const response = await nearbyApi(
          latitude,
          longitude,
          radius,
          category,
          currentPage,
        );
        const newPlaces = response.data;

        if (!Array.isArray(newPlaces) || newPlaces.length === 0) {
          setHasMore(false);
          return;
        }

        setPlaces((prev) => (reset ? newPlaces : [...prev, ...newPlaces]));
        if (newPlaces.length < 15) setHasMore(false);
      } catch (e) {
        console.error("식당 목록 조회 실패", e);
      } finally {
        setLoading(false);
      }
    },
    [latitude, longitude, radius, category],
  );

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

  useEffect(() => {
    setPlaces([]);
    setPage(1);
    setHasMore(true);
    fetchPlaces(1, true);
  }, [radius, category]);

  useEffect(() => {
    //무한 스크롤 (bottomRef있으면 다음페이지 로드)
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((prev) => {
          const nextPage = prev + 1;
          fetchPlaces(nextPage, false);
          return nextPage;
        });
      }
    });

    if (bottomRef.current) observerRef.current.observe(bottomRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, fetchPlaces]);

  return (
    <div className="pb-20">
      <div className="px-5 pt-5 pb-3">
        <p className="text-sm font-bold mb-2">거리 필터</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {" "}
          {RADIUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setRadius(option.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border ${
                radius === option.value
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-4">
        <p className="text-sm font-bold mb-2">음식 카테고리</p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setCategory(option.value)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium ${
                category === option.value
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5">
        <div className="flex item-center justify-between mb-3">
          <p className="text-sm font-bold">식당 목록</p>
          <p className="text-xs text-gray-400">스크롤하여 더 보기</p>
        </div>

        <div className="flex flex-col">
          {places.map((place, idx) => (
            <button
              key={`${place.kakaoPlaceId}-${idx}`}
              onClick={() =>
                navigate(`/places/${place.kakaoPlaceId}`, {
                  // 식당 상세 페이지에서 다시 API 안 쳐도 되게 기본 정보 넘겨줌
                  state: {
                    placeName: place.placeName,
                    categoryName: place.categoryName,
                  },
                })
              }
              className="flex items-center justify-between py-4 border-b border-gray-100 text-left active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span
                  onClick={(e) => handleFavoriteToggle(e, place)}
                  className={`text-xl cursor-pointer ${favoriteIds.has(place.kakaoPlaceId) ? "text-red-500" : "text-gray-300"}`}
                >
                  ♥
                </span>
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
        {/* 로딩 스피너 */}
        {loading && (
          // animate-pulse: 깜빡이는 로딩 애니메이션
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 rounded-full border-2 border-black border-t-transparent animate-spin" />
          </div>
        )}

        {/* 더 이상 데이터 없을 때 */}
        {!hasMore && places.length > 0 && (
          <p className="text-center text-xs text-gray-400 py-6">
            주변 식당을 모두 불러왔어요
          </p>
        )}

        {/* 결과 없을 때 */}
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
