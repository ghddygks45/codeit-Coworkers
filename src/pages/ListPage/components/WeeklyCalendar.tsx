import React, { useMemo, useRef } from "react";
import ChevronLeftIcon from "@/assets/arrow-left.svg";
import ChevronRightIcon from "@/assets/arrow-right.svg";

interface WeeklyCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  selectedDate,
  onDateSelect,
  onPrevWeek,
  onNextWeek,
}) => {
  const weekDays = useMemo<Date[]>(() => {
    const result: Date[] = [];
    const current = new Date(selectedDate);
    const day = current.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(
      current.getFullYear(),
      current.getMonth(),
      current.getDate() + diffToMonday,
    );

    for (let i = 0; i < 7; i++) {
      result.push(
        new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i),
      );
    }
    return result;
  }, [selectedDate]);

  const dayLabels: string[] = ["월", "화", "수", "목", "금", "토", "일"];

  const isSameDay = (d1: Date, d2: Date): boolean =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // ✅ 스와이프용 ref
  const startXRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const THRESHOLD = 60; // px

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerIdRef.current !== e.pointerId) return;
    if (startXRef.current == null) return;

    const dx = e.clientX - startXRef.current;

    // ✅ 왼쪽으로 밀면 다음 주 / 오른쪽으로 밀면 이전 주
    if (dx <= -THRESHOLD) onNextWeek();
    else if (dx >= THRESHOLD) onPrevWeek();

    startXRef.current = null;
    pointerIdRef.current = null;
  };

  const handlePointerCancel = () => {
    startXRef.current = null;
    pointerIdRef.current = null;
  };

  return (
    <div className="flex w-full items-center gap-1 sm:gap-2">
      <button
        type="button"
        onClick={onPrevWeek}
        className="bg-background-primary border-border-primary hover:bg-background-secondary hidden h-14 w-8 shrink-0 items-center justify-center rounded-lg border transition-all sm:h-18 sm:w-12 sm:rounded-xl md:flex"
      >
        <ChevronLeftIcon className="text-icon-primary h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      <div
        className="flex flex-1 items-center justify-between gap-1 select-none sm:gap-2"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{ touchAction: "pan-y" }}
        aria-label="주간 캘린더 (좌우로 밀어서 주 이동)"
      >
        {weekDays.map((date, idx) => {
          const isSelected = isSameDay(selectedDate, date);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onDateSelect(date)}
              className={`flex h-14 flex-1 flex-col items-center justify-center rounded-lg border transition-all sm:h-18 sm:rounded-xl ${
                isSelected
                  ? "border-[#1E293B] bg-[#1E293B] text-white shadow-md"
                  : "bg-background-primary border-border-primary hover:bg-background-secondary"
              }`}
            >
              <span
                className={`sm:text-xs-m mb-0.5 text-[10px] font-medium sm:mb-1 ${
                  isSelected ? "text-gray-300" : "text-color-tertiary"
                }`}
              >
                {dayLabels[idx]}
              </span>
              <span className="text-sm-b sm:text-xl-b leading-none">
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onNextWeek}
        className="bg-background-primary border-border-primary hover:bg-background-secondary hidden h-14 w-8 shrink-0 items-center justify-center rounded-lg border transition-all sm:h-18 sm:w-12 sm:rounded-xl md:flex"
      >
        <ChevronRightIcon className="text-icon-primary h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </div>
  );
};
