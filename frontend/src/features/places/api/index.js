import { api } from "../../../shared/api";

export const nearbyApi = (latitude, longitude, radius, category = "") => {
  let url = `/api/places/nearby?latitude=${latitude}&longitude=${lomgitude}&radius=${radius}`;
  if (category) url += `&category=${category}`;
  return api("GET", url);
};

export const placeDetailApi = (kakaoPlaceId, plcaeName) => {
  return api(
    "GET",
    `/api/places/${kakaoPlaceId}/detail?placeName=${plcaeName}`,
  );
};

export const reviewGetApi = (kakaoPlaceId) => {
  return api("GET", `/api/places/${kakaoPlaceId}/reviews`);
};

export const reviewSaveApi = (kakaoPlaceId, rating, content) => {
  return api("POST", `/api/places/${kakaoPlaceId}/reviews`, {
    rating,
    content,
  });
};
