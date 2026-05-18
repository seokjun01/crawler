//로그인 된 유저 정보를 저장하는 Context
// 유저 인증 상태는 앱 전체에서 사용되어야 함

import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// 이 컴포넌트로 감싼 하위 컴포넌트들은 전부 유저 정보 접근 가능
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userInfo) => setUser(userInfo);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 커스텀 훅 ( Authcontext.Provider로 감싸지 않은 곳에서 쓰면 예외 던짐)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider 밖에서 useAuth 사용 불가 ");
  return context;
}
