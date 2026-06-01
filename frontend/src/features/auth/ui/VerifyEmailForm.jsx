import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { resendVerificationEmailApi } from "../api";

export function VerifyEmailForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const email = location.state?.email ?? "";

  // 마운트 시 URL의 result 파라미터 확인
  useEffect(() => {
    const result = searchParams.get("result");
    if (result === "success") {
      setVerified(true);
      setMessage("인증이 완료되었습니다. 로그인해주세요.");
    } else if (result === "expired") {
      setMessage("인증 링크가 만료되었습니다. 재발송해주세요.");
    } else if (result === "invalid") {
      setMessage("유효하지 않은 인증 링크입니다. 재발송해주세요.");
    }
  }, []);

  const handleResend = async () => {
    if (!email) {
      setMessage("이메일 정보가 없습니다. 다시 가입해주세요.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await resendVerificationEmailApi(email);
      if (response.data.success) {
        setMessage("인증 메일이 재발송되었습니다. 메일함을 확인해주세요.");
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
    <div className="max-w-[1280px] bg-white shadow-xl mx-auto flex-1 flex flex-col px-5 pt-12">
      <div className="mb-12">
        <h2 className="h1 mb-2">이메일을 확인해주세요</h2>
        <p className="text-muted sub1 leading-relaxed">
          {email || "입력하신 이메일"}으로 인증 메일을 발송했습니다.{"\n"}
          메일함을 확인하고 인증 링크를 클릭해주세요.
        </p>
      </div>

      {message && (
        <p
          className={`body3 text-center mt-2 ${
            verified ? "text-green-500" : "text-error"
          }`}
        >
          {message}
        </p>
      )}

      <div className="mt-auto pb-8 flex flex-col gap-3">
        {verified ? (
          // 인증 완료 → 로그인 버튼만
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-primary text-white rounded-xl py-4 h2-semi"
          >
            로그인하러 가기
          </button>
        ) : (
          // 인증 전 → 재발송 버튼만
          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full border border-primary-light text-primary rounded-xl py-4 h2-semi disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "발송 중..." : "인증 메일 재발송하기"}
          </button>
        )}
      </div>
    </div>
  );
}
