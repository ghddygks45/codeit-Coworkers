import { useMemo, useState } from "react";

/**
 * CalendarDate 컴포넌트에 전달되는 props 타입
 */
interface Props {
  /**
   * 현재 선택된 날짜
   * @default null
   */
  selectedDate: Date | null;

  /**
   * 날짜를 선택했을 때 호출되는 콜백 함수
   * @param date 선택된 날짜 (Date 객체)
   */
  onSelectDate: (date: Date) => void;
}

/**
 * CalendarDate 컴포넌트
 *
 * - 연, 월, 일 단위로 날짜를 선택할 수 있는 캘린더 컴포넌트입니다.
 * - 선택된 날짜는 `Date` 객체 형태로 반환됩니다.
 * - 시간 선택이나 표시 포맷은 이 컴포넌트에서 처리하지 않습니다.
 *
 * @component
 * @example
 * ```tsx
 * const [date, setDate] = useState<Date | null>(null);
 *
 * <CalendarDate
 *   selectedDate={date}
 *   onSelectDate={setDate}
 * />
 * ```
 */

interface Props {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

type PickerMode = "calendar" | "month" | "year";

export default function CalendarDate({ selectedDate, onSelectDate }: Props) {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [mode, setMode] = useState<PickerMode>("calendar");

  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevLastDate = new Date(currentYear, currentMonth, 0).getDate();

    const result: { day: number; isCurrentMonth: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      result.push({ day: prevLastDate - i, isCurrentMonth: false });
    }

    for (let d = 1; d <= lastDate; d++) {
      result.push({ day: d, isCurrentMonth: true });
    }

    while (result.length % 7 !== 0) {
      result.push({
        day: result.length - lastDate,
        isCurrentMonth: false,
      });
    }

    return result;
  }, [currentYear, currentMonth]);

  const handleHeaderClick = () => {
    setMode((prev) =>
      prev === "calendar" ? "month" : prev === "month" ? "year" : "calendar",
    );
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isSelected = (day: number, isCurrentMonth: boolean) =>
    isCurrentMonth &&
    selectedDate &&
    selectedDate.getFullYear() === currentYear &&
    selectedDate.getMonth() === currentMonth &&
    selectedDate.getDate() === day;

  const isToday = (day: number, isCurrentMonth: boolean) =>
    isCurrentMonth &&
    today.getFullYear() === currentYear &&
    today.getMonth() === currentMonth &&
    today.getDate() === day;

  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  return (
    <div className="bg-background-primary font-pretendard box-border w-62.5 rounded-xl p-4">
      {/* ===== 헤더 ===== */}
      <div className="mb-2 flex h-8.75 items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="hover:bg-background-secondary text-color-tertiary flex h-8.5 w-8.5 items-center justify-center rounded-full"
        >
          ◀
        </button>

        <button
          onClick={handleHeaderClick}
          className="text-lg-sb text-color-tertiary hover:text-brand-primary h-8.75 transition-colors"
        >
          {currentYear}년 {currentMonth + 1}월
        </button>

        <button
          onClick={handleNextMonth}
          className="hover:bg-background-secondary text-color-tertiary flex h-8.5 w-8.5 items-center justify-center rounded-full"
        >
          ▶
        </button>
      </div>

      {/* ===== 달력 모드 ===== */}
      {mode === "calendar" && (
        <>
          <div className="text-md-m text-color-disabled mb-1 grid grid-cols-[repeat(7,1fr)] text-center">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div key={d} className="flex h-8 items-center justify-center">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[repeat(7,1fr)] gap-y-1">
            {days.map(({ day, isCurrentMonth }, idx) => {
              const active = isSelected(day, isCurrentMonth);

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (isCurrentMonth) {
                      onSelectDate(new Date(currentYear, currentMonth, day));
                    } else {
                      const targetDate = new Date(
                        currentYear,
                        idx < 7 ? currentMonth - 1 : currentMonth + 1,
                        day,
                      );
                      setCurrentYear(targetDate.getFullYear());
                      setCurrentMonth(targetDate.getMonth());
                      onSelectDate(targetDate);
                    }
                  }}
                  className={`text-md-r flex aspect-square w-full items-center justify-center rounded-lg transition-all ${
                    active
                      ? "bg-brand-primary text-color-inverse"
                      : isToday(day, isCurrentMonth)
                        ? "text-brand-primary font-semibold"
                        : isCurrentMonth
                          ? "text-color-primary hover:bg-background-secondary"
                          : "text-color-disabled hover:bg-background-secondary opacity-50"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ===== 월 선택 모드 ===== */}
      {mode === "month" && (
        <div className="grid w-full grid-cols-3 gap-2">
          {Array.from({ length: 12 }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentMonth(i);
                setMode("calendar");
              }}
              className={`text-md-m h-10 rounded-lg text-center transition-colors ${
                currentMonth === i
                  ? "bg-brand-primary text-color-inverse"
                  : "bg-background-secondary text-color-secondary hover:bg-background-tertiary"
              }`}
            >
              {i + 1}월
            </button>
          ))}
        </div>
      )}

      {/* ===== 년도 선택 모드 ===== */}
      {mode === "year" && (
        <div className="grid max-h-60 w-full grid-cols-3 gap-2 overflow-y-auto pr-1">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => {
                setCurrentYear(year);
                setMode("month");
              }}
              className={`text-md-m h-10 rounded-lg text-center transition-colors ${
                currentYear === year
                  ? "bg-brand-primary text-color-inverse"
                  : "bg-background-secondary text-color-secondary hover:bg-background-tertiary"
              }`}
            >
              {year}년
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
