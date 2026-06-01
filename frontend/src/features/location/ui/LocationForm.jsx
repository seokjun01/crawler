// 카카오 API 로 위치설정 폼
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { locationSaveApi, locationUpdateApi } from "../api";

export function LocationForm({ mode = "register" }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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

  // 장소명·상호명·주소로 키워드 검색
  const handleAddressSearch = () => {
    if (!query || !window.kakao) return;

    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(query, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(result);
        setError("");
      } else {
        setSearchResults([]);
        setError("검색 결과가 없습니다.");
      }
    });
  };

  const handleSelectResult = (item) => {
    const lat = parseFloat(item.y);
    const lng = parseFloat(item.x);
    const latlng = new window.kakao.maps.LatLng(lat, lng);

    kakaoMapRef.current.setCenter(latlng);
    markerRef.current.setPosition(latlng);

    const addr = item.road_address_name || item.address_name;
    setSelectedLocation({
      latitude: lat,
      longitude: lng,
      address: addr,
      placeName: item.place_name,
    });
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    if (!selectedLocation) {
      setError("위치를 선택해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const title = selectedLocation.address
        ? detail
          ? `${selectedLocation.address} (${detail})`
          : selectedLocation.address
        : detail || "내 위치";
      const response = await submitApi(
        // 내가 정한 키로 꺼냄 (setSelectedLocation에서 담은 키와 동일)
        selectedLocation.latitude,
        selectedLocation.longitude,
        title,
      );
      if (response.data.success) {
        if (mode === "register" || "edit") {
          navigate("/");
        }
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
        <h3 className="h2">직접 입력하기</h3>
        <h3 className="h2">주소 검색</h3>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="장소명, 상호명 또는 주소 입력"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddressSearch()}
            className="flex-1 border border-input rounded-lg px-4 py-3 body3 outline-none focus:border-black"
          />
          <button
            onClick={handleAddressSearch}
            className="bg-black text-white rounded-lg px-4 btn1"
          >
            검색
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="border border-input rounded-lg overflow-hidden">
            {searchResults.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectResult(item)}
                className="w-full text-left px-4 py-3 body3 border-b border-line last:border-b-0 hover:bg-hover"
              >
                <p className="font-medium">{item.place_name}</p>
                <p className="caption1 text-secondary mt-0.5">
                  {item.road_address_name || item.address_name}
                </p>
                {item.road_address_name && (
                  <p className="caption1 text-muted">
                    지번: {item.address_name}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}

        <div>
          <h3 className="text-base font-bold mb-2">검색 결과</h3>
          {!selectedLocation ? (
            <p className="sub1 text-muted">
              입력 또는 지도 선택 결과가 표시됩니다
            </p>
          ) : (
            <div className="border border-input rounded-lg p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span>📌</span>
                <div>
                  {selectedLocation.placeName && (
                    <p className="btn1">
                      {selectedLocation.placeName}
                    </p>
                  )}
                  <p className="caption1 text-muted">주소</p>
                  <p className="body2">
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
                  className="flex-1 text-sm outline-none border-b border-input py-1"
                />
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-error caption1">{error}</p>}
      </div>

      {/* 하단 버튼 */}
      <div className="mt-auto px-5 pb-8 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 border border-primary-middle text-primary-middle rounded-xl py-4 h2-semi"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-primary text-white rounded-xl py-4 h2-semi disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "저장 중..." : buttonLabel}
        </button>
      </div>
    </div>
  );
}
