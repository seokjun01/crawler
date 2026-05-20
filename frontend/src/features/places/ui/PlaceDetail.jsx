import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  placeDetailApi,
  reviewGetApi,
  reviewSaveApi,
  reviewUpdateApi,
  reviewDeleteApi,
} from "../api";
import { useAuth } from "../../../app/AuthContext";

export default function PlaceDetail() {
  const { kakaoPlaceId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [menus, setMenus] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 수정 모드 상태
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [editMenu, setEditMenu] = useState("");

  const placeName = state?.placeName || "";
  const categoryName = state?.categoryName || "";

  const fetchReviews = async () => {
    const res = await reviewGetApi(kakaoPlaceId);
    setReviews(res.data.reviews?.block1 || []);
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const [detailRes] = await Promise.all([
          placeDetailApi(kakaoPlaceId, placeName),
        ]);
        const rawMenus = detailRes.data.menus;
        setMenus(
          typeof rawMenus === "string" ? JSON.parse(rawMenus) : rawMenus || [],
        );
        await fetchReviews();
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
        selectedMenu,
        rating,
        reviewText,
      );
      setReviewText("");
      setSelectedMenu("");
      setRating(5);
      alert("후기가 등록되었습니다.");
      await fetchReviews();
    } catch (e) {
      setError("후기 등록에 실패했습니다.");
    }
  };

  const handleEditStart = (review) => {
    setEditingId(review.visit_history_id);
    setEditText(review.content);
    setEditRating(review.rating);
    setEditMenu(review.menu_name || "");
  };

  const handleEditSubmit = async (visitHistoryId) => {
    try {
      await reviewUpdateApi(
        kakaoPlaceId,
        visitHistoryId,
        editMenu,
        editRating,
        editText,
      );
      setEditingId(null);
      alert("후기가 수정되었습니다.");
      await fetchReviews();
    } catch (e) {
      setError("후기 수정에 실패했습니다.");
    }
  };

  const handleDelete = async (visitHistoryId) => {
    if (!window.confirm("후기를 삭제하시겠습니까?")) return;
    try {
      await reviewDeleteApi(kakaoPlaceId, visitHistoryId);
      alert("후기가 삭제되었습니다.");
      await fetchReviews();
    } catch (e) {
      setError("후기 삭제에 실패했습니다.");
    }
  };

  const StarRating = ({ value, onChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className={`text-2xl ${star <= value ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </button>
      ))}
    </div>
  );

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
                    <span className="text-sm">{menu.name}</span>
                    <span className="text-sm text-gray-500">
                      {menu.price ? `${menu.price.toLocaleString()}원` : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 후기 작성 */}
          <div>
            <h2 className="font-bold text-sm mb-3">후기 작성</h2>
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
            <StarRating value={rating} onChange={setRating} />
            <div className="flex gap-2 mt-2">
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
                {reviews.map((review) => (
                  <div
                    key={review.visit_history_id}
                    className="border-b border-gray-100 pb-3"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-gray-400">
                        {review.nickname}{" "}
                        {review.menu_name && `· ${review.menu_name}`}
                      </p>
                      {review.nickname === user?.nickname && (
                        <div className="flex gap-2">
                          {editingId === review.visit_history_id ? (
                            <>
                              <button
                                onClick={() =>
                                  handleEditSubmit(review.visit_history_id)
                                }
                                className="text-xs text-black underline"
                              >
                                저장
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-xs text-gray-400 underline"
                              >
                                취소
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditStart(review)}
                                className="text-xs text-gray-500 underline"
                              >
                                수정
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(review.visit_history_id)
                                }
                                className="text-xs text-red-400 underline"
                              >
                                삭제
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 별점 - 수정 모드면 클릭 가능 */}
                    <div className="flex gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() =>
                            editingId === review.visit_history_id &&
                            setEditRating(star)
                          }
                          className={`text-lg ${
                            star <=
                            (editingId === review.visit_history_id
                              ? editRating
                              : review.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          } ${editingId === review.visit_history_id ? "cursor-pointer" : ""}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    {/* 내용 - 수정 모드면 input으로 */}
                    {editingId === review.visit_history_id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        maxLength={100}
                        autoFocus
                        className="w-full border-b border-gray-300 text-sm outline-none py-1"
                      />
                    ) : (
                      <p className="text-sm">{review.content}</p>
                    )}
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
