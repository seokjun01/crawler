// 식당 상세 페이지
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { placeDetailApi, reviewGetApi, reviewSaveApi } from "../api";

export default function PlaceDetail() {
  const { kakaoPlaceId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const placeName = state?.placeName || "";
  const categoryName = state?.categoryName || "";

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const [detailRes, reviewRes] = await Promise.all([
          placeDetailApi(kakaoPlaceId, placeName),
          reviewGetApi(kakaoPlaceId),
        ]);
        const rawMenus = detailRes.data.menus;
        setMenus(
          typeof rawMenus === "string" ? JSON.parse(rawMenus) : rawMenus || [],
        );
        setReviews(reviewRes.data.reviews?.block1 || []);
      } catch (e) {
        setError("정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [kakaoPlaceId]);

  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) return;
    try {
      await reviewSaveApi(
        kakaoPlaceId,
        placeName,
        categoryName.split(">").pop().trim(),
        rating,
        reviewText,
      );
      setReviewText("");
      const res = await reviewGetApi(kakaoPlaceId);
      setReviews(res.data.reviews.block1 || []);
    } catch (e) {
      setError("후기 등록에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center px-5 py-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="mr-3 text-xl">
          ←
        </button>
        <div>
          <h1 className="font-bold text-base">{placeName}</h1>
          <p className="text-xs text-gray-400">{categoryName}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 rounded-full border-2 border-black border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="px-5 py-4 flex flex-col gap-6 pb-20">
          {/* 메뉴 */}
          <div>
            <h2 className="font-bold text-sm mb-3">메뉴</h2>
            {menus.length === 0 ? (
              <p className="text-xs text-gray-400">등록된 메뉴가 없습니다.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {menus.map((menu, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span className="text-sm">{menu.menu || menu.name}</span>
                    <span className="text-sm text-gray-500">{menu.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 후기 작성 */}
          <div>
            <h2 className="font-bold text-sm mb-3">후기 작성</h2>
            {/* 메뉴 선택 드롭다운 */}
            <select
              value={selectedMenu}
              onChange={(e) => setSelectedMenu(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black mb-2"
            >
              <option value="">메뉴 선택 (선택사항)</option>
              {menus.map((menu, idx) => (
                <option key={idx} value={menu.name}>
                  {menu.name}
                </option>
              ))}
            </select>

            {/* 별점 */}
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* 후기 입력 */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="100자 이내로 작성해주세요"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                maxLength={100}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
              />
              <button
                onClick={handleReviewSubmit}
                className="bg-black text-white px-4 rounded-lg text-sm font-semibold"
              >
                등록
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          {/* 후기 목록 */}
          <div>
            <h2 className="font-bold text-sm mb-3">후기 ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-400">아직 후기가 없습니다.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews.map((review, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-3">
                    <p className="text-xs text-gray-400 mb-1">
                      {review.nickname}
                    </p>
                    <p className="text-sm">{review.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
