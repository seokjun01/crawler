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
    try {
      const response = await checkEmailApi(email);
      if (response.data.duplicate) {
        setError("이미 사용중인 이메일입니다.");
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
      selectedCategories([...selectedCategories, label]);
    }
    setError("");
  };

  const handleRegister = async () => {
    try {
      const response = await registerApi(
        email,
        password,
        nickname,
        selectedCategories,
      );
      if (response.data.success) {
        navigate("/verify-email", { state: { email } });    // (인증 재발송에 필요하기 때문에 상태로 넘겨줌)
      } else {
        setError(response.data.message);
      }
    } catch (e) {
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    // 여기서 부터 회원가입 레이아웃 
  )
}
