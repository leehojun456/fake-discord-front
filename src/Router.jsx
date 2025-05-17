import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DefaultLayout from "./layouts/DefaultLayout";
import FriendsPage from "./pages/FriendsPage";
import LibraryPage from "./pages/LibraryPage";
import NitroPage from "./pages/NitroPage";
import ShopPage from "./pages/ShopPage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./routes/PrivateRoute";
import FriendsChatPage from "./pages/FriendsChatPage";
import SettingsPage from "./pages/SettingsPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/landingPage";

export const router = createBrowserRouter([
  // "/" 경로에서만 랜딩 페이지 보여주기 (레이아웃 없이)
  {
    path: "/",
    element: <LandingPage />,
  },
  // 로그인 후 사용하는 레이아웃 기반의 라우트
  {
    path: "/",
    element: <DefaultLayout />, // 레이아웃 적용되는 라우트들
    children: [
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "channels/@me",
            element: <FriendsPage />,
          },
          {
            path: "channels/@me/:channelId",
            element: <FriendsChatPage />,
          },
          {
            path: "library",
            element: <LibraryPage />,
          },
          {
            path: "nitro",
            element: <NitroPage />,
          },
          {
            path: "shop",
            element: <ShopPage />,
          },
        ],
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "settings",
    element: <SettingsPage />,
  },
]);
