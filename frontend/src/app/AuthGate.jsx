import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { meApi } from "../features/auth/api";
import { useAuthStore } from "./authStore";

export function AuthGate({ children }) {
  const login = useAuthStore((state) => state.login); // state => 이런식으로 가져옴으로써
  // 필요한 함수만 가져오고 , 불필요한 리렌더를 막는다

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await meApi();
      return res.data;
    },
  });

  useEffect(() => {
    if (isSuccess && data?.success) {
      login({
        userId: data.userId,
        nickname: data.nickname,
        email: data.email,
        preferredCategories: data.preferredCategories,
      });
    }
  }, [isSuccess, data, login]);

  if (isLoading) return null;

  return children;
}
