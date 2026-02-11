import React, { useMemo } from "react";
import ChevronLeftIcon from "@/assets/arrow-left.svg";
import ChevronRightIcon from "@/assets/arrow-right.svg";

interface WeeklyCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export const WeeklyCalendar = ({
  selectedDate,
  onDateSelect,
  onPrevWeek,
  onNextWeek,
}: WeeklyCalendarProps) => {
  const weekDays = useMemo(() => {
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

  const dayLabels = ["월", "화", "수", "목", "금", "토", "일"];
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  return (
    <div className="flex w-full items-center gap-2">
      <button
        type="button"
        onClick={onPrevWeek}
        className="bg-background-primary border-border-primary hover:bg-background-secondary flex h-18 w-12 shrink-0 items-center justify-center rounded-xl border transition-all"
      >
        <ChevronLeftIcon className="text-icon-primary h-5 w-5" />
      </button>

      <div className="flex flex-1 items-center justify-between gap-2">
        {weekDays.map((date, idx) => {
          const isSelected = isSameDay(selectedDate, date);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onDateSelect(date)}
              className={`flex h-18 flex-1 flex-col items-center justify-center rounded-xl border transition-all ${
                isSelected
                  ? "bg-color-tertiary text-color-inverse border-color-tertiary shadow-md"
                  : "bg-background-primary border-border-primary hover:bg-background-secondary"
              }`}
            >
              <span className="text-xs-m mb-1">{dayLabels[idx]}</span>
              <span className="text-xl-b leading-none">{date.getDate()}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onNextWeek}
        className="bg-background-primary border-border-primary hover:bg-background-secondary flex h-18 w-12 shrink-0 items-center justify-center rounded-xl border transition-all"
      >
        <ChevronRightIcon className="text-icon-primary h-5 w-5" />
      </button>
    </div>
  );
};
