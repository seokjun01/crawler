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
    let response;
    try {
      response = await loginApi(email, password);
    } catch (e) {
      setError("로그인 중 오류가 발생했습니다.");
      return;
    }

    if (response.data.success) {
      login({
        userId: response.data.userId,
        nickname: response.data.nickname,
        email,
        preferredCategories: response.data.preferredCategories || "",
      });

      try {
        const locationResponse = await locationGetApi();
        navigate(locationResponse.data.latitude ? "/" : "/location-register");
      } catch {
        navigate("/location-register");
      }
    } else {
      if (response.data.message === "이메일 인증이 필요합니다.") {
        navigate("/verify-email", { state: { email } });
      } else {
        setError(response.data.message);
      }
    }
  };

  return (
    <div className="flex-1 px-5 pt-8">
      <h2 className="h1 mb-1">로그인</h2>
      <p className="text-muted sub1 mb-8">
        이메일과 비밀번호로 로그인하세요
      </p>

      <div className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="예) user@cyber-i.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-input rounded-lg px-4 py-3 body3 outline-none focus:border-black"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-input rounded-lg px-4 py-3 body3 outline-none focus:border-black"
        />
        <div className="caption1 text-muted mt-1">
          · <button className="underline">ID/PW 찾기</button>
        </div>
        {error && <p className="text-error caption1">{error}</p>}
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={handleLogin}
          className="w-full bg-primary text-white rounded-xl py-4 h2-semi
          hover:bg-primary-light active:scale-95 transition-all
          "
        >
          로그인
        </button>
        <button
          onClick={() => navigate("/register")}
          className="w-full bg-white text-primary border border-primary-light rounded-xl py-4 h2-semi
          hover:bg-primary-cream active:scale-95 transition-all
          "
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
