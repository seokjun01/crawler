import { LocationForm } from "../../features/location";

export default function LocationRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="px-5 py-4 border-b border-gray-100">
        <h1 className="text-lg font-bold">내 위치 설정</h1>
      </div>
      {/* mode="register" → locationSaveApi + 버튼 "위치 등록하기" */}
      <LocationForm mode="register" />
    </div>
  );
}
