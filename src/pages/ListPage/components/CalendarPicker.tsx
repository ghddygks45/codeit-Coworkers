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
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${
          showCalendar
            ? "bg-brand-primary/10"
            : "bg-[#F1F5F9] hover:bg-[#E2E8F0]"
        }`}
      >
        <CalendarIconSvg
          className={`h-3.5 w-3.5 transition-colors ${
            showCalendar ? "text-brand-primary" : "text-icon-primary"
          }`}
        />
      </button>

      {showCalendar && (
        <div className="absolute top-full right-0 z-50 mt-3 shadow-2xl">
          <CalendarDate
            selectedDate={selectedDate}
            onSelectDate={(date: Date) => {
              onDateSelect(date);
              setShowCalendar(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
