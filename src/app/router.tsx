import { createBrowserRouter } from "react-router-dom";
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
import RootLayout from "@/components/layout/RootLayout";
import KakaoRedirectPage from "@/pages/KakaoRedirectPage";
import Team from "@/pages/team";
import MyHistory from "@/pages/MyHistory";
import JoinTeam from "@/pages/JoinTeam";
import AddTeam from "@/pages/AddTeam";
import EditTeam from "@/pages/EditTeam";
import MySettings from "@/pages/MySettings";
import ListPage from "@/pages/ListPage/ListPage";
import SignupPage from "@/pages/Signup";
import TaskListDetail from "@/features/Tasks/components/TaskListDetail";
import withAuth from "@/hoc/withAuth";
import withLoggedInRedirect from "@/hoc/withLoggedInRedirect";

// 보호 페이지: 로그인 필요
const ProtectedTeam = withAuth(Team);
const ProtectedEditTeam = withAuth(EditTeam);
const ProtectedMyHistory = withAuth(MyHistory);
const ProtectedJoinTeam = withAuth(JoinTeam);
const ProtectedAddTeam = withAuth(AddTeam);
const ProtectedBoards = withAuth(Boards);
const ProtectedBoardWrite = withAuth(BoardWrite);
const ProtectedBoardDetail = withAuth(BoardDetail);
const ProtectedMySettings = withAuth(MySettings);
const ProtectedListPage = withAuth(ListPage);

// 로그인 상태면 /team으로 리다이렉트
const GuestLoginPage = withLoggedInRedirect(LoginPage);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <GlobalErrorFallback />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      ...(import.meta.env.DEV ? testRoutes : []),
      {
        element: <Layout />,
        children: [
          {
            path: "login",
            children: [
              { index: true, element: <GuestLoginPage /> },
              { path: "kakao", element: <KakaoRedirectPage /> },
            ],
          },
          { path: "reset-password", element: <ResetPasswordPage /> },
          { path: "signup", element: <SignupPage /> },
          {
            path: "team",
            children: [
              { index: true, element: <ProtectedTeam /> },
              { path: ":id", element: <ProtectedTeam /> },
              { path: ":id/edit", element: <ProtectedEditTeam /> },
              { path: ":id/my-history", element: <ProtectedMyHistory /> },
              { path: "join", element: <ProtectedJoinTeam /> },
              { path: "add", element: <ProtectedAddTeam /> },
            ],
          },
          {
            path: "boards",
            children: [
              { index: true, element: <ProtectedBoards /> },
              { path: "write", element: <ProtectedBoardWrite /> },
              { path: ":articleId", element: <ProtectedBoardDetail /> },
            ],
          },
          { path: "my-settings", element: <MySettings /> },
          {
            path: "team/:teamId/tasklists",
            element: <ListPage />,
            children: [
              { index: true, element: null },
              { path: ":listId", element: null },
              { path: ":listId/tasks/:taskId", element: <TaskListDetail /> },
            ],
          },
          { path: "my-settings", element: <ProtectedMySettings /> },
          { path: "list", element: <ProtectedListPage /> },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
