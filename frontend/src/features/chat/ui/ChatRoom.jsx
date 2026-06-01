import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../app/AuthContext";
import {
  getMessagesApi,
  leaveRoomApi,
  deleteRoomApi,
  getRoomInfoApi,
  saveMessageApi,
} from "../api";

export function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [roomInfo, setRoomInfo] = useState(null);
  const [error, setError] = useState("");
  const wsRef = useRef(null);
  const bottomRef = useRef(null);

  //이전 메시지 + 방 정보 로드
  useEffect(() => {
    const init = async () => {
      try {
        const [msgRes, roomRes] = await Promise.all([
          getMessagesApi(roomId),
          getRoomInfoApi(roomId),
        ]);
        setMessages(msgRes.data?.messages?.block1 || []);
        setRoomInfo(roomRes.data?.room);
        setMessages((prev) => [
          ...prev,
          { type: "NOTIFY", message: `${user.nickname}님이 입장했습니다.` },
        ]);
      } catch {
        setError("채팅방 정보를 불러오지 못했습니다.");
      }
    };
    init();
  }, [roomId]);

  //웹소켓 연결
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8081/websocket");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "JOIN",
          roomId: Number(roomId),
          userId: Number(user.userId),
          nickname: user.nickname,
        }),
      );
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "ROOM_DELETED") {
        alert(data.message);
        navigate("/chat");
        return;
      }
      setMessages((prev) => [...prev, data]);
    };

    ws.onerror = () => setError("웹소켓 연결 에러 발생");
    return () => ws.close();
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || wsRef.current?.readyState !== WebSocket.OPEN) return;
    const message = input.trim();

    wsRef.current.send(
      JSON.stringify({
        type: "MESSAGE",
        roomId: Number(roomId),
        userId: Number(user.userId),
        nickname: user.nickname,
        message,
      }),
    );

    try {
      await saveMessageApi(roomId, message);
    } catch (e) {
      console.error("메시지 저장 실패", e);
    }

    setInput("");
  };

  const handleLeave = async () => {
    try {
      await leaveRoomApi(roomId);
      navigate("/chat");
    } catch {
      setError("퇴장 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteRoomApi(roomId);
      if (res.data.success) {
        // 삭제 성공 후 방 전체에 브로드캐스트
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "ROOM_DELETED",
              roomId: Number(roomId),
              userId: Number(user.userId),
              nickname: user.nickname,
              message: "방장에 의해 방이 삭제되었습니다.",
            }),
          );
        }
        navigate("/chat");
      }
    } catch {
      setError("방 삭제 중 오류가 발생했습니다.");
    }
  };

  const isHost = roomInfo && Number(user?.userId) === roomInfo.host_user_id;

  return (
    <div className="h-screen bg-white flex flex-col ">
      {/* 헤더 */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-primary-light ">
        <h1 className="text-heading  text-primary font-semibold truncate">
          {roomInfo?.title || "채팅방"}
        </h1>
        <div className="flex items-center gap-3">
          {isHost && (
            <button onClick={handleDelete} className="text-error body3">
              방 삭제
            </button>
          )}
          <button onClick={handleLeave} className="text-secondary body3">
            나가기
          </button>
        </div>
      </div>

      {error && <p className="text-error body3 px-5 py-2">{error}</p>}

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((msg, i) => {
          if (msg.type === "NOTIFY") {
            return (
              <div key={i} className="flex justify-center my-1">
                <span className="caption1 text-muted bg-subtle px-3 py-1 rounded-full">
                  {msg.message}
                </span>
              </div>
            );
          }
          const isMine =
            Number(msg.userId || msg.user_id) === Number(user?.userId);
          return (
            <div
              key={i}
              className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
            >
              {!isMine && (
                <span className="caption1 text-muted mb-1">
                  {msg.nickname}
                </span>
              )}
              <div
                className={`px-4 py-2 rounded-2xl body3 max-w-[70%] ${
                  isMine ? "bg-black text-white" : "bg-subtle text-black"
                }`}
              >
                {msg.message}
              </div>
              <span className="caption1 text-faint mt-1">
                {msg.sentAt || msg.sent_at}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div className="flex flex-shrink-0 items-center gap-2 px-4 py-3 border-t border-primary-light">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.nativeEvent.isComposing && handleSend()
          }
          placeholder="메시지를 입력하세요"
          className="flex-1 border border-input rounded-lg px-4 py-2 body3 outline-none focus:border-black"
        />
        <button
          onClick={handleSend}
          className="bg-black text-white bg-primary body3 px-4 py-2 rounded-lg"
        >
          전송
        </button>
      </div>
    </div>
  );
}
