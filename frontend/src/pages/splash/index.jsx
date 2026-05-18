// 진입화면  (페이지 레이아웃만 담당)

import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function SplashPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 중앙 영역*/}
      <div className="flex-1 flex flex-col items-center justify-center">
        <img src={logo} alt="DISHPATCH" className="h-20 mb-4" />
        <p className="text-gray-400 text-xl">오늘 뭐먹지?</p>
      </div>

      {/* 하단 버튼 영역*/}
      <div className="px-5 pb-8  flex gap-3">
        <button
          onClick={() => navigate("/login")}
          className="flex-1 border border-black text-black rounded-xl text-base font-semibold"
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
