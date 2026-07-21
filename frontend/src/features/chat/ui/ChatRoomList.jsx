import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../app/authStore";
import { useRooms, useJoinRoom, useDeleteRoom } from "../api/queries";
import { ChatRoomCreate } from "./ChatRoomCreate";

export function ChatRoomList() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: rooms = [], isLoading: loading } = useRooms();
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const { mutate: joinRoom } = useJoinRoom();
  const { mutate: deleteRoom } = useDeleteRoom();

  const handleJoin = async (roomId) => {
    joinRoom(roomId, {
      onSuccess: (res) => {
        if (res.data.success) {
          navigate(`/chat/${roomId}`);
        } else {
          setError(res.data.message);
        }
      },
      onError: () => setError("입장 중 오류가 발생하였습니다."),
    });
  };

  const handleDelete = (roomId) => {
    deleteRoom(roomId, {
      onSuccess: (res) => {
        if (!res.data.success) {
          setError(res.data.message);
        }
      },
      onError: () => setError("방 삭제 중 오류가 발생했습니다."),
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="flex items-center justify-between px-5 py-4 border-b border-primary-light">
        <h1 className="text-heading  -ml-2 text-primary font-bold">
          채팅방 목록{" "}
        </h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-primary text-white body3 px-4 py-2 rounded-lg"
        >
          방 만들기
        </button>
      </div>

      {error && <p className="text-error body3 px-5 py-2">{error}</p>}

      {showCreate && (
        <ChatRoomCreate
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
          }}
        />
      )}

      <ul>
        {rooms.map((room) => (
          <li
            key={room.room_id}
            className="px-5 py-4 border-b border-primary-light active:bg-hover"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium  text-primary body3">{room.title}</p>
                <p className="caption1 text-muted mt-1">
                  {room.host_nickname} · {room.current_members}/
                  {room.max_members}명
                </p>
              </div>
              <div className="flex items-center gap-2">
                {String(user?.userId) === String(room.host_user_id) && (
                  <button
                    onClick={() => handleDelete(room.room_id)}
                    className="caption1 text-danger border border-red-300 rounded-lg px-3 py-1"
                  >
                    삭제
                  </button>
                )}
                {room.status === "OPEN" ? (
                  <button
                    onClick={() => handleJoin(room.room_id)}
                    className="body3 bg-primary text-primary-cream rounded-lg px-3 py-1"
                  >
                    입장
                  </button>
                ) : (
                  <span className="caption1 text-muted">마감</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {!loading && rooms.length === 0 && (
        <p className="text-center text-muted body3 mt-20">
          아직 열린 방이 없어요
        </p>
      )}
    </div>
  );
}
