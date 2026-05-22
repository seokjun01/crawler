import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/AuthContext";
import { getRoomsApi, joinRoomApi } from "../api";
import { ChatRoomCreate } from "./ChatRoomCreate";

export function ChatRoomList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);

    try {
      const res = await getRoomsApi();
      setRooms(res.data?.rooms?.block1 || []);
    } catch {
      setError("채팅방 목록을 불러오는데 실패하였습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleJoin = async (roomId) => {
    try {
      const res = await joinRoomApi(roomId);
      if (res.data.success) {
        navigate(`/chat/${roomId}`);
      } else {
        setError(res.data.message);
      }
    } catch {
      setError("입장 중 오류가 발생하였습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h1 className="text-lg font-semibold">같이먹기</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-black text-white text-sm px-4 py-2 rounded-lg"
        >
          방 만들기
        </button>
      </div>

      {error && <p className="text-red-500 text-sm px-5 py-2">{error}</p>}

      {showCreate && (
        <ChatRoomCreate
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            fetchRooms();
          }}
        />
      )}

      <ul>
        {rooms.map((room) => (
          <li
            key={room.room_id}
            className="px-5 py-4 border-b active:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{room.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {room.host_nickname} · {room.current_members}/
                  {room.max_members}명
                </p>
              </div>
              {room.status === "OPEN" ? (
                <button
                  onClick={() => handleJoin(room.room_id)}
                  className="text-sm border border-black rounded-lg px-3 py-1"
                >
                  입장
                </button>
              ) : (
                <span className="text-xs text-gray-400">마감</span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {!loading && rooms.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-20">
          아직 열린 방이 없어요
        </p>
      )}
    </div>
  );
}
