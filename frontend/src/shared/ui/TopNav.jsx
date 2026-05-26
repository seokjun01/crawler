import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/", label: "홈", emoji: "🏠" },
  { path: "/recommend", label: "추천", emoji: "✨" },
  { path: "/chat", label: "같이먹어요", emoji: "🍱" },
  { path: "/mypage", label: "마이페이지", emoji: "👤" },
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
      <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-[#f5f5f5]">
        <div className="mx-auto flex w-full max-w-screen-xl items-center bg-white justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <svg
              width="32"
              height="37"
              viewBox="0 0 680 780"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(340, 300)">
                <path
                  d="M0,-200 C110,-200 190,-120 190,-30 C190,80 80,180 0,260 C-80,180 -190,80 -190,-30 C-190,-120 -110,-200 0,-200 Z"
                  fill="#111"
                />
                <circle cx="0" cy="310" r="22" fill="#111" />
                <g transform="rotate(-30)">
                  <line
                    x1="0"
                    y1="-160"
                    x2="0"
                    y2="160"
                    stroke="white"
                    stroke-width="16"
                    stroke-linecap="round"
                  />
                  <line
                    x1="-18"
                    y1="-160"
                    x2="-18"
                    y2="-90"
                    stroke="white"
                    stroke-width="14"
                    stroke-linecap="round"
                  />
                  <line
                    x1="18"
                    y1="-160"
                    x2="18"
                    y2="-90"
                    stroke="white"
                    stroke-width="14"
                    stroke-linecap="round"
                  />
                  <path
                    d="M-22,-90 Q0,-60 22,-90"
                    fill="none"
                    stroke="white"
                    stroke-width="14"
                    stroke-linecap="round"
                  />
                </g>
                <g transform="rotate(30)">
                  <ellipse
                    cx="0"
                    cy="-130"
                    rx="22"
                    ry="30"
                    fill="none"
                    stroke="white"
                    stroke-width="14"
                  />
                  <line
                    x1="0"
                    y1="-100"
                    x2="0"
                    y2="160"
                    stroke="white"
                    stroke-width="16"
                    stroke-linecap="round"
                  />
                </g>
              </g>
            </svg>
            <span className="text-lg font-bold">DishPatch</span>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="hidden lg:block text-2xl text-gray-600 hover:text-black"
          >
            ☰
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
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <span className="font-bold text-base">메뉴</span>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 text-xl hover:text-black"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium hover:bg-gray-50 ${
                  isActive ? "text-black" : "text-gray-500"
                }`}
              >
                <span className="text-lg">{item.emoji}</span>
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
