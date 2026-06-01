import { LocationForm } from "../../features/location";

export default function LocationRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="px-5 py-4 border-b border-line">
        <h1 className="text-lg font-bold">내 위치 설정</h1>
      </div>
      <LocationForm mode="register" />
    </div>
  );
}
