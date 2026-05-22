// app 레이어는 앱 전체에 딱 한 번만 설정하는 것들이 들어간다. 전역 설정
import { createBrowserRouter } from "react-router-dom";
import { useAuth } from "./AuthContext";
import SplashPage from "../pages/splash";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import VerifyEmailPage from "../pages/verify-email";
import LocationRegisterPage from "../pages/location-register";
import LocationEditPage from "../pages/location-edit";
import HomePage from "../pages/home";
import PlaceDetailPage from "../pages/place-detail";
import MyPage from "../pages/mypage";
import VisitsPage from "../pages/mypage/visits";
import FavoritesPage from "../pages/mypage/favorites";
import RecommendPage from "../pages/recommend";
import RecommendResultPage from "../pages/recommend-result";
import RecommendExcludePage from "../pages/recommend-exclude";

const router = createBrowserRouter([
  //URL경로랑 컴포넌트를 연결하는 테이블
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/splash",
    element: <SplashPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
  {
    path: "/location-register",
    element: <LocationRegisterPage />,
  },
  {
    path: "/location-edit",
    element: <LocationEditPage />,
  },
  {
    path: "/mypage/visits",
    element: <VisitsPage />,
  },
  {
    path: "/mypage/favorites",
    element: <FavoritesPage />,
  },
  {
    path: "/mypage",
    element: <MyPage />,
  },
  {
    path: "/places/:kakaoPlaceId",
    element: <PlaceDetailPage />,
  },
  {
    path: "/recommend",
    element: <RecommendPage />,
  },
  {
    path: "/recommend/result",
    element: <RecommendResultPage />,
  },
  {
    path: "/recommend/exclude",
    element: <RecommendExcludePage />,
  },
]);

export default router;
