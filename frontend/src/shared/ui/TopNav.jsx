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
            <svg
              width="25"
              height="25"
              viewBox="0 0 680 680"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="120"
                y="20"
                width="440"
                height="440"
                rx="120"
                fill="#FF6B35"
              />
              <g transform="translate(340, 250)">
                <path
                  d="M0,-155 C90,-155 155,-88 155,-18 C155,72 58,155 0,210 C-58,155 -155,72 -155,-18 C-155,-88 -90,-155 0,-155 Z"
                  fill="white"
                />
                <circle cx="0" cy="248" r="22" fill="white" />
              </g>
              <g transform="translate(340, 248) rotate(-28)">
                <line
                  x1="0"
                  y1="-118"
                  x2="0"
                  y2="118"
                  stroke="#FF6B35"
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                <line
                  x1="-16"
                  y1="-118"
                  x2="-16"
                  y2="-64"
                  stroke="#FF6B35"
                  strokeWidth="13"
                  strokeLinecap="round"
                />
                <line
                  x1="16"
                  y1="-118"
                  x2="16"
                  y2="-64"
                  stroke="#FF6B35"
                  strokeWidth="13"
                  strokeLinecap="round"
                />
                <path
                  d="M-20,-64 Q0,-40 20,-64"
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="13"
                  strokeLinecap="round"
                />
              </g>
              <g transform="translate(340, 248) rotate(28)">
                <ellipse
                  cx="0"
                  cy="-98"
                  rx="19"
                  ry="26"
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="13"
                />
                <line
                  x1="0"
                  y1="-72"
                  x2="0"
                  y2="118"
                  stroke="#FF6B35"
                  strokeWidth="15"
                  strokeLinecap="round"
                />
              </g>
            </svg>
            <span className="text-body font-bold text-primary">DishPatch</span>
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
