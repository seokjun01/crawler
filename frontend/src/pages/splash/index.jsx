import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SplashPage() {
  const navigate = useNavigate();
  // 애니메이션 완료 후 버튼 표시
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    // 전체 애니메이션 duration 맞춰서 버튼 등장
    const timer = setTimeout(() => setShowButtons(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 중앙 로고 애니메이션 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 680 780"
          width="160"
          height="185"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            @keyframes bgScale {
              0% { transform: translate(340px, 300px) scale(0); opacity: 0; }
              100% { transform: translate(340px, 300px) scale(1); opacity: 1; }
            }
            @keyframes pinDraw {
              0% { stroke-dashoffset: 1400; opacity: 1; }
              100% { stroke-dashoffset: 0; opacity: 1; }
            }
            @keyframes dotPop {
              0% { transform: translate(340px, 610px) scale(0); }
              60% { transform: translate(340px, 610px) scale(1.4); }
              100% { transform: translate(340px, 610px) scale(1); }
            }
            @keyframes forkIn {
              0% { opacity: 0; transform: translate(340px,300px) rotate(-28deg) translateY(-20px); }
              100% { opacity: 1; transform: translate(340px,300px) rotate(-28deg) translateY(0); }
            }
            @keyframes spoonIn {
              0% { opacity: 0; transform: translate(340px,300px) rotate(28deg) translateY(-20px); }
              100% { opacity: 1; transform: translate(340px,300px) rotate(28deg) translateY(0); }
            }
            @keyframes textFade {
              0% { opacity: 0; transform: translateY(8px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes buttonFade {
              0% { opacity: 0; transform: translateY(12px); }
              100% { opacity: 1; transform: translateY(0); }
            }

            .bg-rect {
              transform-origin: center;
              transform-box: fill-box;
              animation: bgScale 0.4s cubic-bezier(0.34,1.56,0.64,1) 0s both;
            }
            .pin-path {
              fill: none;
              stroke: white;
              stroke-width: 10;
              stroke-dasharray: 1400;
              stroke-dashoffset: 1400;
              animation: pinDraw 0.6s ease-out 0.5s both;
            }
            .pin-fill {
              opacity: 0;
              animation: pinDraw 0.01s ease 1.1s both;
            }
            .dot {
              transform: translate(340px, 610px) scale(0);
              transform-box: fill-box;
              transform-origin: center;
              animation: dotPop 0.3s cubic-bezier(0.34,1.56,0.64,1) 1.2s both;
            }
            .fork-group {
              opacity: 0;
              animation: forkIn 0.35s ease-out 1.5s both;
            }
            .spoon-group {
              opacity: 0;
              animation: spoonIn 0.35s ease-out 1.7s both;
            }
            .logo-text {
              opacity: 0;
              animation: textFade 0.5s ease-out 2.2s both;
            }
          `}</style>

          {/* 1. 배경 라운드 사각형 */}
          <rect
            className="bg-rect"
            x="-200"
            y="-180"
            width="400"
            height="400"
            rx="88"
            fill="#111"
          />

          {/* 2. 핀 윤곽선 → 채우기 */}
          <path
            className="pin-path"
            d="M340,145 C425,145 488,208 488,278 C488,362 402,440 340,502 C278,440 192,362 192,278 C192,208 255,145 340,145 Z"
          />
          <path
            className="pin-fill"
            d="M340,145 C425,145 488,208 488,278 C488,362 402,440 340,502 C278,440 192,362 192,278 C192,208 255,145 340,145 Z"
            fill="white"
          />

          {/* 3. 하단 점 */}
          <circle className="dot" cx="0" cy="0" r="17" fill="white" />

          {/* 4. 포크 */}
          <g className="fork-group" transform="translate(340,300) rotate(-28)">
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

          {/* 5. 숟가락 */}
          <g className="spoon-group" transform="translate(340,300) rotate(28)">
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
        <p
          style={{
            opacity: 0,
            animation: "textFade 0.5s ease-out 2.0s both",
            fontWeight: 700,
            fontSize: "28px",
            letterSpacing: "6px",
            color: "#111",
            marginTop: "20px",
          }}
        >
          DISHPATCH
        </p>

        {/* 6. 텍스트 */}
        <p
          className="logo-text text-gray-400 text-xl mt-1"
          style={{ animation: "textFade 0.5s ease-out 2.2s both" }}
        >
          오늘 뭐먹지?
        </p>
      </div>

      {/* 하단 버튼 - 애니메이션 끝나면 등장 */}
      <div
        className="w-full max-w-sm mx-auto px-5 pb-8 flex gap-3"
        style={{
          opacity: showButtons ? 1 : 0,
          transform: showButtons ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
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
