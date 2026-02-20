import { useEffect, useRef, useState } from "react";
import Dropdown from "../../Dropdown/Dropdown";
import { Input } from "../../Input/Input";
import CalendarDate from "../../Calendar/CalendarDate";
import CalendarTime from "../../Calendar/CalendarTime";
import getDateTime from "@/utils/dateTime";
import { useClickOutside } from "@/hooks/useClickOutside";

export interface TaskData {
  title: string;
  startDate: string | null;
  description: string;
  taskListId: string | number;
  groupId: string | number;
  repeatLabel: string;
  isRecurring: boolean;
  selectedDays?: string[]; // ✅ 주 반복용 (예: ["월","수"])
}

interface TaskCreateModalProps {
  onClose: () => void;
  onCreate: (data: TaskData) => void;
  currentListId: number;
  currentGroupId: number;
}

const weekDays: string[] = ["일", "월", "화", "수", "목", "금", "토"];

export default function TaskCreateModal({
  onClose,
  onCreate,
  currentListId,
  currentGroupId,
}: TaskCreateModalProps) {
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState("");
  const [selectDay, setSelectDay] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

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

    const repeatLabel = selectDay?.label || "반복 안함";
    const isRecurring = !!(
      selectDay &&
      selectDay.label !== "반복 안함" &&
      selectDay.label !== "한 번"
    );

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
    const now = Date.now();
    if (new Date(finalStartDate).getTime() <= now) {
      finalStartDate = new Date(now + 60 * 1000).toISOString();
    }

    onCreate({
      title,
      description: memo,
      startDate: finalStartDate,
      taskListId: currentListId,
      groupId: currentGroupId,
      repeatLabel,
      isRecurring,
      selectedDays: repeatLabel === "주 반복" ? selectedDays : [],
    });
  };

  const repeatLabel = selectDay?.label || "반복 안함";

  return (
    <div ref={modalRef} tabIndex={-1} className="outline-none">
      <div className="flex flex-col">
        <div className="relative mb-5 flex items-center justify-center">
          <h2 className="text-2lg-b text-color-primary font-bold">
            할 일 만들기
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-color-tertiary absolute right-0"
          >
            ✕
          </button>
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
              defaultLabel="반복 안함"
              onSelect={(item) => {
                setSelectDay(item);
                setSelectedDays([]);
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
              {weekDays.map((item) => (
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

      <button
        type="button"
        onClick={handleSubmit}
        className="bg-brand-primary text-lg-b h-12 w-full rounded-xl text-white transition-all active:scale-[0.98]"
      >
        만들기
      </button>
    </div>
  );
}
