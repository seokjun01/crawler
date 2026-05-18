// 백엔드  API 호출 담당

import { api } from "../../../shared/api";

export const loginApi = (email, password) => {
  return api("POST", "/api/auth/login", { email, password });
};
