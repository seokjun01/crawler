// 이메일 인증 + 인증메일 재발송 API 호출

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resendVerificationEmailApi } from "../api";

export function VerifyEmailForm() {
  const [loading, setLoading] = useState(false); //재발송 요청 중인지 표시
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation(); //이전 페이지에서 넘겨준 state 값을 꺼내올 때 사용
  const email = location.state.email ?? "";

  const handleResend = async () => {
    if (!email) {
      setMessage("이메일 정보가 없습니다. 다시 가입해주세요.");
      return;
    }

    setLoading(true); // 재발송 요청 중 일시, 로딩 상태 진입
    setMessage("");

    try {
      const response = await resendVerificationEmailApi(email);
      if (response.data.success) {
        setMessage("인증 메일이 재발송 되었습니다. 메일함을 확인해주세요.");
      } else {
        setMessage(response.data.message);
      }
    } catch (e) {
      setMessage("재발송 오류 발생, 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex-flex-col px-5 pt-12">
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-2">이메일을 확인해주세요</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          {email || "입력하신 이메일"} 으로 인증 메일을 발송했습니다.{"\n"}
          메일함을 확인하고 인증 링크를 클릭해주세요.
        </p>
      </div>

      {message && (
        <p
          className={`text-sm text-center mt-2 ${
            message.includes("재발송") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <div className="mt-auto pb-8 flex flex-col gap-3">
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-black text-white rounded-xl py-4 text-base font-semibold"
        >
          인증 완료 후 로그인하기
        </button>
        <button
          onClick={handleResend}
          disabled={loading}
          className="w-full border border-black text-black rounded-xl py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {" "}
          {loading ? "발송 중..." : "인증 메일 재발송하기"}
        </button>
      </div>
    </div>
  );
}
