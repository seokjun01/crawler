import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateRoom } from "../api/queries";

const roomSchema = z.object({
  title: z.string().trim().min(1, "방 제목을 입력해주세요."),
  maxMembers: z.number().min(2).max(5),
});

export function ChatRoomCreate({ onClose, onCreated }) {
  const [error, setError] = useState("");
  const { mutate: createRoom, isPending: loading } = useCreateRoom();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: { title: "", maxMembers: 4 },
  });

  const maxMembers = watch("maxMembers");

  const onSubmit = ({ title, maxMembers }) => {
    createRoom(
      { title, maxMembers },
      {
        onSuccess: (res) => {
          if (res.data.success) {
            onCreated();
          } else {
            setError(res.data.message);
          }
        },
        onError: () => setError("방 생성 중 오류가 발생했습니다."),
      },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-5">
      <div className="bg-white w-full rounded-2xl px-5 py-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="h2-semi">방 만들기</h2>
          <button onClick={onClose} className="text-muted text-xl">
            ✕
          </button>
        </div>

        {error && <p className="text-error body3 mb-2">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="방 제목 (예: 12시 삼성역 순대국 같이 먹어요)"
            {...register("title")}
            className="w-full border border-input rounded-lg px-4 py-3 body3 outline-none focus:border-black mb-1"
          />
          {errors.title && (
            <p className="text-error caption1 mb-3">{errors.title.message}</p>
          )}
          <div className="flex items-center gap-3 mb-6 mt-3">
            <span className="body3 text-secondary">최대 인원</span>
            {[2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setValue("maxMembers", n)}
                className={`w-10 h-10 rounded-full body3 border ${
                  maxMembers === n
                    ? "bg-primary text-white border-primary-light"
                    : "border-input"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-xl py-4 h2-semi disabled:opacity-50"
          >
            {loading ? "생성 중..." : "만들기"}
          </button>
        </form>
      </div>
    </div>
  );
}
