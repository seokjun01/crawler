import { RegisterForm } from "../../features/auth";

export default function RegisterPage() {
  return (
    <div className="min-h-screen ">
      <div className="w-full max-w-[480px] mx-auto bg-white shadwo-xl">
        <div className="px-5 pt-5 pb-3 border-b border-gray-100 flex item-center gap-3">
          <h1 className="text-xl font-bold">회원가입</h1>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
