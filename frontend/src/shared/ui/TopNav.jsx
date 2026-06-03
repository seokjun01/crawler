import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Sparkles, Users, User, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "홈", icon: Home },
  { path: "/recommend", label: "추천", icon: Sparkles },
  { path: "/chat", label: "같이먹어요", icon: Users },
  { path: "/mypage", label: "마이페이지", icon: User },
];

export function TopNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-line bg-[#f5f5f5]">
        <div className="mx-auto flex w-full bg-white max-w-screen-xl items-center  justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <img src="/DishPatch.svg" alt="DishPatch" width="25" height="25" />
            <span className="body1 text-primary">DishPatch</span>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="hidden lg:block text-orange-500 hover:text-orange-600 transition-colors"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 bg-black/40"
        />
      )}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <span className="font-bold text-heading">메뉴</span>
          <button
            onClick={() => setOpen(false)}
            className="text-muted text-xl hover:text-black"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex flex-col py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`flex items-center gap-3 px-6 py-3 gap-1 rounded-xl transition-all duration-150 active:scale-90 ${
                  isActive
                    ? "text-black"
                    : "text-muted hover:text-secondary hover:bg-hover"
                }`}
              >
                <item.icon
                  size={18}
                  strokeWidth={1.5}
                  className="text-orange-500"
                />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
