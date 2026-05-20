import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/AuthContext";
import { locationGetApi } from "../../location";
import { favoriteListApi } from "../../places/api";
import { visitListApi, logoutApi } from "../api";

const CATEGORY_OPTIONS = [
  { label: "한식", value: "한식", emoji: "🍚" },
  { label: "중식", value: "중식", emoji: "🥟" },
  { label: "일식", value: "일식", emoji: "🍣" },
  { label: "양식", value: "양식", emoji: "🍝" },
  { label: "분식", value: "분식", emoji: "🍲" },
  { label: "패스트푸드", value: "패스트푸드", emoji: "🍔" },
  { label: "치킨", value: "치킨", emoji: "🍗" },
  { label: "피자", value: "피자", emoji: "🍕" },
];

export function MyPageMain() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [locationLabel, setLocationLabel] = useState("불러오는 중 ..");
  const [visits, setVisits] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [locRes, visitRes, favRes] = await Promise.all([
          locationGetApi(),
          visitListApi(),
          favoriteListApi(),
        ]);

        const lat = parseFloat(locRes.data.latitude);
        const lng = parseFloat(locRes.data.longitude);
        if (lat && lng) {
          window.kakao?.maps?.load(() => {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2Address(lng, lat, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const addr =
                  result[0].road_address?.address_name ||
                  result[0].address.address_name;
                setLocationLabel(addr);
              }
            });
          });
        }
        setVisits(visitRes.data.visits?.block1 || []);
        setFavorites(visitRes.data.visits?.block1 || []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {}
    logout();
    navigate("/splash");
  };

  const preferredCategories = user?.preferredCategories
    ? user.preferredCategories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="flex item-center px-5 py-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="mr-3 text-xl">
          ←
        </button>
        <h1 className="font-bold text-base">마이페이지</h1>
      </div>

      <div className="px-5 py-4 flex flex-col gap-6">
        {/* 프로필 */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div className="flex-1">
            <p className="font-bold text-sm">{user?.nickname}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <button className="border border-gray-300 rounded-lg px-3 py-1 text-xs text-gray-600">
            편집&gt;
          </button>
        </div>

        {/*선호 카테고리*/}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-bold text-sm">선호 카테고리</p>
              <p className="text-xs text-gray-400">현재 선택된 카테고리</p>
            </div>
            <button
              onClick={() => navigate("/mypage/categories")}
              className="border border-gray-300 rounded-lg px-3 py-1 text-xs text-gray-600"
            >
              편집&gt;
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferredCategories.length === 0 ? (
              <p className="text-xs text-gray-400">
                선택된 카테고리가 없습니다
              </p>
            ) : (
              preferredCategories.map((cat) => {
                const option = CATEGORY_OPTIONS.find((o) => o.value === cat);
                return (
                  <span
                    key={cat}
                    className="bg-black text-white text-xs px-3 py-1 rounded-full"
                  >
                    {option?.emoji} {cat}
                  </span>
                );
              })
            )}
          </div>
        </div>

        {/*내 위치*/}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="font-bold text-sm">내 위치</p>
            <button
              onClick={() => navigate("/location-edit")}
              className="border border-gray-300 rounded-lg px-3 py-1 text-xs text-gray-600"
            >
              편집 &gt;
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <div>
              <p className="text-sm font-medium">{locationLabel}</p>
              <p className="text-xs text-gray-400">현재 위치</p>
            </div>
          </div>
        </div>
        {/* 방문 기록 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-bold text-sm">방문 기록</p>
              <p className="text-xs text-gray-400">최근 방문한 맛집</p>
            </div>
            <button
              onClick={() => navigate("/mypage/visits")}
              className="border border-gray-300 rounded-lg px-3 py-1 text-xs text-gray-600"
            >
              전체보기 &gt;
            </button>
          </div>
          {loading ? (
            <p className="text-xs text-gray-400">불러오는 중...</p>
          ) : visits.length === 0 ? (
            <p className="text-xs text-gray-400">방문 기록이 없습니다</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {visits.slice(0, 2).map((v) => (
                <div
                  key={v.visit_history_id}
                  className="min-w-40 border border-gray-100 rounded-xl p-3 bg-gray-50"
                >
                  <p className="text-xs font-bold mb-1">{v.place_name}</p>
                  <p className="text-xs text-yellow-400">
                    {"★".repeat(parseInt(v.rating))}
                    {"☆".repeat(5 - parseInt(v.rating))}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {v.visited_at?.slice(0, 10)} · {v.menu_name || "-"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 즐겨찾기 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-bold text-sm">즐겨찾기</p>
              <p className="text-xs text-gray-400">저장한 곳</p>
            </div>
            <button
              onClick={() => navigate("/mypage/favorites")}
              className="border border-gray-300 rounded-lg px-3 py-1 text-xs text-gray-600"
            >
              전체보기 &gt;
            </button>
          </div>
          {loading ? (
            <p className="text-xs text-gray-400">불러오는 중...</p>
          ) : favorites.length === 0 ? (
            <p className="text-xs text-gray-400">즐겨찾기가 없습니다</p>
          ) : (
            <div className="flex flex-col">
              {favorites.slice(0, 3).map((f) => (
                <div
                  key={f.favorite_id}
                  className="flex items-center justify-between py-3 border-b border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">⭐</span>
                    <div>
                      <p className="text-sm font-medium">{f.place_name}</p>
                      <p className="text-xs text-gray-400">{f.category_name}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    {f.created_at?.slice(0, 10)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="w-full bg-black text-white rounded-xl py-4 text-base font-semibold mt-4"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
