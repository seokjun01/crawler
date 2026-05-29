// 홈 페이지 (레이아웃 조립)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlaceList } from "../../features/places";
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
          setLocationLabel(response.data.title || "내 위치");
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
          <div>
            <button
              onClick={() => navigate("/location-edit")}
              className="p-2 text-gray-400 hover:text-black"
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.25 0C11.6712 0 12.0127 0.341478 12.0127 0.762712V1.93746C16.5645 2.30521 20.1948 5.93546 20.5625 10.4873H21.7373C22.1585 10.4873 22.5 10.8288 22.5 11.25C22.5 11.6712 22.1585 12.0127 21.7373 12.0127H20.5625C20.1948 16.5645 16.5645 20.1948 12.0127 20.5625V21.7373C12.0127 22.1585 11.6712 22.5 11.25 22.5C10.8288 22.5 10.4873 22.1585 10.4873 21.7373V20.5625C5.93546 20.1948 2.30521 16.5645 1.93746 12.0127H0.762712C0.341478 12.0127 0 11.6712 0 11.25C0 10.8288 0.341478 10.4873 0.762712 10.4873H1.93746C2.30521 5.93546 5.93546 2.30521 10.4873 1.93746V0.762712C10.4873 0.341478 10.8288 0 11.25 0ZM19.0311 10.4873H17.9237C17.5025 10.4873 17.161 10.8288 17.161 11.25C17.161 11.6712 17.5025 12.0127 17.9237 12.0127H19.0311C18.672 15.7215 15.7215 18.672 12.0127 19.0311V17.9237C12.0127 17.5025 11.6712 17.161 11.25 17.161C10.8288 17.161 10.4873 17.5025 10.4873 17.9237V19.0311C6.77852 18.672 3.82802 15.7215 3.46893 12.0127H4.57627C4.99751 12.0127 5.33898 11.6712 5.33898 11.25C5.33898 10.8288 4.99751 10.4873 4.57627 10.4873H3.46893C3.82802 6.77852 6.77852 3.82802 10.4873 3.46893V4.57627C10.4873 4.99751 10.8288 5.33898 11.25 5.33898C11.6712 5.33898 12.0127 4.99751 12.0127 4.57627V3.46893C15.7215 3.82802 18.672 6.77852 19.0311 10.4873Z"
                  fill="#212124"
                />
              </svg>
            </button>
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
    </div>
  );
}
