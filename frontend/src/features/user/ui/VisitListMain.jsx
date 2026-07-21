import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { visitDetailApi } from "../api";
import { useVisits } from "../api/queries";

export function VisitListMain() {
  const navigate = useNavigate();
  const { data: visits = [], isLoading: loading } = useVisits();
  const [reviewMap, setReviewMap] = useState({});

  const handleToggleReviews = async (kakaoPlaceId) => {
    // 이미 열려있으면 닫기
    if (reviewMap[kakaoPlaceId]) {
      setReviewMap((prev) => {
        const next = { ...prev };
        delete next[kakaoPlaceId];
        return next;
      });
      return;
    }

    // 로딩 상태로 먼저 열기
    setReviewMap((prev) => ({
      ...prev,
      [kakaoPlaceId]: { loading: true, reviews: [] },
    }));

    try {
      const res = await visitDetailApi(kakaoPlaceId);
      const reviews = res.data.visits?.block1 || [];
      setReviewMap((prev) => ({
        ...prev,
        [kakaoPlaceId]: { loading: false, reviews },
      }));
    } catch {
      setReviewMap((prev) => {
        const next = { ...prev };
        delete next[kakaoPlaceId];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-4">
      {/* 헤더 */}
      <div className="flex items-center px-5 py-4 border-b border-line">
        <button onClick={() => navigate(-1)} className="mr-3 text-xl">
          ←
        </button>
        <h1 className="h2">방문기록</h1>
      </div>

      <div className="px-5 py-4">
        <p className="font-bold body3 mb-1">방문 기록</p>
        <p className="caption1 text-muted mb-4">최근 방문한 맛집</p>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 rounded-full border-2 border-black border-t-transparent animate-spin" />
          </div>
        ) : visits.length === 0 ? (
          <p className="text-center caption1 text-muted py-10">
            방문 기록이 없습니다
          </p>
        ) : (
          <div className="flex flex-col">
            {visits.map((v) => {
              const isOpen = !!reviewMap[v.kakao_place_id];
              const reviewState = reviewMap[v.kakao_place_id];

              return (
                <div key={v.kakao_place_id} className="border-b border-line">
                  {/* 식당 요약 행 */}
                  <div className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="body1">{v.place_name}</p>
                        {/* visit_count, last_visited는 visit-list-group.xml 응답 */}
                        <p className="caption1 text-muted mt-0.5">
                          {v.visit_count}회 방문 · 마지막{" "}
                          {v.last_visited?.slice(0, 10)}
                        </p>
                      </div>

                      {/* 후기 토글 버튼 */}
                      <button
                        onClick={() => handleToggleReviews(v.kakao_place_id)}
                        className="caption1 text-secondary border border-input rounded-lg px-3 py-1 flex-shrink-0"
                      >
                        {isOpen ? "후기 닫기 ▲" : "작성한 후기 보기 ▼"}
                      </button>
                    </div>
                  </div>

                  {/* 후기 목록 - 토글 */}
                  {isOpen && (
                    <div className="pb-4 pl-2">
                      {reviewState.loading ? (
                        <div className="flex justify-center py-4">
                          <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                        </div>
                      ) : reviewState.reviews.length === 0 ? (
                        <p className="caption1 text-muted py-2">
                          작성한 후기가 없습니다
                        </p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {reviewState.reviews.map((r) => (
                            <div
                              key={r.visit_history_id}
                              className="bg-hover rounded-xl p-3"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <p className="caption1 text-muted">
                                  {r.visited_at?.slice(0, 10)}
                                  {r.menu_name ? ` · ${r.menu_name}` : ""}
                                </p>
                                <p className="caption1 text-rating">
                                  {"★".repeat(parseInt(r.rating))}
                                  {"☆".repeat(5 - parseInt(r.rating))}
                                </p>
                              </div>
                              {r.content && (
                                <p className="caption1 text-secondary">
                                  {r.content}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
