import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // 세션 복원 완료 전까지 렌더링 블록
  const [ready, setReady] = useState(false);

  // 마운트 시 세션 복원
  useEffect(() => {
    axios
      .get("/api/auth/me", { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setUser({
            userId: res.data.userId,
            nickname: res.data.nickname,
            email: res.data.email,
            preferredCategories: res.data.preferredCategories,
          });
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const login = (userInfo) => setUser(userInfo);
  const logout = () => setUser(null);

  // 세션 확인 전엔 아무것도 렌더링 안 함
  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider 밖에서 useAuth 사용 불가");
  return context;
}
