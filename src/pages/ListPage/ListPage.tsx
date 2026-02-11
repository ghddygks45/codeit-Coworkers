import React, { useState } from "react";
import Sidebar from "@/components/gnb/Gnb";
import ListCreateModal from "@/components/common/Modal/Contents/ListCreateModal";
import TaskCreateModal from "@/components/common/Modal/Contents/TaskCreateModal";

import { WeeklyCalendar } from "./components/WeeklyCalendar";
import DatePagination from "./components/DatePagination";
import CalendarPicker from "./components/CalendarPicker";
import TaskCard from "./components/TaskCard";
import { TaskGroupCard } from "./components/TaskGroupCard";

import PlusIcon from "@/assets/plus_blue.svg";
import SettingsIcon from "@/assets/settings.svg";

// --- 타입 정의 ---
interface TaskCreateInput {
  title: string;
  date: Date | null;
  time: string | null;
  repeat: string;
  selectedDays: string[];
  memo: string;
}

interface Task {
  id: number;
  groupId: number;
  title: string;
  commentCount: number;
  date: Date;
  time?: string | null;
  repeat?: string;
  isRecurring: boolean;
  isCompleted: boolean;
  memo?: string;
}

export default function ListPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(2);

  const [taskGroups, setTaskGroups] = useState([
    { id: 1, name: "법인 설립", current: 3, total: 5 },
    { id: 2, name: "법인 등기", current: 3, total: 5 },
    { id: 3, name: "정기 주총", current: 3, total: 5 },
  ]);

  const [allTasks, setAllTasks] = useState<Task[]>([
    {
      id: 1,
      groupId: 1,
      title: "법인 설립 비용 안내 드리기",
      commentCount: 3,
      date: new Date(),
      isRecurring: false,
      isCompleted: true,
    },
  ]);

  // --- 핸들러 ---
  const handleCreateTask = (data: TaskCreateInput) => {
    const newTask: Task = {
      id: Date.now(),
      groupId: selectedGroupId,
      title: data.title,
      commentCount: 0,
      date: data.date || selectedDate,
      time: data.time,
      repeat: data.repeat,
      isRecurring: data.repeat !== "반복 안함",
      isCompleted: false,
      memo: data.memo,
    };

    setAllTasks((prev) => [...prev, newTask]);
    setIsTaskModalOpen(false);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const activeGroup =
    taskGroups.find((g) => g.id === selectedGroupId) || taskGroups[0];

  const filteredTasks = allTasks.filter(
    (task) =>
      task.groupId === selectedGroupId &&
      isSameDay(new Date(task.date), selectedDate),
  );

  return (
    <div className="bg-background-secondary font-pretendard flex min-h-screen">
      <div className="bg-background-inverse">
        <Sidebar />
      </div>

      <main className="text-color-primary flex-1 overflow-hidden p-10">
        <div className="mx-auto max-w-300 space-y-6">
          <header className="border-border-primary mb-12 flex items-center justify-between rounded-xl border bg-white px-6 py-4 shadow-sm">
            <h1 className="text-2xl-b">경영관리팀</h1>
            <SettingsIcon className="text-icon-primary h-5 w-5 cursor-pointer" />
          </header>

          <div className="flex gap-8">
            <aside className="flex w-72 shrink-0 flex-col items-center">
              <h2 className="text-xl-b mb-2 w-full px-1">할 일</h2>
              <div className="mt-6 flex w-full flex-col gap-3">
                {taskGroups.map((group) => (
                  <TaskGroupCard
                    key={group.id}
                    name={group.name}
                    current={group.current}
                    total={group.total}
                    onClick={() => setSelectedGroupId(group.id)}
                    onEdit={() => console.log(`${group.name} 수정`)}
                    onDelete={() =>
                      setTaskGroups(taskGroups.filter((g) => g.id !== group.id))
                    }
                  />
                ))}
              </div>
              <button
                onClick={() => setIsListModalOpen(true)}
                className="group text-md-sb text-brand-primary border-brand-primary mt-11 flex h-10 w-28 items-center justify-center gap-2 rounded-4xl border"
              >
                <PlusIcon className="h-3.5 w-3.5 group-hover:brightness-0 group-hover:invert" />
                목록 추가
              </button>
            </aside>

            <section className="border-border-primary relative min-h-175 flex-1 rounded-xl border bg-white p-12 shadow-sm">
              <div className="mx-auto max-w-3xl space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl-b text-color-tertiary">
                    {activeGroup.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <DatePagination
                      selectedDate={selectedDate}
                      onPrevMonth={handlePrevMonth}
                      onNextMonth={handleNextMonth}
                    />
                    <CalendarPicker
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      showCalendar={showCalendar}
                      setShowCalendar={setShowCalendar}
                    />
                  </div>
                </div>

                <WeeklyCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  onPrevWeek={handlePrevWeek}
                  onNextWeek={handleNextWeek}
                />

                <div className="flex flex-col gap-3">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        title={task.title}
                        commentCount={task.commentCount}
                        date={task.date}
                        time={task.time}
                        repeatLabel={task.repeat}
                        isRecurring={task.isRecurring}
                        isCompleted={task.isCompleted}
                        onToggle={() => {
                          setAllTasks((prev) =>
                            prev.map((t) =>
                              t.id === task.id
                                ? { ...t, isCompleted: !t.isCompleted }
                                : t,
                            ),
                          );
                        }}
                        onEdit={() => console.log(`${task.id} 수정`)}
                        onDelete={() =>
                          setAllTasks((prev) =>
                            prev.filter((t) => t.id !== task.id),
                          )
                        }
                      />
                    ))
                  ) : (
                    <div className="text-color-disabled flex flex-col items-center justify-center py-24">
                      <p>해당 날짜에 등록된 할 일이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTaskModalOpen(true)}
                className="bg-brand-primary absolute top-1/2 -right-8 z-10 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-xl"
              >
                <PlusIcon className="h-8 w-8 brightness-0 invert filter" />
              </button>
            </section>
          </div>
        </div>
      </main>

      {isListModalOpen && (
        <div
          className="fixed inset-0 z-999 flex items-center justify-center bg-black/50"
          onClick={() => setIsListModalOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ListCreateModal
              onClose={() => setIsListModalOpen(false)}
              groupId={selectedGroupId}
            />
          </div>
        </div>
      )}

      {isTaskModalOpen && (
        <div
          className="fixed inset-0 z-999 flex items-center justify-center bg-black/50"
          onClick={() => setIsTaskModalOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <TaskCreateModal
              onClose={() => setIsTaskModalOpen(false)}
              onCreate={handleCreateTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}
