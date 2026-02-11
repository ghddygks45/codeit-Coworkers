import React, { useState, useRef, useEffect } from "react";
import KebabIcon from "@/assets/kebab.svg";
import CommentIcon from "@/assets/comment.svg";
import CalendarIcon from "@/assets/calendar.svg";
import RepeatIcon from "@/assets/repeat.svg";
import Todo from "@/components/common/Todo/todo";

interface TaskCardProps {
  title: string;
  commentCount: number;
  date: Date;
  time?: string | null; // 추가: 선택된 시간
  repeatLabel?: string; // 추가: 반복 설정 문구 (예: "매일", "주 반복")
  isRecurring: boolean;
  isCompleted: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
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
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="group border-border-primary hover:border-brand-primary font-pretendard relative flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm transition-all">
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
            <CommentIcon className="text-color-disabled h-4 w-4" />
            <span className="text-xs-m text-color-disabled">
              {commentCount}
            </span>
          </div>
        </div>

        <div className="text-xs-m text-color-disabled mt-1.5 flex flex-wrap items-center gap-3 px-0.5">
          {/* 날짜 및 시간 표시 */}
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {date.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {time && ` ${time}`}
            </span>
          </div>

          {/* 반복 설정 정보 표시 */}
          {isRecurring && (
            <>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1.5">
                <RepeatIcon className="h-4 w-4" />
                <span>{repeatLabel}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative ml-4" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="hover:bg-background-secondary rounded-md p-1 transition-colors"
        >
          <KebabIcon className="text-icon-primary h-5 w-5" />
        </button>

        {isMenuOpen && (
          <div className="border-border-primary absolute right-0 z-50 mt-1 w-24 overflow-hidden rounded-lg border bg-white shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
                setIsMenuOpen(false);
              }}
              className="text-color-primary hover:bg-background-secondary w-full px-4 py-2 text-left text-sm font-medium"
            >
              수정하기
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50"
            >
              삭제하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
