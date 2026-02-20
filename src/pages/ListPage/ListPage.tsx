import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchClient, HttpError } from "@/lib/fetchClient";
import { BASE_URL } from "@/api/config";

import Modal from "@/components/common/Modal/Modal";
import ListCreateModal from "@/components/common/Modal/Contents/ListCreateModal";
import TaskCreateModal, {
  TaskData,
} from "@/components/common/Modal/Contents/TaskCreateModal";
import { WeeklyCalendar } from "./components/WeeklyCalendar";
import DatePagination from "./components/DatePagination";
import CalendarPicker from "./components/CalendarPicker";
import TaskCard from "./components/TaskCard";
import { TaskGroupCard } from "./components/TaskGroupCard";

import PlusIcon from "@/assets/plus_blue.svg";
import SettingsIcon from "@/assets/settings.svg";
import ArrowDown from "@/assets/arrow-down.svg";
import Loading from "@/assets/progress-ongoing.svg";
import LoadingDone from "@/assets/progress-done.svg";

import { useGroups } from "@/api/user";
import { useDeleteTaskList } from "@/api/tasklist";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  CreateTaskParams,
} from "@/api/task";
import { useToastStore } from "@/stores/useToastStore";
import { TaskServer } from "@/types/task";
import { GroupSummaryServer } from "@/types/group";

// --- 타입 정의 ---
interface TaskListResponse {
  id: number;
  name: string;
  displayIndex: number;
  tasks: TaskServer[];
}

interface UITask extends Omit<TaskServer, "name"> {
  title: string;
  isCompleted: boolean;
}

interface GroupDetailResponse {
  id: number;
  teamId: string;
  name: string;
  members: unknown[];
  taskLists: TaskListResponse[];
}

const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const KOREAN_WEEKDAY_TO_JS: Record<string, number> = {
  일: 0,
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
};

export default function ListPage() {
  const queryClient = useQueryClient();
  const { show: showToast } = useToastStore();

  const { teamId, listId, taskId } = useParams<{
    teamId: string;
    listId: string;
    taskId?: string;
  }>();

  const navigate = useNavigate();
  const isOpen = Boolean(taskId);
  const closePanel = () => navigate(`/team/${teamId}/tasklists/${listId}`);

  const selectedTeamId = Number(teamId);
  const urlListId = listId ? Number(listId) : null;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userSelectedListId, setUserSelectedListId] = useState<number | null>(
    null,
  );

  // ✅ 삭제 선택 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UITask | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // 1. 유저 팀 목록 정보
  const { data: groups = [] } = useGroups();
  const currentTeam = groups.find(
    (group: GroupSummaryServer) => group.id === selectedTeamId,
  );

  // 2. 그룹 할 일 목록 조회
  const { data: taskGroups = [], isLoading: isListLoading } = useQuery({
    queryKey: ["taskLists", selectedTeamId],
    queryFn: async () => {
      try {
        const data = await fetchClient<GroupDetailResponse>(
          `${BASE_URL}/groups/${selectedTeamId}`,
          {
            method: "GET",
          },
        );
        return data.taskLists ?? [];
      } catch (error: unknown) {
        if (error instanceof HttpError && error.status === 404) return [];
        throw error;
      }
    },
    enabled: !!selectedTeamId && !isNaN(selectedTeamId),
  });

  // 3. 현재 활성화된 리스트 ID 계산
  const currentListId =
    userSelectedListId ??
    (urlListId && urlListId > 0 ? urlListId : null) ??
    (taskGroups.length > 0 ? taskGroups[0].id : null);

  const dateParam = `${formatDateToYYYYMMDD(selectedDate)}T00:00:00Z`;

  // 4. 할 일 리스트 조회
  const { data: tasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks", currentListId, dateParam],
    queryFn: () => getTasks(selectedTeamId, currentListId!, dateParam),
    enabled: !!currentListId && !!selectedTeamId,
    select: (data: TaskServer[]): UITask[] =>
      data.map((task) => ({
        ...task,
        title: task.name,
        isCompleted: !!task.doneAt,
      })),
    staleTime: 1000 * 60,
  });

  // --- Mutations ---
  const createTaskMutation = useMutation({
    mutationFn: (data: { taskListId: number; body: CreateTaskParams }) => {
      return createTask(selectedTeamId, data.taskListId, data.body);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.taskListId, dateParam],
      });
      queryClient.invalidateQueries({
        queryKey: ["taskLists", selectedTeamId],
      });
      showToast("할 일이 추가되었습니다.");
      setIsTaskModalOpen(false);
    },
    onError: (error) => {
      if (error instanceof HttpError) {
        console.error("🔥 status:", error.status);
        console.error("🔥 server message:", error.data);
      } else {
        console.error("🔥 unknown error:", error);
      }
      showToast("할 일 추가에 실패했습니다.");
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, doneAt }: { id: number; doneAt: string | null }) =>
      updateTask(selectedTeamId, currentListId!, id, { done: !doneAt }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", currentListId, dateParam],
      });
      queryClient.invalidateQueries({
        queryKey: ["taskLists", selectedTeamId],
      });
    },
  });

  // ✅ 단일 할 일 삭제 (dateParam 포함 invalidate)
  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => deleteTask(selectedTeamId, currentListId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", currentListId, dateParam],
      });
      queryClient.invalidateQueries({
        queryKey: ["taskLists", selectedTeamId],
      });
      showToast("할 일이 삭제되었습니다.");
    },
    onError: (e) => {
      console.error(e);
      showToast("할 일 삭제에 실패했습니다.");
    },
  });

  const deleteRecurringMutation = useMutation({
    mutationFn: async ({
      taskId: targetTaskId,
      recurringId,
    }: {
      taskId: number;
      recurringId: number;
    }) => {
      if (!teamId) throw new Error("teamId is missing");
      if (!currentListId) throw new Error("currentListId is missing");

      await fetchClient<void>(
        `${BASE_URL}/groups/${selectedTeamId}/task-lists/${currentListId}/tasks/${targetTaskId}/recurring/${recurringId}`,
        { method: "DELETE" },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", currentListId, dateParam],
      });
      queryClient.invalidateQueries({
        queryKey: ["taskLists", selectedTeamId],
      });
      showToast("반복 할 일이 전체 삭제되었습니다.");
    },
    onError: (e) => {
      console.error(e);
      showToast("반복 할 일 삭제에 실패했습니다.");
    },
  });

  const { mutate: deleteList } = useDeleteTaskList(selectedTeamId);

  // --- Handlers ---
  const handleSelectList = (id: number) => {
    setUserSelectedListId(id);
    navigate(String(id));
  };

  const handleCreateTask = (data: TaskData) => {
    if (!currentListId) return;

    const name = data.title.trim();
    const description = data.description?.trim() || "";
    const startDate = data.startDate || new Date().toISOString();

    let payload: CreateTaskParams;

    // ✅ "한 번" / "반복 안함" → ONCE 명시
    if (
      !data.isRecurring ||
      data.repeatLabel === "한 번" ||
      data.repeatLabel === "반복 안함"
    ) {
      payload = {
        name,
        description,
        startDate,
        frequencyType: "ONCE",
      } as CreateTaskParams;
    } else if (data.repeatLabel === "매일") {
      payload = {
        name,
        description,
        startDate,
        frequencyType: "DAILY",
      };
    } else if (data.repeatLabel === "주 반복") {
      const selected = data.selectedDays ?? [];
      if (selected.length === 0) {
        alert("주 반복은 반복 요일을 최소 1개 선택해주세요!");
        return;
      }

      // 선택한 요일들을 서버가 요구하는 숫자 배열로 변환
      const weekDays = selected
        .map((day) => KOREAN_WEEKDAY_TO_JS[day])
        .filter((v): v is number => v !== undefined)
        .map((v) => v + 1); // ✅ 1~7

      if (weekDays.length === 0) {
        alert("요일 값이 올바르지 않습니다.");
        return;
      }

      payload = {
        name,
        description,
        startDate,
        frequencyType: "WEEKLY",
        weekDays, // ✅ weekDays 배열로 전송
      } as CreateTaskParams;
    } else if (data.repeatLabel === "월 반복") {
      const d = new Date(startDate);
      const monthDay = d.getDate(); // 1~31

      payload = {
        name,
        description,
        startDate,
        frequencyType: "MONTHLY",
        monthDay,
      };
    } else {
      payload = {
        name,
        description,
        startDate,
        frequencyType: "ONCE",
      } as CreateTaskParams;
    }

    console.log("✅ createTask payload:", payload);

    createTaskMutation.mutate({
      taskListId: currentListId,
      body: payload,
    });
  };

  const handleDeleteList = (targetListId: number) => {
    if (confirm("정말 이 목록을 삭제하시겠습니까?")) {
      deleteList(targetListId);
      setUserSelectedListId(null);
    }
  };

  // ✅ 삭제 선택 모달 열기/닫기
  const openDeleteModal = (task: UITask) => {
    setDeleteTarget(task);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  // ✅ 모달에서 "이번 일정만 삭제"
  const handleDeleteOnlyThis = () => {
    if (!deleteTarget) return;
    deleteTaskMutation.mutate(deleteTarget.id);
    closeDeleteModal();
  };

  // ✅ 모달에서 "반복 전체 삭제"
  const handleDeleteAllRecurring = () => {
    if (!deleteTarget) return;

    deleteRecurringMutation.mutate({
      taskId: deleteTarget.id,
      recurringId: deleteTarget.recurringId,
    });
    closeDeleteModal();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target))
        setIsDropdownOpen(false);
      if (calendarRef.current && !calendarRef.current.contains(target))
        setShowCalendar(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeGroup = taskGroups.find(
    (g: TaskListResponse) => g.id === currentListId,
  ) || {
    name: taskGroups.length > 0 ? "목록을 선택해주세요" : "목록 없음",
    id: -1,
    tasks: [],
  };

  useEffect(() => {
    const isMobileOrTablet = window.matchMedia("(max-width: 1023px)").matches;

    if (!isOpen || !isMobileOrTablet) return;

    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;

      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const currentCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;

  return (
    <div className="bg-background-secondary font-pretendard flex min-h-screen flex-col lg:flex-row">
      <main
        className={[
          "text-color-primary flex-1 p-4 md:p-6 lg:p-10",
          "transition-[margin] duration-300 ease-out",
          isOpen ? "lg:mr-160" : "",
        ].join(" ")}
      >
        <div className="mx-auto max-w-full space-y-6 lg:max-w-300">
          <header className="lg:border-border-primary lg:bg-background-inverse text-2xl-b mb-6 flex items-center rounded-xl py-3 md:mb-12 md:py-4 lg:justify-between lg:border lg:px-4 lg:shadow-sm">
            <h1 className="md:text-2xl-b text-xl font-bold">
              {currentTeam ? currentTeam.name : "할 일 목록"}
            </h1>
            <SettingsIcon className="text-icon-primary ml-2.5 h-5 w-5 cursor-pointer" />
          </header>

          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <aside className="flex w-full shrink-0 flex-col lg:w-72">
              <div className="flex flex-col gap-4">
                <h2 className="md:text-xl-b text-lg-sb lg:text-xl-b px-1 font-bold">
                  할 일
                </h2>

                {/* 모바일 뷰 드롭다운 */}
                <div className="flex items-center justify-between gap-2 lg:hidden">
                  <div className="relative max-w-50 flex-1" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="border-border-primary flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm active:scale-95"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-color-primary text-sm-sb">
                          {activeGroup.name}
                        </span>
                        <div className="flex items-center gap-1">
                          {currentCount === totalCount && totalCount > 0 ? (
                            <LoadingDone className="h-4 w-4" />
                          ) : (
                            <Loading className="h-4 w-4" />
                          )}
                          <span className="text-brand-primary text-md-r">
                            {currentCount}/{totalCount}
                          </span>
                        </div>
                      </div>
                      <ArrowDown
                        className={`text-icon-primary h-4 w-4 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isDropdownOpen && (
                      <ul className="border-border-primary absolute z-70 mt-2 w-full overflow-hidden rounded-xl border bg-white shadow-2xl">
                        {taskGroups.map((group: TaskListResponse) => (
                          <li
                            key={group.id}
                            onClick={() => {
                              handleSelectList(group.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`hover:bg-background-secondary cursor-pointer px-4 py-3 text-sm transition-colors ${
                              currentListId === group.id
                                ? "text-brand-primary bg-blue-50 font-bold"
                                : "text-color-primary"
                            }`}
                          >
                            {group.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    onClick={() => setIsListModalOpen(true)}
                    className="border-brand-primary text-brand-primary text-sm-sb bg-background-inverse flex shrink-0 items-center gap-1.5 rounded-4xl border px-4 py-3 shadow-sm active:scale-95"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />할 일 목록 추가
                  </button>
                </div>

                {/* 데스크탑 사이드바 목록 */}
                <div className="mt-6 hidden w-full flex-col gap-3 lg:flex">
                  {isListLoading ? (
                    <p className="text-sm text-gray-400">불러오는 중...</p>
                  ) : taskGroups.length > 0 ? (
                    taskGroups.map((group: TaskListResponse) => (
                      <TaskGroupCard
                        key={group.id}
                        name={group.name}
                        current={group.id === currentListId ? currentCount : 0}
                        total={group.id === currentListId ? totalCount : 0}
                        isActive={currentListId === group.id}
                        onClick={() => handleSelectList(group.id)}
                        onDelete={() => handleDeleteList(group.id)}
                      />
                    ))
                  ) : (
                    <p className="py-4 text-center text-sm text-gray-400">
                      생성된 목록이 없습니다.
                    </p>
                  )}
                  <button
                    onClick={() => setIsListModalOpen(true)}
                    className="border-brand-primary text-brand-primary text-sm-sb bg-background-inverse hover:bg-brand-primary group mt-4 flex h-10 w-full items-center justify-center gap-1.5 rounded-4xl border shadow-sm transition-all hover:text-white active:scale-95"
                  >
                    <PlusIcon className="h-3.5 w-3.5 group-hover:brightness-0 group-hover:invert" />
                    할 일 목록 추가
                  </button>
                </div>
              </div>
            </aside>

            <section className="border-border-primary relative min-h-125 flex-1 rounded-xl border bg-white p-6 shadow-sm md:p-8 lg:p-12">
              <div className="mx-auto max-w-full space-y-8 lg:max-w-3xl">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <h3 className="md:text-2xl-b text-color-tertiary text-xl font-bold">
                    {activeGroup.name}
                  </h3>
                  <div className="flex items-center gap-1 self-end md:self-auto">
                    <DatePagination
                      selectedDate={selectedDate}
                      onPrevMonth={() => {
                        const d = new Date(selectedDate);
                        d.setMonth(d.getMonth() - 1);
                        setSelectedDate(d);
                      }}
                      onNextMonth={() => {
                        const d = new Date(selectedDate);
                        d.setMonth(d.getMonth() + 1);
                        setSelectedDate(d);
                      }}
                    />
                    <div ref={calendarRef} className="relative">
                      <CalendarPicker
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        showCalendar={showCalendar}
                        setShowCalendar={setShowCalendar}
                      />
                    </div>
                  </div>
                </div>

                <WeeklyCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  onPrevWeek={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() - 7);
                    setSelectedDate(d);
                  }}
                  onNextWeek={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() + 7);
                    setSelectedDate(d);
                  }}
                />

                <div className="flex flex-col gap-3">
                  {isTasksLoading ? (
                    <div className="py-20 text-center text-gray-400">
                      로딩 중...
                    </div>
                  ) : tasks.length > 0 ? (
                    tasks.map((task: UITask) => (
                      <div
                        key={task.id}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          navigate(`${currentListId}/tasks/${task.id}`)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            navigate(`${currentListId}/tasks/${task.id}`);
                        }}
                        className="cursor-pointer"
                      >
                        <TaskCard
                          title={task.title}
                          isCompleted={task.isCompleted}
                          commentCount={task.commentCount}
                          date={new Date(task.date)}
                          time={null}
                          repeatLabel={
                            task.frequency === "DAILY"
                              ? "매일"
                              : task.frequency === "WEEKLY"
                                ? "주 반복"
                                : task.frequency === "MONTHLY"
                                  ? "월 반복"
                                  : ""
                          }
                          isRecurring={task.frequency !== "ONCE"}
                          onToggle={() =>
                            toggleTaskMutation.mutate({
                              id: task.id,
                              doneAt: task.doneAt
                                ? null
                                : new Date().toISOString(),
                            })
                          }
                          // ✅ 삭제 시 선택 모달 오픈
                          onDelete={() => openDeleteModal(task)}
                          onEdit={() => console.log("수정")}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-color-disabled flex flex-col items-center justify-center py-24 text-center">
                      <p>해당 날짜에 등록된 할 일이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="bg-brand-primary fixed right-6 bottom-6 z-10 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105 active:scale-95 md:h-16 md:w-16 lg:absolute lg:top-1/2 lg:-right-8 lg:-translate-y-1/2"
              >
                <PlusIcon className="h-6 w-6 brightness-0 invert filter md:h-8 md:w-8" />
              </button>
            </section>
          </div>
        </div>
      </main>

      {/* 오버레이 */}
      <div
        className={[
          "fixed inset-0 z-40",
          "lg:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={closePanel}
      />

      {/* 오른쪽 슬라이드 패널 */}
      <aside
        className={[
          "fixed right-0 z-50 bg-white shadow-xl",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          "top-13 left-0 h-[calc(100dvh-52px)] w-full",
          "md:top-0 md:left-auto md:h-dvh md:w-130",
          "lg:w-160",
        ].join(" ")}
      >
        <div className="h-full overflow-auto px-4 py-4 md:px-6 md:py-6 lg:pr-10">
          <Outlet />
        </div>
      </aside>

      {/* 리스트 생성 모달 */}
      <Modal isOpen={isListModalOpen} onClose={() => setIsListModalOpen(false)}>
        <ListCreateModal
          groupId={selectedTeamId}
          onClose={() => setIsListModalOpen(false)}
        />
      </Modal>

      {/* 할 일 생성 모달 */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
        <TaskCreateModal
          onClose={() => setIsTaskModalOpen(false)}
          onCreate={handleCreateTask}
          currentListId={currentListId || 0}
          currentGroupId={selectedTeamId}
        />
      </Modal>

      {/* ✅ 삭제 선택 모달 */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <div className="font-pretendard w-[320px] rounded-2xl bg-white p-6">
          <h3 className="text-color-primary text-lg font-bold">할 일 삭제</h3>

          <p className="text-color-tertiary mt-2 text-sm">
            {deleteTarget?.frequency !== "ONCE"
              ? "반복 할 일입니다. 삭제 범위를 선택해주세요."
              : "이 할 일을 삭제할까요?"}
          </p>

          <div className="mt-5 flex flex-col gap-2">
            {/* 공통: 이번 일정만 삭제 */}
            <button
              type="button"
              className="w-full rounded-xl bg-red-500 py-3 font-semibold text-white active:scale-95 disabled:opacity-50"
              onClick={handleDeleteOnlyThis}
              disabled={deleteTaskMutation.isPending}
            >
              이번 일정만 삭제
            </button>

            {/* 반복일 때만: 전체 삭제 */}
            {deleteTarget?.frequency !== "ONCE" && (
              <button
                type="button"
                className="w-full rounded-xl border border-red-500 py-3 font-semibold text-red-500 active:scale-95 disabled:opacity-50"
                onClick={handleDeleteAllRecurring}
                disabled={deleteRecurringMutation.isPending}
              >
                반복 전체 삭제
              </button>
            )}

            <button
              type="button"
              className="mt-1 w-full rounded-xl bg-gray-100 py-3 font-semibold text-gray-700 active:scale-95"
              onClick={closeDeleteModal}
            >
              취소
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
