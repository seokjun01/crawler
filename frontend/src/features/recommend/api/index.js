import { api } from "../../../shared/api";

export const randomRecommendApi = () => {
  return api("GET", `/api/places/recommend/random`);
};

export const visitSaveApi = (kakaoPlaceId, placeName, categoryName) => {
  return api("POST", `/api/users/visits`, {
    kakao_place_id: kakaoPlaceId,
    place_name: placeName,
    category_name: categoryName?.replace(/>/g, "").replace(/\s+/g, " ").trim(),
    rating: 0,
    content: "",
  });
};
/* 
export const personalRecommendApi = (exclude) => {
   let url = "/api/places/recommend"
   
    return api (
        
    )
}*/
