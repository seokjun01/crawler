import { api } from "../../../shared/api";

export const randomRecommendApi = () => {
  return api("GET", `/api/places/recommend/random`);
};
/* 
export const personalRecommendApi = (exclude) => {
   let url = "/api/places/recommend"
   
    return api (
        
    )
}*/
