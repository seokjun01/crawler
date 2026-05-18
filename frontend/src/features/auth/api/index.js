// 백엔드  API 호출 담당

import { api } from "../../../shared/api";

export const loginApi = (email, password) => {
  return api("POST", "/api/auth/login", { email, password });
};

export const registerApi = (email, password, nickname, preferredCategories) => {
  return api("POST", "/api/users/register", {
    email,
    password,
    nickname,
    preferred_categories: preferredCategories.join(","),
  });
};

export const checkEmailApi = (email) => {
  return api("GET", `/api/users/check-email?email=${email}`);
};
