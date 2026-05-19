import { api } from "../../../shared/api";
export const locationSaveApi = (latitude, longitude, title = "내 위치") => {
  return api("POST", "/api/users/location", {
    title,
    latitude,
    longitude,
  });
};

export const locationUpdateApi = (latitude, longitude, title = "내 위치") => {
  return api("POST", "/api/users/location/update", {
    title,
    latitude,
    longitude,
  });
};

export const locationGetApi = () => {
  return api("GET", "/api/users/location");
};
