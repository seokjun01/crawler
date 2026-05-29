import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./splash.module.css";

export default function SplashPage() {
  const navigate = useNavigate();
  const [showButtons, setShowButtons] = useState(false);
  const [showTags, setShowTags] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTags(true), 2000);
    const t2 = setTimeout(() => setShowButtons(true), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const tags = [
    { label: "주변 맛집 탐색", color: "bg-primary" },
    { label: "메뉴 추천", color: "bg-primary-middle" },
    { label: "같이 먹기 채팅", color: "bg-primary-light" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div
        className={`${styles.container} w-full max-w-[480px] mx-auto flex flex-col flex-1`}
      >
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <svg
            viewBox="0 0 680 780"
            width="160"
            height="185"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b35" />
                <stop offset="100%" stopColor="#ffb899" />
              </linearGradient>
            </defs>
            <rect
              className={styles.bgRect}
              x="-200"
              y="-180"
              width="400"
              height="400"
              rx="88"
              fill="url(#logoGrad)"
            />
            <path
              className={styles.pinPath}
              d="M340,145 C425,145 488,208 488,278 C488,362 402,440 340,502 C278,440 192,362 192,278 C192,208 255,145 340,145 Z"
            />
            <path
              className={styles.pinFill}
              d="M340,145 C425,145 488,208 488,278 C488,362 402,440 340,502 C278,440 192,362 192,278 C192,208 255,145 340,145 Z"
              fill="white"
            />
            <circle className={styles.dot} cx="0" cy="0" r="17" fill="white" />
            <g
              className={styles.forkGroup}
              transform="translate(340,300) rotate(-28)"
            >
              <line
                x1="0"
                y1="-124"
                x2="0"
                y2="124"
                stroke="#FF6B35"
                strokeWidth="13"
                strokeLinecap="round"
              />
              <line
                x1="-15"
                y1="-124"
                x2="-15"
                y2="-70"
                stroke="#FF6B35"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <line
                x1="15"
                y1="-124"
                x2="15"
                y2="-70"
                stroke="#FF6B35"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <path
                d="M-18,-70 Q0,-46 18,-70"
                fill="none"
                stroke="#FF6B35"
                strokeWidth="11"
                strokeLinecap="round"
              />
            </g>
            <g
              className={styles.spoonGroup}
              transform="translate(340,300) rotate(28)"
            >
              <ellipse
                cx="0"
                cy="-102"
                rx="18"
                ry="24"
                fill="none"
                stroke="#FF6B35"
                strokeWidth="11"
              />
              <line
                x1="0"
                y1="-78"
                x2="0"
                y2="124"
                stroke="#FF6B35"
                strokeWidth="13"
                strokeLinecap="round"
              />
            </g>
          </svg>

          <p className={styles.title}>DISHPATCH</p>
          <p className={`${styles.logoText} text-xl mt-1 text-primary-middle`}>
            오늘 뭐먹지?
          </p>

          <div
            className="flex flex-col items-center gap-2 mt-2 transition-all duration-500"
            style={{
              opacity: showTags ? 1 : 0,
              transform: showTags ? "translateY(0)" : "translateY(10px)",
            }}
          >
            {tags.map((tag, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-primary-dark text-sm"
                style={{
                  background: "rgba(255,107,53,0.07)",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${tag.color}`} />
                {tag.label}
              </div>
            ))}
          </div>
        </div>

        <div
          className={`${styles.buttons} w-full max-w-sm mx-auto px-5 pb-10 flex flex-col gap-3 transition-all duration-400`}
          style={{
            opacity: showButtons ? 1 : 0,
            transform: showButtons ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-btn-primary text-white rounded-xl py-4 text-base font-semibold"
          >
            로그인
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full border border-primary text-primary bg-transparent rounded-xl py-4 text-base font-semibold"
          >
            가입하기
          </button>
        </div>
      </div>
    </div>
  );
}
