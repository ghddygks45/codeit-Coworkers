import TestIndex from "@/pages/test/TestIndex";
import TestGnb from "@/pages/test/TestGnb";
import TestButton from "@/pages/test/TestButton";
import TestBadge from "@/pages/test/TestBadge";
import TestTodo from "@/pages/test/TestTodo";
import TestCalendar from "@/pages/test/TestCalendar";
import TestInput from "@/pages/test/TestInput";
import TestToast from "@/pages/test/TestToast";
import TestChip from "@/pages/test/TestChip";
import TestDropdown from "@/pages/test/TestDropdown";
import TestListPage from "@/pages/ListPage/ListPage";
import TestModal from "@/pages/test/TestModal";
import TestTodayProgressSection from "@/pages/test/TestTodayProgressSection";
import TestErrorBoundary from "@/pages/test/TestErrorBoundary";
import TestTeamMemberSection from "@/pages/test/TestTeamMemberSection";
import TestTaskColumn from "@/pages/test/TestTaskColumn";

export const testRoutes = [
  {
    path: "/test",
    element: <TestIndex />,
  },
  {
    path: "/test/gnb",
    element: <TestGnb />,
  },
  {
    path: "/test/button",
    element: <TestButton />,
  },
  {
    path: "/test/badge",
    element: <TestBadge />,
  },
  {
    path: "/test/chip",
    element: <TestChip />,
  },
  {
    path: "/test/todo",
    element: <TestTodo />,
  },
  {
    path: "/test/calendar",
    element: <TestCalendar />,
  },
  {
    path: "/test/input",
    element: <TestInput />,
  },
  {
    path: "/test/toast",
    element: <TestToast />,
  },
  {
    path: "/test/dropdown",
    element: <TestDropdown />,
  },
  {
    path: "/test/list-page",
    element: <TestListPage />,
  },
  {
    path: "/test/modal",
    element: <TestModal />,
  },
  {
    path: "/test/todayprogresssection",
    element: <TestTodayProgressSection />,
  },
  {
    path: "/test/error-boundary",
    element: <TestErrorBoundary />,
  },
  {
    path: "/test/team-member-section",
    element: <TestTeamMemberSection />,
  },
  {
    path: "/test/task-column",
    element: <TestTaskColumn />,
  },
];
