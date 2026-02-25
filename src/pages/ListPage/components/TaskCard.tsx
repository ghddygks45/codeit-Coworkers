import React, { useMemo, useState } from "react";
import KebabIcon from "@/assets/kebab.svg";
import CommentIcon from "@/assets/comment.svg";
import CalendarIcon from "@/assets/calendar.svg";
import RepeatIcon from "@/assets/repeat.svg";
import Todo from "@/components/common/Todo/todo";

import Dropdown, { Option } from "@/components/common/Dropdown/Dropdown";
import Modal from "@/components/common/Modal/Modal";
import TaskUpdateModal from "@/components/common/Modal/Contents/TaskUpdateModal";

type RepeatType = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

type TaskUpdatePayload = {
  title: string;
  description: string;
  startDate: string;
  frequencyType: RepeatType;
  weekDays: number[];
  monthDay: number;
  isRecurring: boolean;
};

type TaskUpdateInitialTask = {
  id: number;
  title: string;
  description?: string | null;
  startDate: string;
  frequencyType: RepeatType;
  weekDays?: number[];
};

// Props 타입 정의
interface TaskCardProps {
  title: string;
  commentCount: number;
  date: Date | string;
  time?: string | null;
  repeatLabel?: string;
  isRecurring: boolean;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete?: () => void;

  updateModalProps?: {
    initialTask: TaskUpdateInitialTask;
    onUpdate: (data: TaskUpdatePayload) => void;
    isPending?: boolean;
  };
}

export default function TaskCard({
  title,
  commentCount,
  date,
  time,
  repeatLabel,
  isRecurring,
  isCompleted,
  onToggle,
  onDelete,
  updateModalProps,
}: TaskCardProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // 날짜 표시 형식 변환 함수
  const formattedDate = new Date(date).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  const canEdit = Boolean(updateModalProps);

  const menuOptions: Option[] = useMemo(
    () => [
      {
        label: "수정하기",
        value: "edit",
        action: () => {
          if (!canEdit) return;
          setIsUpdateModalOpen(true);
        },
      },
      {
        label: "삭제하기",
        value: "delete",
        action: () => onDelete?.(),
      },
    ],
    [canEdit, onDelete],
  );

  return (
    <>
      <div className="group border-border-primary hover:border-brand-primary font-pretendard relative flex items-center justify-between rounded-xl border bg-white px-3 py-2.5 shadow-sm transition-all sm:px-4 sm:py-3">
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center">
            <div className="flex-none">
              <Todo
                content={title}
                isCompleted={isCompleted}
                onToggle={onToggle}
              />
            </div>

            <div className="ml-2 flex shrink-0 items-center gap-1">
              <CommentIcon className="text-color-disabled h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-color-disabled sm:text-xs-m text-[10px]">
                {commentCount}
              </span>
            </div>
          </div>

          <div className="text-color-disabled sm:text-xs-m mt-1 flex flex-wrap items-center gap-2 px-0.5 text-[10px] sm:mt-1.5 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>
                {formattedDate}
                {time && ` ${time}`}
              </span>
            </div>

            {isRecurring && repeatLabel && (
              <>
                <span className="hidden text-gray-300 sm:inline">|</span>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <RepeatIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{repeatLabel}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="ml-2 sm:ml-4">
          <Dropdown
            trigger="kebab"
            listAlign="center"
            icon={
              <button
                type="button"
                className="hover:bg-background-secondary rounded-md p-1 transition-colors"
                aria-label="메뉴 열기"
              >
                <KebabIcon className="text-icon-primary h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            }
            options={menuOptions}
            listClassName="overflow-hidden rounded-lg border border-border-primary bg-white shadow-lg"
            usePortal
          />
        </div>
      </div>

      {/* 수정 모달 (updateModalProps 있을 때만) */}
      {updateModalProps && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
        >
          <TaskUpdateModal
            onClose={() => setIsUpdateModalOpen(false)}
            onUpdate={updateModalProps.onUpdate}
            initialTask={updateModalProps.initialTask}
            isPending={updateModalProps.isPending}
          />
        </Modal>
      )}
    </>
  );
}
