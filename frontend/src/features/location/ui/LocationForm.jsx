// 카카오 API 로 위치설정 폼
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { locationSaveApi, locationUpdateApi } from "../api";

export function LocationForm({ mode = "register" }) {
  const [roadAddress, setRoadAddress] = useState("");
  const [jibunAddress, setJibunAddress] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // 카카오 지도/마커 인스턴스는 리렌더링마다 새로 만들면 안 되니까 ref로 보관
  const mapContainerRef = useRef(null); // 지도를 렌더링할 DOM 요소 참조
  const kakaoMapRef = useRef(null); // 카카오 지도 인스턴스 보관
  const markerRef = useRef(null); // 카카오 마커 인스턴스 보관

  const navigate = useNavigate();

  const buttonLabel = mode === "register" ? "위치 등록하기" : "확인";
  const submitApi = mode === "register" ? locationSaveApi : locationUpdateApi;

  // 지도 초기화는 한 번만 하면 되니까 []
  useEffect(() => {
    if (!window.kakao || !mapContainerRef.current) return;

    window.kakao.maps.load(() => {
      const options = {
        // LatLng(위도, 경도) → 지도 디폴트값은 서울 시청
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 5, // 확대 레벨
      };

      // 지도 인스턴스 생성 후 ref에 저장
      const map = new window.kakao.maps.Map(mapContainerRef.current, options);
      kakaoMapRef.current = map;

      // 마커 인스턴스 생성 후 ref에 저장
      const marker = new window.kakao.maps.Marker({
        position: options.center,
      });
      marker.setMap(map); // 지도에 마커 표시
      markerRef.current = marker;

      // 지도 클릭 이벤트
      // mouseEvent.latLng: 클릭한 위치의 LatLng 객체
      window.kakao.maps.event.addListener(map, "click", (mouseEvent) => {
        const latlng = mouseEvent.latLng;

        // 클릭한 위치로 마커 이동
        markerRef.current.setPosition(latlng);

        // 좌표 → 주소 변환 (Geocoder는 SDK에서 services 라이브러리 필요)
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(
          latlng.getLng(), // 경도 먼저
          latlng.getLat(), // 위도
          (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              // road_address: 도로명 (없을 수 있음) / address: 지번 (항상 있음)
              const addr = result[0].road_address
                ? result[0].road_address.address_name
                : result[0].address.address_name;

              // 여기서 처음으로 모양이 결정됨
              // latitude, longitude 키 이름은 내가 정한 것 → 백엔드 파라미터명과 일치시킴
              setSelectedLocation({
                latitude: latlng.getLat(),
                longitude: latlng.getLng(),
                address: addr,
              });
            }
          },
        );
      });
    });
  }, []); // 마운트 시 한 번만

  // 주소 입력 → 지도 이동
  const handleAddressSearch = () => {
    const query = roadAddress || jibunAddress;
    if (!query || !window.kakao) return;

    const geocoder = new window.kakao.maps.services.Geocoder();

    // addressSearch: 주소 문자열 → 좌표 변환
    geocoder.addressSearch(query, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // result[0].y → 위도 / result[0].x → 경도 (카카오가 문자열로 줌)
        const lat = parseFloat(result[0].y);
        const lng = parseFloat(result[0].x);
        const latlng = new window.kakao.maps.LatLng(lat, lng);

        kakaoMapRef.current.setCenter(latlng); // 지도 중심 이동
        markerRef.current.setPosition(latlng); // 마커 이동

        // selectedLocation 업데이트
        setSelectedLocation({
          latitude: lat,
          longitude: lng,
          address: result[0].address_name,
        });
        setError("");
      } else {
        setError("주소를 찾을 수 없습니다.");
      }
    });
  };

  const handleSubmit = async () => {
    if (!selectedLocation) {
      setError("위치를 선택해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const title = detail || "내 위치";
      const response = await submitApi(
        // 내가 정한 키로 꺼냄 (setSelectedLocation에서 담은 키와 동일)
        selectedLocation.latitude,
        selectedLocation.longitude,
        title,
      );
      if (response.data.success) {
        navigate(mode === "register" ? "/" : "/mypage");
      } else {
        setError(response.data.message);
      }
    } catch (e) {
      setError("위치 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div ref={mapContainerRef} className="w-full h-52" />
      <div className="px-5 py-5 flex flex-col gap-4">
        <h3 className="text-base font-bold">직접 입력하기</h3>

        <div>
          <label className="text-sm font-semibold mb-1 block">
            도로명주소 입력
          </label>
          <input
            type="text"
            placeholder="예: 서울특별시 중구 세종대로 110"
            value={roadAddress}
            onChange={(e) => {
              setRoadAddress(e.target.value);
              setJibunAddress("");
            }}
            // onBlur: 포커스 벗어날 때 검색 실행
            onBlur={handleAddressSearch}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black"
          />
          <p className="text-xs text-gray-400 mt-1">
            정확한 주소를 입력하면 더 정확한 위치 안내가 가능해요.
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold mb-1 block">
            지번주소 입력
          </label>
          <input
            type="text"
            placeholder="예: 서울특별시 중구 태평로1가 31"
            value={jibunAddress}
            onChange={(e) => {
              setJibunAddress(e.target.value);
              setRoadAddress("");
            }}
            onBlur={handleAddressSearch}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black"
          />
          <p className="text-xs text-gray-400 mt-1">
            도로명주소가 어렵다면 지번으로 입력할 수 있어요.
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold mb-2">검색 결과</h3>
          {!selectedLocation ? (
            <p className="text-sm text-gray-400">
              입력 또는 지도 선택 결과가 표시됩니다
            </p>
          ) : (
            <div className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span>📌</span>
                <div>
                  <p className="text-xs text-gray-400">주소</p>
                  <p className="text-sm font-medium">
                    {selectedLocation.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span>🗺️</span>
                <input
                  type="text"
                  placeholder="예: 1층 / 출입구 기준"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  className="flex-1 text-sm outline-none border-b border-gray-200 py-1"
                />
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>

      {/* 하단 버튼 */}
      <div className="mt-auto px-5 pb-8 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 border border-black text-black rounded-xl py-4 text-base font-semibold"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-black text-white rounded-xl py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "저장 중..." : buttonLabel}
        </button>
      </div>
    </div>
  );
}
