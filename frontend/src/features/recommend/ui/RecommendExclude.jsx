import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { label: "한식", emoji: "🍚" },
  { label: "중식", emoji: "🥟" },
  { label: "일식", emoji: "🍣" },
  { label: "양식", emoji: "🍝" },
  { label: "분식", emoji: "🍲" },
  { label: "패스트푸드", emoji: "🍔" },
  { label: "치킨", emoji: "🍗" },
  { label: "피자", emoji: "🍕" },
];

export function RecommendExclude() {
  const navigate = useNavigate();
  const [exclude, setExclude] = useState(new Set());

  const toggle = (label) => {
    setExclude((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const handleConfirm = () => {
    const excludeStr = [...exclude].join(",");

    navigate("/recommend/result", {
      state: {
        mode: "personal",
        exclude: excludeStr,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center px-5 py-4 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-xl text-gray-500"
        >
          ‹
        </button>
        <h1 className="text-base font-bold">추천 로직 설정</h1>
      </div>

      <div className="flex-1 px-5 pt-6">
        <p className="text-lg font-bold mb-1">안 땡기는 카테고리 선택</p>
        <p className="text-sm text-gray-400 mb-5">
          선택한 카테고리는 추천에서 제외돼요!
        </p>

        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => {
            const isSelected = exclude.has(cat.label);

            return (
              <button
                key={cat.label}
                onClick={() => toggle(cat.label)}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl border text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-primary-cream text-primary-light font-semibold"
                    : "bg-white text-gray-500 border-gray-200"
                }`}
              >
                <span className="text-xl">{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-4 border-t lg:pb-4 mb-20 border-gray-100">
        <button
          onClick={handleConfirm}
          className="w-full bg-primary text-white rounded-xl py-4 text-base font-semibold"
        >
          확인
        </button>
      </div>
    </div>
  );
}
