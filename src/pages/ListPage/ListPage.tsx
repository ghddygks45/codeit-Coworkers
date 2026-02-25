import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";

import { fetchClient, HttpError } from "@/lib/fetchClient";
import { BASE_URL } from "@/api/config";

import Modal from "@/components/common/Modal/Modal";
import ListCreateModal from "@/components/common/Modal/Contents/ListCreateModal";
import ListEditModal from "@/components/common/Modal/Contents/ListEditModal";
import ListDeleteModal from "@/components/common/Modal/Contents/ListDeleteModal";
import TaskCreateModal, {
  TaskData,
} from "@/components/common/Modal/Contents/TaskCreateModal";
import TaskDangerModal from "@/components/common/Modal/Contents/TaskDeleteModal";

import { WeeklyCalendar } from "./components/WeeklyCalendar";
import DatePagination from "./components/DatePagination";
import CalendarPicker from "./components/CalendarPicker";
import TaskCard from "./components/TaskCard";
import { TaskGroupCard } from "./components/TaskGroupCard";
import TeamHeader from "@/features/common/components/TeamHeader";
import Dropdown, { Option } from "@/components/common/Dropdown/Dropdown";

import PlusIcon from "@/assets/plus_blue.svg";
import ArrowDown from "@/assets/arrow-down.svg";
import Loading from "@/assets/progress-ongoing.svg";
import LoadingDone from "@/assets/progress-done.svg";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  CreateTaskParams,
} from "@/api/task";
import { useToastStore } from "@/stores/useToastStore";
import { TaskServer } from "@/types/task";

type RepeatType = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

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
  weekDays?: number[];
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
  월: 0,
  화: 1,
  수: 2,
  목: 3,
  금: 4,
  토: 5,
  일: 6,
};

// {status:doing} 제거
const cleanName = (name?: string | null) =>
  (name ?? "").replace("{status:doing}", "").trim();

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

  // 현재 열려있는 상세 taskId (있으면 number)
  const openedTaskId = taskId ? Number(taskId) : null;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [userSelectedListId, setUserSelectedListId] = useState<number | null>(
    null,
  );

  // 목록 수정/삭제 모달 상태 + 선택된 목록
  const [isListEditModalOpen, setIsListEditModalOpen] = useState(false);
  const [isListDeleteModalOpen, setIsListDeleteModalOpen] = useState(false);
  const [selectedTaskList, setSelectedTaskList] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // 삭제 선택 모달 상태 (할 일 삭제)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UITask | null>(null);

  const calendarRef = useRef<HTMLDivElement>(null);

  // 삭제한 task가 현재 상세패널에 열려있다면 닫기
  const closeDetailIfOpenedTaskDeleted = useCallback(
    (deletedId: number) => {
      if (openedTaskId && openedTaskId === deletedId) {
        closePanel();
      }
    },
    [openedTaskId, closePanel],
  );

  // 그룹 할 일 목록 조회
  const { data: taskGroups = [], isLoading: isListLoading } = useQuery({
    queryKey: ["taskLists", selectedTeamId],
    queryFn: async () => {
      try {
        const data = await fetchClient<GroupDetailResponse>(
          `${BASE_URL}/groups/${selectedTeamId}`,
          { method: "GET" },
        );
        return data.taskLists ?? [];
      } catch (error: unknown) {
        if (error instanceof HttpError && error.status === 404) return [];
        throw error;
      }
    },
    enabled: !!selectedTeamId && !isNaN(selectedTeamId),
  });

  // 현재 활성화된 리스트 ID 계산
  const currentListId =
    userSelectedListId ??
    (urlListId && urlListId > 0 ? urlListId : null) ??
    (taskGroups.length > 0 ? taskGroups[0].id : null);

  const dateParam = `${formatDateToYYYYMMDD(selectedDate)}T00:00:00Z`;

  // 할 일 리스트 조회(현재 선택 리스트)
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

  // 데스크탑에서 0/0이 “클릭해야 바뀌는 문제” 해결:
  // 각 리스트별로 현재 날짜(dateParam)의 tasks를 미리 조회해서 count를 만듬.
  const listCountQueries = useQueries({
    queries: (taskGroups ?? []).map((g) => ({
      queryKey: ["tasks", g.id, dateParam],
      queryFn: () => getTasks(selectedTeamId, g.id, dateParam),
      enabled: !!selectedTeamId && !!g.id,
      staleTime: 1000 * 60,
      select: (data: TaskServer[]) => {
        const total = data.length;
        const current = data.filter((t) => !!t.doneAt).length;
        const isAllDone = total > 0 && current === total;
        return { total, current, isAllDone };
      },
    })),
  });

  const countsByListId = useMemo(() => {
    const map: Record<
      number,
      { total: number; current: number; isAllDone: boolean } | null
    > = {};
    (taskGroups ?? []).forEach((g, idx) => {
      map[g.id] = listCountQueries[idx]?.data ?? null;
    });
    return map;
  }, [taskGroups, listCountQueries]);

  // 0/0 “눌러야 반영” 느낌 방지: 로딩 중엔 —/— 표시 (현재 선택 리스트용)
  const currentCount = isTasksLoading
    ? null
    : tasks.filter((t) => t.isCompleted).length;
  const totalCount = isTasksLoading ? null : tasks.length;

  const isAllDone =
    currentCount !== null &&
    totalCount !== null &&
    totalCount > 0 &&
    currentCount === totalCount;

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

      queryClient.invalidateQueries({
        queryKey: ["group", selectedTeamId],
      });

      showToast("할 일이 추가되었습니다.");
      setIsTaskModalOpen(false);
    },
    onError: () => {
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

  // TaskUpdateModal에서 "수정하기" 눌렀을 때 업데이트
  const updateTaskMutation = useMutation({
    mutationFn: async ({
      taskId: targetTaskId,
      body,
    }: {
      taskId: number;
      body: {
        name: string;
        description: string;
        startDate: string;
        frequencyType: RepeatType;
        weekDays: number[];
        monthDay: number;
        isRecurring: boolean;
      };
    }) => {
      // updateTask의 바디 타입이 프로젝트마다 다를 수 있어서 안전하게 캐스팅
      return updateTask(
        selectedTeamId,
        currentListId!,
        targetTaskId,
        body as unknown as Record<string, unknown>,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", currentListId, dateParam],
      });
      queryClient.invalidateQueries({
        queryKey: ["taskLists", selectedTeamId],
      });
      showToast("성공적으로 수정 되었습니다.");
    },
    onError: () => {
      showToast("수정에 실패했습니다.");
    },
  });

  // 단일 할 일 삭제 (dateParam 포함 invalidate)
  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => deleteTask(selectedTeamId, currentListId!, id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", currentListId, dateParam],
      });
      queryClient.invalidateQueries({
        queryKey: ["taskLists", selectedTeamId],
      });
      // 성공 토스트
      showToast("성공적으로 삭제 되었습니다.");
      closeDeleteModal();
      closeDetailIfOpenedTaskDeleted(deletedId);
    },
    onError: () => {
      // 실패 토스트
      showToast("삭제에 실패했습니다.");
      // 실패 시 모달/상세패널 유지 (아무것도 닫지 않음)
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", currentListId, dateParam],
      });
      queryClient.invalidateQueries({
        queryKey: ["taskLists", selectedTeamId],
      });

      // 성공 토스트 문구
      showToast("성공적으로 삭제 되었습니다.");
      // 성공시에만 삭제 선택 모달 닫기
      closeDeleteModal();
      closeDetailIfOpenedTaskDeleted(variables.taskId);
    },
    onError: () => {
      showToast("삭제에 실패했습니다.");
      // 실패 시 모달/상세패널 유지
    },
  });

  // --- Handlers ---
  const handleSelectList = useCallback(
    (id: number) => {
      setUserSelectedListId(id);
      navigate(`/team/${teamId}/tasklists/${id}`);
    },
    [navigate, teamId],
  );

  // 목록 수정/삭제 모달 open/close
  const openListEditModal = (group: TaskListResponse) => {
    setSelectedTaskList({ id: group.id, name: group.name });
    setIsListEditModalOpen(true);
  };

  const openListDeleteModal = (group: TaskListResponse) => {
    setSelectedTaskList({ id: group.id, name: group.name });
    setIsListDeleteModalOpen(true);
  };

  const closeListModals = () => {
    setIsListEditModalOpen(false);
    setIsListDeleteModalOpen(false);
    setSelectedTaskList(null);
  };

  const handleCreateTask = (data: TaskData) => {
    if (!currentListId) return;

    const name = data.title.trim();
    const description = data.description?.trim() || "";
    const startDate = data.startDate || new Date().toISOString();

    let payload: CreateTaskParams;

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

      const weekDays = selected
        .map((day) => KOREAN_WEEKDAY_TO_JS[day])
        .filter((v): v is number => v !== undefined)
        .map((v) => v + 1); // 1~7

      if (weekDays.length === 0) {
        alert("요일 값이 올바르지 않습니다.");
        return;
      }

      payload = {
        name,
        description,
        startDate,
        frequencyType: "WEEKLY",
        weekDays,
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

    createTaskMutation.mutate({
      taskListId: currentListId,
      body: payload,
    });
  };

  // 삭제 선택 모달(할 일) 열기/닫기
  const openDeleteModal = (task: UITask) => {
    setDeleteTarget(task);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleDeleteOnlyThis = () => {
    if (!deleteTarget) return;
    deleteTaskMutation.mutate(deleteTarget.id);
  };

  const handleDeleteAllRecurring = () => {
    if (!deleteTarget) return;

    deleteRecurringMutation.mutate({
      taskId: deleteTarget.id,
      recurringId: deleteTarget.recurringId,
    });
  };

  // 바깥 클릭 닫기 (캘린더만)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
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
    if (!isOpen && currentListId) {
      queryClient.invalidateQueries({
        queryKey: ["tasks", currentListId, dateParam],
      });
      queryClient.invalidateQueries({
        queryKey: ["taskLists", selectedTeamId],
      });
    }
  }, [isOpen, currentListId, dateParam, selectedTeamId, queryClient]);

  // 모바일에서 상세패널 열렸을 때 배경 스크롤 방지
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

  // 모바일 리스트 Dropdown 옵션
  const mobileListOptions: Option[] = useMemo(
    () =>
      (taskGroups ?? []).map((group) => ({
        label: cleanName(group.name),
        value: String(group.id),
        action: () => handleSelectList(group.id),
      })),
    [taskGroups, handleSelectList],
  );

  return (
    <div className="bg-background-secondary font-pretendard flex min-h-screen flex-col lg:flex-row">
      <main
        className={[
          "text-color-primary flex-1 p-4 md:p-6 lg:p-10",
          "transition-[margin] duration-300 ease-out",
          isOpen ? "lg:mr-130" : "",
        ].join(" ")}
      >
        <div className="relative mx-auto max-w-full space-y-6 overflow-visible lg:max-w-300">
          <TeamHeader groupId={Number(teamId ?? 0)} />

          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <aside className="flex w-full shrink-0 flex-col lg:w-72">
              <div className="flex flex-col gap-4">
                <h2 className="md:text-xl-b text-lg-sb lg:text-xl-b px-1 font-bold">
                  할 일
                </h2>

                {/* 모바일 뷰 드롭다운 (공통 Dropdown으로 교체) */}
                <div className="flex items-center justify-between gap-2 lg:hidden">
                  <div className="min-w-0 flex-1">
                    <Dropdown
                      trigger="kebabSmall"
                      icon={
                        <button
                          type="button"
                          className="border-border-primary flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm active:scale-95"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="text-color-primary text-sm-sb wrap-break-word whitespace-normal">
                              {activeGroup.name}
                            </span>

                            {/* 모바일: 아이콘 + 카운트 */}
                            <div className="flex items-center gap-1.5">
                              {currentCount === null || totalCount === null ? (
                                <span className="inline-block h-4 w-4" />
                              ) : isAllDone ? (
                                <LoadingDone className="h-4 w-4" />
                              ) : (
                                <Loading className="h-4 w-4" />
                              )}

                              <span className="text-brand-primary text-md-r">
                                {currentCount === null || totalCount === null
                                  ? "—/—"
                                  : `${currentCount}/${totalCount}`}
                              </span>
                            </div>
                          </div>

                          <ArrowDown className="text-icon-primary h-4 w-4" />
                        </button>
                      }
                      options={mobileListOptions}
                      listClassName="w-full overflow-hidden rounded-xl border border-border-primary bg-white shadow-2xl"
                      usePortal
                    />
                  </div>

                  <button
                    onClick={() => setIsListModalOpen(true)}
                    className="border-brand-primary text-brand-primary text-sm-sb bg-background-inverse flex shrink-0 items-center gap-1.5 rounded-4xl border px-4 py-2.5 shadow-sm active:scale-95 lg:py-3"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />할 일 목록 추가
                  </button>
                </div>

                {/* 데스크탑 사이드바 목록 */}
                <div className="mt-6 hidden w-full flex-col gap-3 lg:flex">
                  {isListLoading ? (
                    <p className="text-sm text-gray-400">불러오는 중...</p>
                  ) : taskGroups.length > 0 ? (
                    taskGroups.map((group: TaskListResponse) => {
                      const isActive = currentListId === group.id;
                      const counts = countsByListId[group.id]; // null이면 로딩중

                      return (
                        <TaskGroupCard
                          key={group.id}
                          name={cleanName(group.name)}
                          current={counts ? counts.current : null}
                          total={counts ? counts.total : null}
                          status={
                            counts
                              ? counts.isAllDone
                                ? "done"
                                : "ongoing"
                              : "loading"
                          }
                          isActive={isActive}
                          onClick={() => handleSelectList(group.id)}
                          // 드롭다운 “수정/삭제” → 모달 오픈
                          onEdit={() => openListEditModal(group)}
                          onDelete={() => openListDeleteModal(group)}
                        />
                      );
                    })
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
                    {cleanName(activeGroup.name)}
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
                    <div
                      ref={calendarRef}
                      className="bg-background-inverse relative z-10"
                    >
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
                          navigate(
                            `/team/${teamId}/tasklists/${currentListId}/tasks/${task.id}`,
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            navigate(
                              `/team/${teamId}/tasklists/${currentListId}/tasks/${task.id}`,
                            );
                          }
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
                          onDelete={() => openDeleteModal(task)}
                          // TaskCard 내부에서 수정 모달을 띄우는 방식: updateModalProps만 넘기면 됨
                          updateModalProps={{
                            initialTask: {
                              id: task.id,
                              title: task.title,
                              description: task.description ?? "",
                              startDate:
                                task.startDate ??
                                new Date(task.date).toISOString(), // null이면 대체
                              frequencyType: (task.frequency ??
                                "ONCE") as RepeatType,
                              weekDays: task.weekDays ?? [],
                            },
                            onUpdate: (data) => {
                              updateTaskMutation.mutate({
                                taskId: task.id,
                                body: {
                                  name: data.title,
                                  description: data.description,
                                  startDate: data.startDate,
                                  frequencyType: data.frequencyType,
                                  weekDays: data.weekDays,
                                  monthDay: data.monthDay,
                                  isRecurring: data.isRecurring,
                                },
                              });
                            },
                            isPending: updateTaskMutation.isPending,
                          }}
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
          "fixed right-0 z-30 bg-white shadow-xl",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          "top-13 left-0 h-[calc(100dvh-52px)] w-full",
          "md:top-0 md:left-auto md:h-dvh md:w-130",
          "lg:w-130",
        ].join(" ")}
      >
        <div className="h-full overflow-auto">
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

      {/* 리스트 수정 모달 */}
      <Modal isOpen={isListEditModalOpen} onClose={closeListModals}>
        <ListEditModal
          groupId={selectedTeamId}
          selectedTaskList={selectedTaskList}
          onClose={closeListModals}
        />
      </Modal>

      {/* 리스트 삭제 모달 */}
      <Modal isOpen={isListDeleteModalOpen} onClose={closeListModals}>
        <ListDeleteModal
          groupId={selectedTeamId}
          selectedTaskList={selectedTaskList}
          onClose={closeListModals}
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

      {/* 삭제 선택 모달 */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <TaskDangerModal
          onClose={closeDeleteModal}
          // 반복 할 일이 아닌 경우(ONCE)는 이 버튼만 쓰게 됨
          onDelete={handleDeleteOnlyThis}
          // 반복 할 일인 경우(weekly/monthly/daily) 선택 버튼 노출
          onDeleteOnlyThis={handleDeleteOnlyThis}
          onDeleteAllRecurring={handleDeleteAllRecurring}
          isRecurring={deleteTarget?.frequency !== "ONCE"}
        />
      </Modal>
    </div>
  );
}
