import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { visitListApi } from "../api";

export function VisitListMain() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    visitListApi()
      .then((res) => setVisits(res.data.visits?.block1 || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="flex items-center px-5 py-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="mr-3 text-xl">
          ←
        </button>
        <h1 className="font-bold text-base">방문기록</h1>
      </div>
      <div className="px-5 py-4">
        <p className="font-bold text-sm mb-1">방문 기록</p>
        <p className="text-xs text-gray-400 mb-4">최근 방문한 맛집</p>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 rounded-full border-2 border-black border-t-transparent animate-spin" />
          </div>
        ) : visits.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-10">
            방문 기록이 없습니다
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {visits.map((v) => (
              <div
                key={v.visit_history_id}
                className="border border-gray-100 rounded-xl p-4 bg-gray-50"
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold">{v.place_name}</p>
                  <p className="text-sm text-yellow-400">
                    {"★".repeat(parseInt(v.rating))}
                    {"☆".repeat(5 - parseInt(v.rating))}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {v.visited_at?.slice(0, 10)}
                  {v.menu_name ? ` · 메뉴: ${v.menu_name}` : ""}
                  {v.rating ? ` · 별점: ${v.rating}점` : ""}
                </p>
                {v.content && (
                  <p className="text-xs text-gray-600 mt-1">{v.content}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
