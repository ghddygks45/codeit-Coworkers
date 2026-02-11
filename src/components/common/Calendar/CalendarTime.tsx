import { useState } from "react";

/**
 * CalendarTime 컴포넌트에 전달되는 props 타입
 */
interface Props {
  /**
   * 현재 선택된 시간
   * @example "14:30"
   * @default null
   */
  selectedTime: string | null;

  /**
   * 시간을 클릭했을 때 호출되는 콜백 함수
   * @param time 선택된 시간 문자열 ("HH:mm")
   */
  onSelectTime: (time: string) => void;
}

/**
 * 오전/오후를 전환하며 시간을 선택할 수 있는 시간 선택 컴포넌트입니다.
 *
 * - 시간은 "HH:mm" 형식의 문자열로 반환됩니다.
 * - 날짜나 표시 포맷에 대한 책임은 가지지 않습니다.
 *
 * @component
 * @example
 * ```tsx
 * const [time, setTime] = useState<string | null>(null);
 *
 * <CalendarTime
 *   selectedTime={time}
 *   onSelectTime={setTime}
 * />
 * ```
 */

interface Props {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

const AM_TIMES = [
  "00:00",
  "00:30",
  "01:00",
  "01:30",
  "02:00",
  "02:30",
  "03:00",
  "03:30",
  "04:00",
  "04:30",
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
];
const PM_TIMES = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
];

export default function CalendarTime({ selectedTime, onSelectTime }: Props) {
  const [period, setPeriod] = useState<"am" | "pm">("am");
  const times = period === "am" ? AM_TIMES : PM_TIMES;

  return (
    <>
      <style>{`
        /* 1. Chrome, Safari, Edge (Webkit) */
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* 2. Firefox */
        .custom-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      {/* 전체 컨테이너 */}
      <div className="border-border-primary box-border flex h-44 w-[288px] gap-3.5 rounded-[20px] bg-white p-3">
        {/* 1. 오전/오후 버튼 영역 */}
        <div className="flex flex-col gap-2">
          {(["am", "pm"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-md-m flex h-10 w-19.5 items-center justify-center rounded-[10px] border border-solid transition-all ${
                period === p
                  ? "bg-brand-primary text-color-inverse border-brand-primary"
                  : "text-color-disabled border-border-primary hover:bg-background-secondary bg-white"
              } `}
            >
              {p === "am" ? "오전" : "오후"}
            </button>
          ))}
        </div>

        {/* 2. 시간 리스트 영역 */}
        <div className="border-border-primary box-border h-full flex-1 overflow-hidden rounded-2xl border bg-white">
          <div className="custom-scrollbar h-full overflow-x-hidden overflow-y-auto">
            {times.map((time) => {
              const active = selectedTime === time;

              return (
                <button
                  key={time}
                  onClick={() => onSelectTime(time)}
                  className={`text-lg-r flex w-full py-[7.5px] pl-4 text-left whitespace-nowrap transition-colors ${
                    active
                      ? "bg-brand-secondary text-brand-primary font-bold"
                      : "text-color-secondary hover:bg-background-secondary"
                  } `}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
