import { api } from "../../../shared/api";

export const visitListApi = () => {
  return api("GET", "/api/users/visits/group");
};

export const visitDetailApi = (kakaoPlaceId) => {
  return api("GET", `/api/users/visits/${kakaoPlaceId}`);
};

export const logoutApi = () => {
  return api("POST", "/api/auth/logout");
};

export const updateCategoriesApi = (categories) => {
  return api("POST", "/api/users/categories", {
    preferred_categories: categories,
  });
};

export const updateNicknameApi = (nickname) => {
  return api("POST", "/api/users/nickname", { nickname });
};
