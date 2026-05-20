import { api } from "../../../shared/api";

export const nearbyApi = (latitude, longitude, radius, category = "") => {
  let url = `/api/places/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
  if (category) url += `&category=${category}`;
  return api("GET", url);
};

export const placeDetailApi = (kakaoPlaceId, placeName) => {
  return api(
    "GET",
    `/api/places/${kakaoPlaceId}?placeName=${encodeURIComponent(placeName)}`,
  );
};

export const reviewGetApi = (kakaoPlaceId) => {
  return api("GET", `/api/places/${kakaoPlaceId}/reviews`);
};

export const reviewSaveApi = (
  kakaoPlaceId,
  placeName,
  categoryName,
  rating,
  content,
) => {
  return api("POST", `/api/places/${kakaoPlaceId}/reviews`, {
    place_name: placeName,
    category_name: categoryName,
    menu_name: "",
    rating,
    content,
  });
};

export const reviewUpdateApi = (
  kakaoPlaceId,
  visitHistoryId,
  menuName,
  rating,
  content,
) => {
  return api("POST", `/api/places/${kakaoPlaceId}/reviews/update`, {
    visit_history_id: visitHistoryId,
    menu_name: menuName,
    rating,
    content,
  });
};

export const reviewDeleteApi = (kakaoPlaceId, visitHistoryId) => {
  return api("POST", `/api/places/${kakaoPlaceId}/reviews/delete`, {
    visit_history_id: visitHistoryId,
  });
};
