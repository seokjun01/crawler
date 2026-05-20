import { useNavigate } from "react-router-dom";
import { LocationForm } from "../../features/location";

export default function LocationEditPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="text-xl">
          ←
        </button>
        <h1 className="text-lg font-bold">내 위치 설정</h1>
      </div>
      <LocationForm mode="edit" />
    </div>
  );
}
