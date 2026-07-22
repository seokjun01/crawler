import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { checkEmailApi, registerApi } from "../api";

const CATEGORIES = [
  { label: "한식", emoji: "🍚" },
  { label: "중식", emoji: "🥟" },
  { label: "일식", emoji: "🍣" },
  { label: "양식", emoji: "🍝" },
  { label: "분식", emoji: "🍲" },
  { label: "패스트푸드", emoji: "🍔" },
  { label: "치킨", emoji: "🍗" },
  { label: "피자", emoji: "🍕" },
];

const registerSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
  nickname: z.string().min(1, "닉네임을 입력해주세요"),
  categories: z.array(z.string()).max(5, "최대 5개까지 선택 가능합니다."),
});

export function RegisterForm() {
  const [emailChecked, setEmailChecked] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { categories: [] },
  });

  const selectedCategories = watch("categories");

  const handleCheckEmail = async () => {
    const email = getValues("email");
    const result = z.string().email().safeParse(email);
    if (!result.success) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }
    try {
      const response = await checkEmailApi(email);
      if (response.data.duplicate) {
        alert("이미 사용중인 이메일입니다.");
        setEmailChecked(false);
      } else {
        setEmailChecked(true);
        alert("사용 가능한 이메일입니다.");
      }
    } catch (e) {
      alert("이메일 확인 중 오류가 발생했습니다.");
    }
  };

  const handleCategoryToggle = (label) => {
    if (selectedCategories.includes(label)) {
      setValue(
        "categories",
        selectedCategories.filter((c) => c !== label),
        { shouldValidate: true },
      );
      return;
    }
    if (selectedCategories.length >= 5) {
      alert("최대 5개까지 선택 가능합니다.");
      return;
    }
    setValue("categories", [...selectedCategories, label], {
      shouldValidate: true,
    });
  };

  const onSubmit = async ({ email, password, nickname, categories }) => {
    if (!emailChecked) {
      alert("이메일 중복확인을 해주세요.");
      return;
    }
    try {
      const response = await registerApi(email, password, nickname, categories);
      if (response.data.success) {
        navigate("/verify-email", { state: { email } });
      } else {
        alert(response.data.message);
      }
    } catch (e) {
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-5 py-6 flex flex-col gap-5"
    >
      {/* 이메일 섹션 */}
      <div>
        <label className="btn1 mb-1 block">이메일</label>
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          {...register("email", { onChange: () => setEmailChecked(false) })}
          className="w-full border border-input rounded-lg px-4 py-3 body3 outline-none focus:border-black"
        />
        {errors.email && (
          <p className="text-error caption1 mt-1">{errors.email.message}</p>
        )}
        <p className="caption1 text-muted mt-1">예: name@cyber-i.com</p>
        <button
          type="button"
          onClick={handleCheckEmail}
          className="w-full bg-primary text-white rounded-lg py-3 text-sm font-semibold mt-2"
        >
          중복확인
        </button>
      </div>

      {/* 비밀번호 섹션 */}
      <div>
        <label className="btn1 mb-1 block">비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          {...register("password")}
          className="w-full border border-input rounded-lg px-4 py-3 body3 outline-none focus:border-black"
        />
        {errors.password && (
          <p className="text-error caption1 mt-1">{errors.password.message}</p>
        )}
        <p className="caption1 text-muted mt-1">영문/숫자 조합 등</p>
      </div>

      {/* 닉네임 섹션 */}
      <div>
        <label className="btn1 mb-1 block">닉네임</label>
        <input
          type="text"
          placeholder="닉네임을 입력하세요"
          {...register("nickname")}
          className="w-full border border-input rounded-lg px-4 py-3 body3 outline-none focus:border-black"
        />
        {errors.nickname && (
          <p className="text-error caption1 mt-1">{errors.nickname.message}</p>
        )}
        <p className="caption1 text-muted mt-1">2~10자 권장</p>
      </div>

      {/* 카테고리 선택 섹션 */}
      <div>
        <p className="btn1 mb-1">카테고리 선택</p>
        <p className="caption1 text-muted mb-3">최대 5개 선택 가능</p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.label}
              onClick={() => handleCategoryToggle(cat.label)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border body3 transition-all
              ${
                selectedCategories.includes(cat.label)
                  ? " bg-primary-cream text-primary-light font-semibold"
                  : "border-input text-secondary bg-white"
              }`}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 border border-primary-light text-primary rounded-xl py-4 h2-semi
          hover:bg-gray-200 active:scale-95 transition-all
          "
        >
          취소
        </button>
        <button
          type="submit"
          className="flex-1 bg-primary text-white rounded-xl py-4 h2-semi
          hover:bg-gray-900 active:scale-95 transition-all"
        >
          가입하기
        </button>
      </div>
    </form>
  );
}
