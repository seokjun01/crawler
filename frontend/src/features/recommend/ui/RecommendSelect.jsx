import { useNavigate } from "react-router-dom";
import { Dices, UserStar } from "lucide-react";

export function RecommendSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/*상단 타이틀*/}
      <div className="mb-16 text-center">
        <p className="text-display mb-3">🍽️</p>
        <h1 className="text-display text-primary font-bold mb-2">오늘 뭐 먹지?</h1>
        <p className="text-sub text-muted">추천 방식을 선택해주세요</p>
      </div>
      {/*선택 카드 2개*/}
      <div className="w-full flex flex-col gap-4">
        {/*랜덤 버튼*/}
        <button
          onClick={() =>
            navigate("/recommend/result", { state: { mode: "random" } })
          }
          className="w-full border-2 border-primary-middle bg-primary-cream rounded-2xl p-6 text-left active:scale-95 transition-transform"
        >
          <p className="text-display mb-2">
            <Dices size={28} strokeWidth={1.5} className="text-primary mb-2" />
          </p>
          <p className="text-heading text-primary font-bold mb-1">랜덤 추천</p>
        </button>
        <button
          onClick={() => navigate("/recommend/exclude")}
          className="w-full border-2 border-primary-middle bg-primary-cream rounded-2xl p-6 text-left active:scale-95 transition-transform"
        >
          <p className="text-display mb-2">
            <UserStar
              size={28}
              strokeWidth={1.5}
              className="text-primary mb-2"
            />
          </p>
          <p className="text-heading  text-primary font-bold mb-1">정밀 추천</p>
          <p className="text-sub text-muted">내 취향 + 먹기 싫은 거 빼고</p>
        </button>
      </div>
    </div>
  );
}
