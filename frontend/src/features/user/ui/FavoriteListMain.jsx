import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { favoriteListApi, favoriteDeleteApi } from "../../places/api";

export function FavoriteListMain() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = () => {
    setLoading(true);
    favoriteListApi()
      .then((res) => setFavorites(res.data.favorites?.block1 || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleDelete = async (kakaoPlaceId) => {
    if (!window.confirm("즐겨찾기에서 삭제하시겠습니까?")) return;
    try {
      await favoriteDeleteApi(kakaoPlaceId);
      fetchFavorites();
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="flex items-center px-5 py-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="mr-3 text-xl">
          ←
        </button>
        <h1 className="font-bold text-base">즐겨찾기 목록</h1>
      </div>
      <div className="px-5 py-4">
        <p className="font-bold text-sm mb-1">즐겨찾기</p>
        <p className="text-xs text-gray-400 mb-4">저장한 곳</p>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 rounded-full border-2 border-black border-t-transparent animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-10">
            즐겨찾기가 없습니다
          </p>
        ) : (
          <div className="flex flex-col">
            {favorites.map((f) => (
              <div
                key={f.favorite_id}
                className="flex items-center justify-between py-3 border-b border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <div>
                    <p className="text-sm font-medium">{f.place_name}</p>
                    <p className="text-xs text-gray-400">{f.category_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-gray-400">
                    {f.created_at?.slice(0, 10)}
                  </p>
                  <button
                    onClick={() => handleDelete(f.kakao_place_id)}
                    className="text-xs text-red-400"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
