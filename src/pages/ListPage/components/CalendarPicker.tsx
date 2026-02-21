import React from "react";
import CalendarIconSvg from "@/assets/calendar.svg";
import CalendarDate from "@/components/common/Calendar/CalendarDate";

interface CalendarPickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
}

const CalendarPicker = ({
  selectedDate,
  onDateSelect,
  showCalendar,
  setShowCalendar,
}: CalendarPickerProps) => {
  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={() => setShowCalendar(!showCalendar)}
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-all sm:h-8 sm:w-8 ${
          showCalendar
            ? "bg-brand-primary/10"
            : "bg-background-secondary hover:bg-border-primary"
        }`}
      >
        <CalendarIconSvg
          className={`h-3.5 w-3.5 transition-colors sm:h-4 sm:w-4 ${
            showCalendar ? "text-brand-primary" : "text-icon-primary"
          }`}
        />
      </button>

      {showCalendar && (
        <div className="absolute top-full right-0 z-50 mt-3 shadow-2xl">
          {/* CalendarDate 컴포넌트 내부도 모바일 대응이 되어있다고 가정합니다 */}
          <div className="origin-top-right">
            <CalendarDate
              selectedDate={selectedDate}
              onSelectDate={(date: Date) => {
                onDateSelect(date);
                setShowCalendar(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
