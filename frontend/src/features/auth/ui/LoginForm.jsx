// 로그인 UI + 상태관리 + API호출 연결
import { locationGetApi } from "../../location/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/AuthContext";
import { loginApi } from "../api";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await loginApi(email, password);
      if (response.data.success) {
        login({
          nickname: response.data.nickname,
          email,
          preferredCategories: response.data.preferredCategories || "",
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));
        const locationResponse = await locationGetApi();
        const hasLocation = locationResponse.data.latitude;

        // 위치 없으면 최초 등록 화면, 있으면 홈
        navigate(hasLocation ? "/" : "/location-register");
      } else {
        if (response.data.message === "이메일 인증이 필요합니다.") {
          navigate("/verify-email", { state: { email } });
        } else {
          setError(response.data.message);
        }
      }
    } catch (e) {
      console.error("locationGet 에러:", locError);
      // 위치 조회 실패 시 일단 홈으로
      navigate("/location-register");
    }
  };

  return (
    <div className="flex-1 px-5 pt-8">
      <h2 className="text-2xl font-bold mb-1">로그인</h2>
      <p className="text-gray-400 text-sm mb-8">
        이메일과 비밀번호로 로그인하세요
      </p>

      <div className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="예) user@cyber-i.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black"
        />
        <div className="text-xs text-gray-400 mt-1">
          · <button className="underline">ID/PW 찾기</button>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white rounded-xl py-4 text-base font-semibold"
        >
          로그인
        </button>
        <button
          onClick={() => navigate("/register")}
          className="w-full bg-white text-black border border-black rounded-xl py-4 text-base font-semibold"
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
