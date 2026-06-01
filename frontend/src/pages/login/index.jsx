//로그인 페이지 구현
//FSD니까 하위로 더 쪼개서 조립할 것

import { LoginForm } from "../../features/auth";
import logo from "../../assets/logo.png";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col ">
      <div className="w-full max-w-[480px] mx-auto flex flex-col flex-1 bg-white shadow-xl">
        <div className="px-1 pt-5 pb-3 border-b border-line flex items-center">
          <svg
            width="44"
            height="44"
            viewBox="0 0 680 680"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
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
                stroke-width="15"
                stroke-linecap="round"
              />
              <line
                x1="-16"
                y1="-118"
                x2="-16"
                y2="-64"
                stroke="#FF6B35"
                stroke-width="13"
                stroke-linecap="round"
              />
              <line
                x1="16"
                y1="-118"
                x2="16"
                y2="-64"
                stroke="#FF6B35"
                stroke-width="13"
                stroke-linecap="round"
              />
              <path
                d="M-20,-64 Q0,-40 20,-64"
                fill="none"
                stroke="#FF6B35"
                stroke-width="13"
                stroke-linecap="round"
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
                stroke-width="13"
              />
              <line
                x1="0"
                y1="-72"
                x2="0"
                y2="118"
                stroke="#FF6B35"
                stroke-width="15"
                stroke-linecap="round"
              />
            </g>
          </svg>
          <p className="text-primary"> DishPatch </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
