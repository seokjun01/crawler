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
          const lat = parseFloat(response.data.latitude);
          const lng = parseFloat(response.data.longitude);
          setLocation({ latitude: lat, longitude: lng });

          // 카카오 역지오코딩으로 도로명주소 변환
          window.kakao.maps.load(() => {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2Address(lng, lat, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const addr = result[0].road_address
                  ? result[0].road_address.address_name
                  : result[0].address.address_name;
                setLocationLabel(addr);
              } else {
                setLocationLabel(response.data.title || "내 위치");
              }
            });
          });
        } else {
          navigate("/splash");
        }
      } catch (e) {
        navigate("/splash");
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
