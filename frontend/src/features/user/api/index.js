import { api } from "../../../shared/api";

export const visitListApi = () => {
  return api("GET", "/api/users/visit");
};

export const logoutApi = () => {
  return api("POST", "/api/auth/logout");
};

export const updateCategoriesApi = () => {
  return api("POST", "/api/users/categories", {
    preferred_categories: categories,
  });
};
