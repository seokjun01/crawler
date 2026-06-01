//회원가입 UI + 상태관리 + API호출
//Layers -> slices -> segment 부분!

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkEmailApi, registerApi } from "../api";

//  백엔드 validation과 일치
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

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]); // 카테고리는 배열로 관리
  const [emailChecked, setEmailChecked] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleCheckEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }
    try {
      const response = await checkEmailApi(email);
      if (response.data.duplicate) {
        alert("이미 사용중인 이메일입니다.");
        setEmailChecked(false);
      } else {
        setError("");
        setEmailChecked(true);
        alert("사용 가능한 이메일입니다.");
      }
    } catch (e) {
      setError("이메일 확인 중 오류가 발생했습니다.");
    }
  };

  const handleCategoryToggle = (label) => {
    if (selectedCategories.includes(label)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== label));
    } else {
      if (selectedCategories.length >= 5) {
        setError("최대 5개까지 선택 가능합니다.");
        return;
      }
      setSelectedCategories([...selectedCategories, label]);
    }
    setError("");
  };

  const handleRegister = async () => {
    if (!emailChecked) {
      alert("이메일 중복확인을 해주세요.");
      return;
    }
    try {
      const response = await registerApi(
        email,
        password,
        nickname,
        selectedCategories,
      );
      if (response.data.success) {
        navigate("/verify-email", { state: { email } }); // (인증 재발송에 필요하기 때문에 상태로 넘겨줌)
      } else {
        alert(response.data.message);
      }
    } catch (e) {
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="px-5 py-6 flex flex-col gap-5">
      {/* 이메일 섹션 */}
      <div>
        <label className="text-body font-semibold mb-1 block">이메일</label>
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          // 이메일 바뀌면 중복확인 초기화
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailChecked(false);
          }}
          className="w-full border border-input rounded-lg px-4 py-3 text-body outline-none focus:border-black"
        />
        <p className="text-caption text-muted mt-1">예: name@cyber-i.com</p>
        <button
          onClick={handleCheckEmail}
          className="w-full bg-primary text-white rounded-lg py-3 text-sm font-semibold mt-2"
        >
          중복확인
        </button>
      </div>

      {/* 비밀번호 섹션 */}
      <div>
        <label className="text-body font-semibold mb-1 block">비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-input rounded-lg px-4 py-3 text-body outline-none focus:border-black"
        />
        <p className="text-caption text-muted mt-1">영문/숫자 조합 등</p>
      </div>

      {/* 닉네임 섹션 */}
      <div>
        <label className="text-body font-semibold mb-1 block">닉네임</label>
        <input
          type="text"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full border border-input rounded-lg px-4 py-3 text-body outline-none focus:border-black"
        />
        <p className="text-caption text-muted mt-1">2~10자 권장</p>
      </div>

      {/* 카테고리 선택 섹션 */}
      <div>
        <p className="text-body font-semibold mb-1">카테고리 선택</p>
        <p className="text-caption text-muted mb-3">최대 5개 선택 가능</p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => handleCategoryToggle(cat.label)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-body transition-all
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

      {error && <p className="text-error text-caption">{error}</p>}

      {/* 하단 버튼 */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 border border-primary-light text-primary rounded-xl py-4 text-heading font-semibold
          hover:bg-gray-200 active:scale-95 transition-all
          "
        >
          취소
        </button>
        <button
          onClick={handleRegister}
          className="flex-1 bg-primary text-white rounded-xl py-4 text-heading font-semibold
          hover:bg-gray-900 active:scale-95 transition-all"
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
