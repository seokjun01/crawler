// 로그인 UI + 상태관리 + API호출 연결
import { locationGetApi } from "../../location/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../app/authStore";
import { loginApi } from "../api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export function LoginForm() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async ({ email, password }) => {
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
      <p className="text-muted sub1 mb-8">이메일과 비밀번호로 로그인하세요</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="예) user@cyber-i.com"
            {...register("email")}
            className="border border-input rounded-lg px-4 py-3 body3 outline-none focus:border-black"
          />
          {errors.email && (
            <p className="text-error caption1">{errors.email.message}</p>
          )}
          <input
            type="password"
            placeholder="비밀번호"
            {...register("password")}
            className="border border-input rounded-lg px-4 py-3 body3 outline-none focus:border-black"
          />
          {errors.password && (
            <p className="text-error caption1">{errors.password.message}</p>
          )}
          <div className="caption1 text-muted mt-1">
            ·{" "}
            <button type="button" className="underline">
              ID/PW 찾기
            </button>
          </div>
          {error && <p className="text-error caption1">{error}</p>}
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button
            type="submit"
            className="w-full bg-primary text-white rounded-xl py-4 h2-semi
            hover:bg-primary-light active:scale-95 transition-all
            "
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full bg-white text-primary border border-primary-light rounded-xl py-4 h2-semi
            hover:bg-primary-cream active:scale-95 transition-all
            "
          >
            가입하기
          </button>
        </div>
      </form>
    </div>
  );
}
