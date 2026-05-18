/* 모든 API 호출 공통 설정 파일 */

import axios from "axios";

// axios 인스턴스 생성으로 proxy로 처리
const instance = axios.create({
  withCredentials: true,
});

// 세션 만료 시 자동으로 로그인 페이지 이동
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

//공통 API 호출 함수
export const api = (method, url, params = {}) => {
  return instance({
    method,
    url,
    data: new URLSearchParams(params),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
