import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { personalRecommendApi, randomRecommendApi, visitSaveApi } from "../api";
import { Heart, UserStar, Dices, MapPin } from "lucide-react";

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
      const [res] = await Promise.all([
        mode === "personal"
          ? personalRecommendApi(exclude)
          : randomRecommendApi(),
        new Promise((r) => setTimeout(r, 1000)),
      ]);
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
      <div className="flex items-center px-5 py-4 border-b border-line">
        <button
          onClick={() => navigate("/recommend")}
          className="mr-3 text-xl text-secondary"
        >
          ‹
        </button>
        <h1 className="h2 flex items-center gap-2">
          {mode === "personal" ? (
            <>
              <UserStar size={18} strokeWidth={1.5} className="text-primary" />{" "}
              개인화 추천
            </>
          ) : (
            <>
              <Dices size={18} strokeWidth={1.5} className="text-primary" />{" "}
              랜덤 추천
            </>
          )}
        </h1>
      </div>

      {/* 본문 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-black border-t-transparent animate-spin" />
            <p className="sub1 text-muted">맛집 고르는 중...</p>
          </div>
        ) : place ? (
          <div className="w-full bg-primary-cream border border-primary-light rounded-2xl shadow-lg p-6">
            {/* 식당명 + 좋아요 */}
            <div className="flex items-start  justify-between mb-1">
              <div className="flex-1">
                <p className="caption1 text-faint mb-1">
                  오늘 점심으로 딱이에요
                </p>
                <h2 className="text-heading text-primary font-bold">
                  {place.placeName}
                </h2>
              </div>
              {/* 좋아요 - 방문기록 저장 */}
              <button onClick={handleVisit} className="ml-3">
                <Heart
                  size={22}
                  strokeWidth={1.5}
                  className={`transition-colors ${
                    visited ? "text-error fill-red-500" : "text-faint"
                  }`}
                />
              </button>
            </div>

            {/* 카테고리 전체 표시 */}
            <p className="sub1 text-secondary mb-1">{place.categoryName}</p>

            {/* 거리 */}
            <p className="caption1 text-muted mb-4">{place.distance}m</p>

            <div className="border-t border-line my-4" />

            {/* 주소 */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-start gap-2 flex-1">
                <MapPin
                  size={16}
                  strokeWidth={1.5}
                  className="text-muted mt-0.5 shrink-0"
                />
                <p className="sub1 text-secondary">
                  {place.roadAddressName || place.addressName}
                </p>
              </div>
              <button
                onClick={() =>
                  navigate(`/places/${place.kakaoPlaceId}`, {
                    state: {
                      placeName: place.placeName,
                      categoryName: place.categoryName,
                    },
                  })
                }
                className="caption1 bg-primary-middle text-primary-cream border border-primary-light rounded-lg px-3 py-1.5 shrink-0 "
              >
                메뉴 보기
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* 하단 버튼 3개 */}
      {!loading && place && (
        <div className="flex gap-3 px-5 py-4 pb-24 lg:pb-4 border-t border-line">
          {/* 좋아요 - 방문기록 */}
          <button
            onClick={handleVisit}
            disabled={visited}
            className="flex-1 border border-primary text-primary rounded-xl py-4 btn1 disabled:opacity-40"
          >
            {visited ? "기록됨 " : "방문할게요!"}
          </button>

          {/* 다시 추천 */}
          <button
            onClick={fetchRecommend}
            className="flex-1 bg-primary text-white rounded-xl py-4 btn1"
          >
            다시 추천저장  
            초기화초기화
            
            
          </button>
        </div>
      )}
    </div>
  );
}
