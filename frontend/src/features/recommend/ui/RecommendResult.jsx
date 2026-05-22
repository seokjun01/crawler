import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { personalRecommendApi, randomRecommendApi, visitSaveApi } from "../api";

export function RecommendResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const mode = state?.mode || "random";
  const exclude = state?.exclude || "";

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visited, setVisited] = useState(false);

  const fetchRecommend = useCallback(async () => {
    setLoading(true);
    setVisited(false); // 다시 추천 시 초기화
    try {
      const res =
        mode === "personal"
          ? await personalRecommendApi(exclude)
          : await randomRecommendApi();
      setPlace(res.data);
    } catch {
      alert("추천을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [mode, exclude]);

  useEffect(() => {
    fetchRecommend();
  }, [fetchRecommend]);

  // 좋아요 → 방문기록 저장
  const handleVisit = async () => {
    if (!place || visited) return;
    try {
      await visitSaveApi(
        place.kakaoPlaceId,
        place.placeName,
        place.categoryName,
      );
      setVisited(true);
    } catch {
      alert("방문기록 저장에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center px-5 py-4 border-b border-gray-100">
        <button
          onClick={() => navigate("/recommend")}
          className="mr-3 text-xl text-gray-500"
        >
          ‹
        </button>
        <h1 className="text-base font-bold">
          {mode === "personal" ? "✨ 개인화 추천" : "🎲 랜덤 추천"}
        </h1>
      </div>

      {/* 본문 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-black border-t-transparent animate-spin" />
            <p className="text-sm text-gray-400">맛집 고르는 중...</p>
          </div>
        ) : place ? (
          <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
            {/* 식당명 + 좋아요 */}
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">
                  오늘 점심으로 딱이에요
                </p>
                <h2 className="text-xl font-bold">{place.placeName}</h2>
              </div>
              {/* 좋아요 - 방문기록 저장 */}
              <button
                onClick={handleVisit}
                className={`text-2xl ml-3 transition-colors ${
                  visited ? "text-red-500" : "text-gray-300"
                }`}
              >
                ♥
              </button>
            </div>

            {/* 카테고리 전체 표시 */}
            <p className="text-sm text-gray-500 mb-1">{place.categoryName}</p>

            {/* 거리 */}
            <p className="text-xs text-gray-400 mb-4">{place.distance}m</p>

            <div className="border-t border-gray-100 my-4" />

            {/* 주소 */}
            <div className="flex items-start gap-2">
              <span className="text-gray-400 text-sm mt-0.5">📍</span>
              <p className="text-sm text-gray-600">
                {place.roadAddressName || place.addressName}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* 하단 버튼 3개 */}
      {!loading && place && (
        <div className="flex gap-3 px-5 py-4 border-t border-gray-100">
          {/* 좋아요 - 방문기록 */}
          <button
            onClick={handleVisit}
            disabled={visited}
            className="flex-1 border border-black text-black rounded-xl py-4 text-sm font-semibold disabled:opacity-40"
          >
            {visited ? "기록됨 " : "방문할게요!"}
          </button>
          {/* 메뉴 보기 - 상세 페이지 이동 */}
          <button
            onClick={() =>
              navigate(`/places/${place.kakaoPlaceId}`, {
                state: {
                  placeName: place.placeName,
                  categoryName: place.categoryName,
                },
              })
            }
            className="flex-1 border border-black text-black rounded-xl py-4 text-sm font-semibold"
          >
            메뉴 보기
          </button>
          {/* 다시 추천 */}
          <button
            onClick={fetchRecommend}
            className="flex-1 bg-black text-white rounded-xl py-4 text-sm font-semibold"
          >
            다시 추천
          </button>
        </div>
      )}
    </div>
  );
}
