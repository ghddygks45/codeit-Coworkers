import { useEffect, useRef, useState } from "react";
import Dropdown from "../../Dropdown/Dropdown";
import { Input } from "../../Input/Input";
import CalendarDate from "../../Calendar/CalendarDate";
import CalendarTime from "../../Calendar/CalendarTime";
import getDateTime from "@/utils/dateTime";
import { useClickOutside } from "@/hooks/useClickOutside";

type RepeatType = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

type TaskUpdatePayload = {
  title: string;
  description: string;
  startDate: string;
  frequencyType: RepeatType;
  weekDays: number[];
  monthDay: number;
  isRecurring: boolean;
};

interface TaskUpdateModalProps {
  onClose: () => void;
  onUpdate: (data: TaskUpdatePayload) => void;
  initialTask: {
    id: number;
    title: string;
    description?: string | null;
    startDate: string;
    frequencyType: RepeatType;
    weekDays?: number[];
  };
  isPending?: boolean;
}

const weekDaysLabels = ["일", "월", "화", "수", "목", "금", "토"] as const;

const frequencyToLabel = (f: RepeatType) => {
  if (f === "DAILY") return "매일";
  if (f === "WEEKLY") return "주 반복";
  if (f === "MONTHLY") return "월 반복";
  return "반복 안함";
};

const labelToFrequency = (label: string): RepeatType => {
  if (label === "매일") return "DAILY";
  if (label === "주 반복") return "WEEKLY";
  if (label === "월 반복") return "MONTHLY";
  return "ONCE";
};

const KOREAN_WEEKDAY_TO_JS: Record<string, number> = {
  일: 0,
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
};

const SERVER_TO_KR_DAY: Record<number, string> = {
  1: "일",
  2: "월",
  3: "화",
  4: "수",
  5: "목",
  6: "금",
  7: "토",
};

export default function TaskUpdateModal({
  onClose,
  onUpdate,
  initialTask,
  isPending = false,
}: TaskUpdateModalProps) {
  const initialDate = new Date(initialTask.startDate);

  const [title, setTitle] = useState(initialTask.title);
  const [memo, setMemo] = useState(initialTask.description ?? "");
  const [date, setDate] = useState<Date | null>(initialDate);
  const [time, setTime] = useState(getDateTime(initialDate).timeString);
  const [selectDay, setSelectDay] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    (initialTask.weekDays ?? [])
      .map((d) => SERVER_TO_KR_DAY[d])
      .filter((v): v is string => Boolean(v)),
  );

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const dateContainerRef = useRef<HTMLDivElement>(null);
  const timeContainerRef = useRef<HTMLDivElement>(null);

  useClickOutside(dateContainerRef, () => setIsDateOpen(false));
  useClickOutside(timeContainerRef, () => setIsTimeOpen(false));

  const { dateString } = getDateTime();

  // Focus Trap
  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;
    const focusableElements = modalElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKeyPress = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    firstElement?.focus();
    window.addEventListener("keydown", handleTabKeyPress);
    return () => window.removeEventListener("keydown", handleTabKeyPress);
  }, []);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day],
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("할 일 제목을 입력해주세요!");
      return;
    }

    const repeatLabel =
      selectDay?.label ?? frequencyToLabel(initialTask.frequencyType);

    const frequencyType = labelToFrequency(repeatLabel);
    const isRecurring = frequencyType !== "ONCE";

    const mappedWeekDays = selectedDays
      .map((day) => KOREAN_WEEKDAY_TO_JS[day])
      .filter((v): v is number => v !== undefined)
      .map((v) => v + 1); // 서버가 1~7 요구 시

    // 주 반복이면 요일 최소 1개 선택
    if (repeatLabel === "주 반복" && selectedDays.length === 0) {
      alert("주 반복은 반복 요일을 최소 1개 선택해주세요!");
      return;
    }

    let finalStartDate: string;

    if (date) {
      const combinedDate = new Date(date);

      if (time && time.includes(":")) {
        const timeParts = time.split(" ");
        const hourMin = timeParts.length > 1 ? timeParts[1] : timeParts[0];
        let [hours] = hourMin.split(":").map(Number);
        const [minutes] = hourMin.split(":").map(Number);

        const isPM = time.includes("오후");
        if (isPM && hours < 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;

        combinedDate.setHours(hours, minutes, 0, 0);
      }

      finalStartDate = combinedDate.toISOString();
    } else {
      finalStartDate = new Date().toISOString();
    }
    onUpdate({
      title: title.trim(),
      description: memo.trim(),
      startDate: finalStartDate,
      frequencyType,
      weekDays: isRecurring && frequencyType === "WEEKLY" ? mappedWeekDays : [],
      monthDay:
        frequencyType === "MONTHLY" ? new Date(finalStartDate).getDate() : 0,
      isRecurring,
    });
  };

  const repeatLabel =
    selectDay?.label ?? frequencyToLabel(initialTask.frequencyType);

  return (
    <div ref={modalRef} tabIndex={-1} className="p-5 outline-none">
      <div className="flex flex-col">
        <div className="relative mb-5 flex items-center justify-center">
          <h2 className="text-2lg-b text-color-primary font-bold">
            할 일 수정
          </h2>
        </div>

        <p className="text-md-r text-color-default mb-10 text-center">
          할 일은 실제로 행동 가능한 작업 중심으로 <br /> 작성해주시면 좋습니다.
        </p>

        <div className="mb-5 flex flex-col gap-2 text-left">
          <label className="text-md-sb text-color-primary font-bold">
            할 일 제목
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="search"
            placeholder="제목을 입력해주세요."
          />
        </div>

        <div className="mb-5 flex flex-col text-left">
          <label className="text-md-sb text-color-primary mb-2 font-bold">
            시작 날짜 및 시간
          </label>
          <div className="relative flex flex-row gap-2">
            <div className="relative w-3/5" ref={dateContainerRef}>
              <input
                readOnly
                value={date ? getDateTime(date).dateString : ""}
                onClick={() => setIsDateOpen(!isDateOpen)}
                className="border-border-primary text-md-r focus:ring-brand-primary h-12 w-full cursor-pointer rounded-xl border bg-transparent p-4 outline-none focus:ring-1"
                placeholder={dateString}
              />
              {isDateOpen && (
                <div className="bg-background-primary ring-brand-primary absolute top-14 left-0 z-99 flex w-100 justify-center rounded-xl pb-2 shadow-2xl ring-1">
                  <CalendarDate
                    selectedDate={date}
                    onSelectDate={(d) => {
                      setDate(d);
                      setIsDateOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
            <div className="relative w-2/5" ref={timeContainerRef}>
              <input
                readOnly
                value={time}
                onClick={() => setIsTimeOpen(!isTimeOpen)}
                className="border-border-primary text-md-r focus:ring-brand-primary h-12 w-full cursor-pointer rounded-xl border bg-transparent p-4 outline-none focus:ring-1"
                placeholder="시간 선택"
              />
              {isTimeOpen && (
                <div className="bg-background-primary ring-brand-primary absolute top-14 right-0 z-99 flex w-100 justify-center rounded-xl p-4 shadow-2xl ring-1">
                  <CalendarTime
                    selectedTime={time}
                    onSelectTime={(t) => {
                      setTime(t);
                      setIsTimeOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 text-left">
          <label className="text-md-sb text-color-primary font-bold">
            반복 설정
          </label>
          <div className="w-32.5">
            <Dropdown
              optionsKey="repeat"
              defaultLabel={frequencyToLabel(initialTask.frequencyType)}
              onSelect={(item) => {
                setSelectDay(item);
                if (item.label !== "주 반복") {
                  setSelectedDays([]);
                }
              }}
            />
          </div>
        </div>

        {/* ✅ 주 반복일 때만 요일 선택 */}
        {repeatLabel === "주 반복" && (
          <div className="mb-5 flex flex-col gap-2">
            <label className="text-md-sb text-color-primary font-bold">
              반복 요일
            </label>
            <ul className="flex flex-row justify-between">
              {weekDaysLabels.map((item) => (
                <li
                  key={item}
                  tabIndex={0}
                  onClick={() => toggleDay(item)}
                  className={`text-sm-m flex h-11 w-12 cursor-pointer items-center justify-center rounded-xl border transition-all ${
                    selectedDays.includes(item)
                      ? "bg-brand-primary border-brand-primary text-white"
                      : "text-color-primary border-border-primary hover:bg-background-secondary"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 월 반복은 서버가 monthDay(1~31)를 요구할 가능성이 높아서,
            UI에서 따로 “반복 일”을 받지 않아도, 선택한 날짜의 getDate()로 서버에 보냄 */}

        <div className="mb-10 flex flex-col gap-2 text-left">
          <label className="text-md-sb text-color-primary font-bold">
            할 일 메모
          </label>
          <Input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            size="content"
            placeholder="메모를 입력해주세요."
          />
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <button
          onClick={onClose}
          disabled={isPending}
          className="border-border-primary w-1/2 rounded-xl border-1"
        >
          취소하기
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-brand-primary text-lg-b h-12 w-1/2 rounded-xl text-white transition-all active:scale-[0.98]"
        >
          {isPending ? "수정 중..." : "수정하기"}
        </button>
      </div>
    </div>
  );
}
