//로그인 페이지 구현
//FSD니까 하위로 더 쪼개서 조립할 것

import { LoginForm } from "../../features/auth";
import logo from "../../assets/logo.png";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="px-5 pt-5 pb-3 border-b border-gray-100 flex items-center">
        <img src={logo} alt="DISHPATCH" className="h-8" />
      </div>

      <LoginForm />
    </div>
  );
}
