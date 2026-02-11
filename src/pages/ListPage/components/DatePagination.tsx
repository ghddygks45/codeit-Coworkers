import React from "react";
import ChevronLeftIcon from "@/assets/arrow-left.svg";
import ChevronRightIcon from "@/assets/arrow-right.svg";

interface DatePaginationProps {
  selectedDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const DatePagination = ({
  selectedDate,
  onPrevMonth,
  onNextMonth,
}: DatePaginationProps) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5">
      <span className="text-md-sb text-color-primary min-w-21.25 text-center">
        {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
      </span>

      {/* 화살표 버튼 그룹 */}
      <div className="ml-1 flex gap-1">
        <button
          type="button"
          onClick={onPrevMonth}
          className="hover:bg-background-tertiary border-border-primary rounded-4xl border p-0.5 transition-colors"
        >
          <ChevronLeftIcon className="text-icon-primary h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onNextMonth}
          className="hover:bg-background-tertiary border-border-primary rounded-4xl border p-0.5 transition-colors"
        >
          <ChevronRightIcon className="text-icon-primary h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default DatePagination;
