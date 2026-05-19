// 홈 페이지 (레이아웃 조립)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlaceList } from "../../features/places";
import { BottomNav } from "../../shared/ui/BottomNav";
import { locationGetApi } from "../../features/location";

export default function HomePage() {
  const [location, setLocation] = useState(null);
  const [locationLabel, setLocationLabel] = useState("위치 불러오는 중...");

  const navigate = useNavigate();

  // 마운트 시 저장된 위치 불러오기
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await locationGetApi();
        if (response.data.latitude) {
          setLocation({
            latitude: response.data.latitude,
            longitude: response.data.longitude,
          });
          setLocationLabel(response.data.title || "내 위치");
        } else {
          navigate("/location-register");
        }
      } catch (e) {
        navigate("/location-register");
      }
    };
    fetchLocation();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white z-40 px-5 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">현재 위치</p>

            <p className="text-sm font-bold">{locationLabel}</p>
          </div>
          {/* 돋보기 버튼 — 추후 검색 기능 연결 */}
          <button className="text-xl">🔍</button>
        </div>
      </div>

      {/* ── 식당 목록 + 필터 ── */}
      {/* location 있을 때만 렌더링 */}
      {location && (
        <PlaceList
          latitude={location.latitude}
          longitude={location.longitude}
        />
      )}
      <BottomNav />
    </div>
  );
}
