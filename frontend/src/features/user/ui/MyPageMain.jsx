import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/AuthContext";
import { locationGetApi } from "../../location";
import { favoriteListApi } from "../../places/api";
import {
  visitListApi,
  logoutApi,
  updateNicknameApi,
  updateCategoriesApi,
} from "../api";
import { Heart } from "lucide-react";

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
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [locationLabel, setLocationLabel] = useState("불러오는 중...");
  const [visits, setVisits] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // 닉네임 편집
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(user?.nickname || "");

  // 카테고리 편집
  const [editingCategories, setEditingCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(
    user?.preferredCategories
      ? user.preferredCategories
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [],
  );

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [locRes, visitRes, favRes] = await Promise.all([
          locationGetApi(),
          visitListApi(),
          favoriteListApi(),
        ]);

        setLocationLabel(locRes.data.title || "내 위치");
        setVisits(visitRes.data.visits?.block1 || []);
        setFavorites(favRes.data.favorites?.block1 || []);
      } catch (e) {
        console.error("fetchAll 에러:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleNicknameSave = async () => {
    if (!nicknameInput.trim()) return;
    try {
      await updateNicknameApi(nicknameInput.trim());
      login({ ...user, nickname: nicknameInput.trim() });
      setEditingNickname(false);
    } catch (e) {}
  };

  const handleCategoryToggle = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((c) => c !== value)
        : prev.length < 5
          ? [...prev, value]
          : prev,
    );
  };

  const handleCategorySave = async () => {
    try {
      await updateCategoriesApi(selectedCategories.join(","));
      login({ ...user, preferredCategories: selectedCategories.join(",") });
      setEditingCategories(false);
    } catch (e) {}
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {}
    // 브라우저 JSESSIONID 쿠키 직접 삭제
    document.cookie =
      "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
    <div className="min-h-screen bg-white pb-20 lg:pb-4">
      <div className="flex items-center px-5 py-4 border-b border-line">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-xl text-primary-middle"
        >
          ←
        </button>
        <h1 className="font-bold text-primary text-heading">마이페이지</h1>
      </div>

      <div className="px-5 py-4 flex flex-col gap-6">
        {/* 프로필 - 닉네임 인라인 편집 */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex-1">
            {editingNickname ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  maxLength={10}
                  autoFocus
                  className="border-b border-gray-400 body3 outline-none py-0.5 w-32"
                  placeholder="변경할 닉네임을 입력하세요"
                />
                <button
                  onClick={handleNicknameSave}
                  className="caption1 text-primary font-semibold border border-primary rounded px-2 py-1"
                >
                  확인
                </button>
                <button
                  onClick={() => {
                    setEditingNickname(false);
                    setNicknameInput(user?.nickname || "");
                  }}
                  className="caption1 bg-primary text-white border border-none rounded px-2 py-1"
                >
                  취소
                </button>
              </div>
            ) : (
              <p className="font-bold body3">{user?.nickname}</p>
            )}
            <p className="caption1 text-muted">{user?.email}</p>
          </div>
          {!editingNickname && (
            <button
              onClick={() => {
                setNicknameInput(user?.nickname || "");
                setEditingNickname(true);
              }}
              className="border border-primary-light rounded-lg px-3 py-1 caption1 text-primary"
            >
              편집 &gt;
            </button>
          )}
        </div>

        {/* 선호 카테고리 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-bold  body3">선호 카테고리</p>
            </div>
            {!editingCategories && (
              <button
                onClick={() => setEditingCategories(true)}
                className="border border-primary-light rounded-lg px-3 py-1 caption1 text-primary"
              >
                편집 &gt;
              </button>
            )}
          </div>

          {editingCategories ? (
            <>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {CATEGORY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleCategoryToggle(option.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border body2 ${
                      selectedCategories.includes(option.value)
                        ? "bg-primary-middle text-primary-cream border-primary-light"
                        : "bg-white text-muted border-primary-light"
                    }`}
                  >
                    <span>{option.emoji}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
              <p className="caption1 text-muted mb-2">
                최대 5개 선택 ({selectedCategories.length}/5)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleCategorySave}
                  className="flex-1 bg-primary text-white rounded-xl py-2 btn1"
                >
                  확인
                </button>
                <button
                  onClick={() => {
                    setEditingCategories(false);
                    setSelectedCategories(preferredCategories);
                  }}
                  className="flex-1 border border-primary text-primary rounded-xl py-2 body3"
                >
                  취소
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              {preferredCategories.length === 0 ? (
                <p className="caption1 text-muted">
                  선택된 카테고리가 없습니다
                </p>
              ) : (
                preferredCategories.map((cat) => {
                  const option = CATEGORY_OPTIONS.find((o) => o.value === cat);
                  return (
                    <span
                      key={cat}
                      className="bg-orange-50 text-primary caption1 px-3 py-1 rounded-full"
                    >
                      {option?.emoji} {cat}
                    </span>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* 내 위치 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="font-bold body3">내 위치</p>
            <button
              onClick={() => navigate("/location-edit")}
              className="border border-primary-light rounded-lg px-3 py-1 caption1 text-primary"
            >
              편집 &gt;
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <div>
              <p className="body2">{locationLabel}</p>
              <p className="caption1 text-muted">현재 위치</p>
            </div>
          </div>
        </div>

        {/* 방문 기록 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-bold body3">방문 기록</p>
              <p className="caption1 text-muted">최근 방문한 맛집</p>
            </div>
            <button
              onClick={() => navigate("/mypage/visits")}
              className="border border-primary-light rounded-lg px-3 py-1 caption1 text-primary"
            >
              전체보기 &gt;
            </button>
          </div>
          {loading ? (
            <p className="caption1 text-muted">불러오는 중...</p>
          ) : visits.length === 0 ? (
            <p className="caption1 text-muted">방문 기록이 없습니다</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {visits.slice(0, 2).map((v) => (
                <div
                  key={v.kakao_place_id}
                  className="min-w-40 border border-line rounded-xl p-3 bg-hover flex-shrink-0"
                >
                  <p className="caption1 font-bold mb-1">{v.place_name}</p>
                  <p className="caption1 text-muted">
                    {v.visit_count}회 방문
                  </p>
                  <p className="caption1 text-muted mt-1">
                    마지막 {v.last_visited?.slice(0, 10)}
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
              <p className="font-bold body3">즐겨찾기</p>
              <p className="caption1 text-muted">저장한 곳</p>
            </div>
            <button
              onClick={() => navigate("/mypage/favorites")}
              className="border border-primary-light rounded-lg px-3 py-1 caption1 text-primary"
            >
              전체보기 &gt;
            </button>
          </div>
          {loading ? (
            <p className="caption1 text-muted">불러오는 중...</p>
          ) : favorites.length === 0 ? (
            <p className="caption1 text-muted">즐겨찾기가 없습니다</p>
          ) : (
            <div className="flex flex-col">
              {favorites.slice(0, 3).map((f) => (
                <div
                  key={f.favorite_id}
                  className="flex items-center justify-between py-3 border-b border-line"
                >
                  <div className="flex items-center gap-2">
                    <Heart
                      size={18}
                      strokeWidth={1.5}
                      className="text-danger fill-red-400"
                    />
                    <div>
                      <p className="body2">{f.place_name}</p>
                      <p className="caption1 text-muted">
                        {f.category_name}
                      </p>
                    </div>
                  </div>
                  <p className="caption1 text-muted">
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
          className="w-full bg-primary text-white rounded-xl py-4 h2-semi mt-4"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
