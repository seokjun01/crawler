import { useNavigate, useLocation } from "react-router-dom";
import { Home, Sparkles, Users, User } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "홈", icon: Home },
  { path: "/recommend", label: "추천", icon: Sparkles },
  { path: "/chat", label: "같이먹어요", icon: Users },
  { path: "/mypage", label: "마이페이지", icon: User },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation(); //현재 URL 경로 확인용

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 z-50 lg:hidden">
      <div className="grid grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-3 gap-1 rounded-xl transition-all duration-150 active:scale-90 ${
                isActive
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon
                size={22}
                strokeWidth={2}
                className="text-orange-500"
              />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
