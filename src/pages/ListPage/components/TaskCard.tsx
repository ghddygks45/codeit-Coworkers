import React, { useState, useRef, useEffect } from "react";
import KebabIcon from "@/assets/kebab.svg";
import CommentIcon from "@/assets/comment.svg";
import CalendarIcon from "@/assets/calendar.svg";
import RepeatIcon from "@/assets/repeat.svg";
import Todo from "@/components/common/Todo/todo";

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

  // 외부 클릭 시 드롭다운 메뉴 닫기 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 날짜 표시 형식 변환 함수
  const formattedDate = new Date(date).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  return (
    <div className="group border-border-primary hover:border-brand-primary font-pretendard relative flex items-center justify-between rounded-xl border bg-white px-3 py-2.5 shadow-sm transition-all sm:px-4 sm:py-3">
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center">
          <div className="flex-none">
            {/* 할 일 완료 여부 및 제목 표시 */}
            <Todo
              content={title}
              isCompleted={isCompleted}
              onToggle={onToggle}
            />
          </div>

          {/* 댓글 개수 */}
          <div className="ml-2 flex shrink-0 items-center gap-1">
            <CommentIcon className="text-color-disabled h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-color-disabled sm:text-xs-m text-[10px]">
              {commentCount}
            </span>
          </div>
        </div>

        <div className="text-color-disabled sm:text-xs-m mt-1 flex flex-wrap items-center gap-2 px-0.5 text-[10px] sm:mt-1.5 sm:gap-3">
          {/* 날짜 정보 */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>
              {formattedDate}
              {time && ` ${time}`}
            </span>
          </div>

          {/* 반복 설정 정보 */}
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

      {/* 케밥 메뉴 (수정/삭제) */}
      <div className="relative ml-2 sm:ml-4" ref={menuRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="hover:bg-background-secondary rounded-md p-1 transition-colors"
          aria-label="메뉴 열기"
        >
          <KebabIcon className="text-icon-primary h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {isMenuOpen && (
          <div className="border-border-primary absolute right-0 z-50 mt-1 w-24 overflow-hidden rounded-lg border bg-white shadow-lg">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
                setIsMenuOpen(false);
              }}
              className="text-color-primary hover:bg-background-secondary w-full px-4 py-2 text-left text-xs font-medium sm:text-sm"
            >
              수정하기
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-xs font-medium text-red-500 hover:bg-red-50 sm:text-sm"
            >
              삭제하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
