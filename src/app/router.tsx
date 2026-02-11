import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import User from "@/pages/User";
import Boards from "@/pages/Boards";
import BoardDetail from "@/pages/BoardDetail";
import BoardWrite from "@/pages/BoardWrite";
import NotFound from "@/pages/NotFound";
import { testRoutes } from "./testRoutes";
import Layout from "@/components/layout/Layout";
import { GlobalErrorFallback } from "@/providers/boundary";
import Index from "@/pages/Index";
import LoginPage from "@/pages/Login";
import ResetPasswordPage from "@/pages/ResetPassword";
import RootLayout from "@/components/common/Rootlayout/RootLayout";
import Team from "@/pages/team";
import MyHistory from "@/pages/MyHistory";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <GlobalErrorFallback />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "/index",
        element: <Index />,
      },
      {
        path: "/user/:id",
        element: <User />,
      },
      ...testRoutes,
      {
        element: <Layout />,
        children: [
          { path: "/user", element: <User /> },
          { path: "/team", element: <Team /> },
          { path: "/team/:id", element: <Team /> },
          { path: "/boards", element: <Boards /> },
          { path: "/boards/write", element: <BoardWrite /> },
          { path: "/boards/:articleId", element: <BoardDetail /> },
          { path: "/my-history", element: <MyHistory /> },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
