import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./splash.module.css";

export default function SplashPage() {
  const navigate = useNavigate();
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 680 780"
          width="160"
          height="185"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            className={styles.bgRect}
            x="-200"
            y="-180"
            width="400"
            height="400"
            rx="88"
            fill="#111"
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
              stroke="#111"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <line
              x1="-15"
              y1="-124"
              x2="-15"
              y2="-70"
              stroke="#111"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <line
              x1="15"
              y1="-124"
              x2="15"
              y2="-70"
              stroke="#111"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M-18,-70 Q0,-46 18,-70"
              fill="none"
              stroke="#111"
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
              stroke="#111"
              strokeWidth="11"
            />
            <line
              x1="0"
              y1="-78"
              x2="0"
              y2="124"
              stroke="#111"
              strokeWidth="13"
              strokeLinecap="round"
            />
          </g>
        </svg>

        <p className={styles.title}>DISHPATCH</p>
        <p className={`${styles.logoText} text-gray-400 text-xl mt-1`}>
          오늘 뭐먹지?
        </p>
      </div>

      <div
        className={`${styles.buttons} w-full max-w-sm mx-auto px-5 pb-8 flex gap-3`}
        style={{
          opacity: showButtons ? 1 : 0,
          transform: showButtons ? "translateY(0)" : "translateY(12px)",
        }}
      >
        <button
          onClick={() => navigate("/login")}
          className="flex-1 border border-black text-black rounded-xl py-4 text-base font-semibold"
        >
          로그인
        </button>
        <button
          onClick={() => navigate("/register")}
          className="flex-1 bg-black text-white rounded-xl py-4 text-base font-semibold"
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
