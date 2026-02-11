import { useState } from "react";
import CalendarDate from "./CalendarDate";
import CalendarTime from "./CalendarTime";

/**
 * Calendar 컴포넌트
 *
 * - CalendarDate와 CalendarTime 컴포넌트를 조합하여
 *   날짜와 시간을 선택할 수 있는 캘린더 UI를 제공합니다.
 * - 날짜를 선택하면 시간 선택이 초기화되고,
 *   날짜와 시간이 모두 선택되면 선택된 값을 화면에 표시합니다.
 *
 * @component
 * @example
 * ```tsx
 * const [selectedDate, setSelectedDate] = useState<Date | null>(null);
 * const [selectedTime, setSelectedTime] = useState<string | null>(null);
 *
 * <Calendar />
 * ```
 *
 * @remarks
 * - 내부적으로 CalendarDate, CalendarTime 컴포넌트를 사용합니다.
 * - 선택된 날짜와 시간은 상태(state)로 관리되며,
 *   선택 시 UI에 즉시 반영됩니다.
 * - 날짜와 시간 표시 포맷은 `toLocaleDateString()`과 "HH:mm" 문자열을 사용합니다.
 */

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  return (
    <div className="bg-background-primary border-border-primary font-pretendard flex w-78 flex-col items-center rounded-3xl border p-2 shadow-lg">
      <CalendarDate
        selectedDate={selectedDate}
        onSelectDate={handleDateChange}
      />

      <div className="bg-border-primary my-2 h-px w-[90%]" />

      <CalendarTime
        selectedTime={selectedTime}
        onSelectTime={setSelectedTime}
      />

      {selectedDate && selectedTime && (
        <div className="bg-brand-secondary mt-2 w-full rounded-b-[20px] p-4 text-center">
          <p className="text-md-m text-brand-primary">
            {selectedDate.toLocaleDateString()} {selectedTime} 선택됨
          </p>
        </div>
      )}
    </div>
  );
}
