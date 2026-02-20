import { useState } from "react";

export function useMyHistory() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedTaskListId, setSelectedTaskListId] = useState<number | null>(
    null,
  );
  const [isDayFilter, setIsDayFilter] = useState(false);

  // 월 이동 핸들러
  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() - 1);
    setSelectedDate(newDate);
    setIsDayFilter(false);
  };
  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + 1);
    setSelectedDate(newDate);
    setIsDayFilter(false);
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsDayFilter(true);
  };

  const handleTaskListSelect = (id: number) => {
    setSelectedTaskListId((prev) => (prev === id ? null : id));
  };

  return {
    selectedDate,
    showCalendar,
    setShowCalendar,
    selectedTaskListId,
    isDayFilter,
    handlePrevMonth,
    handleNextMonth,
    handleDateSelect,
    handleTaskListSelect,
  };
}
