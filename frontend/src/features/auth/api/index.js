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

export const resendVerificationEmailApi = (email) => {
  return api("POST", "/api/users/resend-verification-email", { email });
};

export const locationSaveApi = (latitude, longitude, title = "내 위치") => {
  return api("POST", "/api/users/location-save", {
    title,
    latitude,
    longitude,
  });
};

export const locationUpdateApi = (latitude, longitude, title = "내 위치") => {
  return api("POST", "/api/users/location-update", {
    title,
    latitude,
    longitude,
  });
};

export const locationGetApi = () => {
  return api("GET", "/api/users/location-get");
};
