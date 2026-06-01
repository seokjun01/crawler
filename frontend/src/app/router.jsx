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
import ChatPage from "../pages/chat";
import ChatRoomPage from "../pages/chat-room";
import { TopNav } from "../shared/ui/TopNav";
import { BottomNav } from "../shared/ui/BottomNav";

import { Outlet } from "react-router-dom"; // 2번째 줄 import에 Outlet 추가

function MainLayout() {
  return (
    <>
      <TopNav />
      <div className="mx-auto max-w-screen-xl">
        <Outlet />
      </div>
      <BottomNav />
    </>
  );
}

const router = createBrowserRouter([
  // 네비 없는 페이지
  { path: "/splash", element: <SplashPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/verify-email", element: <VerifyEmailPage /> },
  { path: "/location-register", element: <LocationRegisterPage /> },
  { path: "/location-edit", element: <LocationEditPage /> },
  { path: "/chat/:roomId", element: <ChatRoomPage /> },

  // 네비 있는 페이지
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/places/:kakaoPlaceId", element: <PlaceDetailPage /> },
      { path: "/mypage", element: <MyPage /> },
      { path: "/mypage/visits", element: <VisitsPage /> },
      { path: "/mypage/favorites", element: <FavoritesPage /> },
      { path: "/recommend", element: <RecommendPage /> },
      { path: "/recommend/result", element: <RecommendResultPage /> },
      { path: "/recommend/exclude", element: <RecommendExcludePage /> },
      { path: "/chat", element: <ChatPage /> },
    ],
  },
]);

export default router;
