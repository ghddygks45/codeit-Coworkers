import { useRef, useState } from "react";
import Dropdown, { Option } from "../../Dropdown/Dropdown";
import { Input } from "../../Input/Input";
import CalendarDate from "../../Calendar/CalendarDate";
import CalendarTime from "../../Calendar/CalendarTime";
import getDateTime from "@/utils/dateTime";
import { useClickOutside } from "@/hooks/useClickOutside";

interface TaskData {
  title: string;
  date: Date | null;
  time: string | null;
  repeat: string;
  selectedDays: string[];
  memo: string;
}

interface TaskCreateModalProps {
  onClose: () => void;
  onCreate: (data: TaskData) => void;
}

const weekDays: string[] = ["일", "월", "화", "수", "목", "금", "토"];

export default function TaskCreateModal({
  onClose,
  onCreate,
}: TaskCreateModalProps) {
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [selectDay, setSelectDay] = useState<Option | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const dateLayerRef = useRef<HTMLDivElement>(null);
  const timeLayerRef = useRef<HTMLDivElement>(null);

  useClickOutside(dateLayerRef, () => setIsDateOpen(false));
  useClickOutside(timeLayerRef, () => setIsTimeOpen(false));

  const formattedDate = date ? getDateTime(date).dateString : "";
  const { dateString, timeString } = getDateTime();

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

    const newTask: TaskData = {
      title,
      date,
      time,
      repeat: selectDay?.label || "반복 안함",
      selectedDays,
      memo,
    };

    onCreate(newTask);
    onClose();
  };

  return (
    <div className="font-pretendard bg-background-primary w-93.75 rounded-2xl p-6 shadow-xl md:w-112.5">
      <div className="flex flex-col">
        <div className="relative mb-5 flex items-center justify-center">
          <h2 className="text-2lg-b text-color-primary">할 일 만들기</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-color-tertiary hover:text-brand-primary absolute right-0 transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-md-r text-color-default mb-10 text-center">
          할 일은 실제로 행동 가능한 작업 중심으로
          <br /> 작성해주시면 좋습니다.
        </p>

        {/* 할 일 제목 입력 */}
        <div className="mb-5 flex flex-col gap-2 text-left">
          <label className="text-md-sb text-color-primary" htmlFor="todoTitle">
            할 일 제목
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="search"
            className="ring-border-primary focus:ring-brand-primary border-none ring-1"
            placeholder="할 일 제목을 입력해주세요."
          />
        </div>

        {/* 시작 날짜 및 시간 선택 */}
        <div className="mb-5 flex flex-col text-left">
          <label className="text-md-sb text-color-primary mb-2">
            시작 날짜 및 시간
          </label>
          <div className="relative flex flex-row gap-2">
            <input
              type="text"
              value={formattedDate}
              readOnly
              onClick={() => {
                setIsDateOpen(!isDateOpen);
                setIsTimeOpen(false);
              }}
              className="placeholder-color-default text-color-default border-border-primary text-md-r focus:ring-brand-primary h-12 w-3/5 cursor-pointer rounded-xl border border-solid p-4 caret-transparent focus:ring-1 focus:outline-none"
              placeholder={dateString}
            />
            <input
              type="text"
              value={time ?? ""}
              readOnly
              onClick={() => {
                setIsTimeOpen(!isTimeOpen);
                setIsDateOpen(false);
              }}
              className="placeholder-color-default text-color-default border-border-primary text-md-r focus:ring-brand-primary h-12 w-2/5 cursor-pointer rounded-xl border border-solid p-4 caret-transparent focus:ring-1 focus:outline-none"
              placeholder={timeString}
            />
          </div>

          {/* 레이어 영역 (Calendar) */}
          <div className="relative">
            {isDateOpen && (
              <div
                className="animate-fadeDown ring-brand-primary bg-background-primary absolute top-2 left-0 z-99 w-full rounded-xl pb-2 shadow-2xl ring-1"
                ref={dateLayerRef}
              >
                <div className="flex items-center justify-center">
                  <CalendarDate
                    selectedDate={date}
                    onSelectDate={(date) => {
                      setDate(date);
                      setIsDateOpen(false);
                    }}
                  />
                </div>
              </div>
            )}
            {isTimeOpen && (
              <div
                className="animate-fadeDown ring-brand-primary bg-background-primary absolute top-2 right-0 z-99 w-full rounded-xl p-4 shadow-2xl ring-1"
                ref={timeLayerRef}
              >
                <div className="flex items-center justify-center">
                  <CalendarTime
                    selectedTime={time}
                    onSelectTime={(time) => {
                      setTime(time);
                      setIsTimeOpen(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 반복 설정 드롭다운 */}
        <div className="mb-5 flex flex-col gap-2 text-left">
          <label className="text-md-sb text-color-primary" htmlFor="repeat">
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

        {/* 반복 요일 (조건부 렌더링) */}
        {(selectDay?.label === "주 반복" || selectDay?.label === "월 반복") && (
          <div className="animate-fadeDown mb-5 flex flex-col gap-2">
            <label className="text-md-sb text-color-primary">반복 요일</label>
            <ul className="flex flex-row justify-between">
              {weekDays.map((item) => {
                const isSelected = selectedDays.includes(item);
                return (
                  <li
                    key={item}
                    onClick={() => toggleDay(item)}
                    className={`text-sm-m flex h-11 w-12 cursor-pointer items-center justify-center rounded-xl border transition-all duration-200 select-none ${
                      isSelected
                        ? "bg-brand-primary text-color-inverse border-brand-primary"
                        : "text-color-primary border-border-primary hover:bg-background-secondary"
                    }`}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* 할 일 메모 입력 */}
        <div className="mb-10 flex flex-col gap-2 text-left">
          <label className="text-md-sb text-color-primary" htmlFor="todoMemo">
            할 일 메모
          </label>
          <Input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            size="content"
            className="ring-border-primary focus:ring-brand-primary border-none ring-1"
            placeholder="메모를 입력해주세요."
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="bg-brand-primary text-lg-b text-color-inverse hover:bg-interaction-hover active:bg-interaction-pressed h-12 w-full rounded-xl text-center transition-all active:scale-[0.98]"
      >
        만들기
      </button>
    </div>
  );
}
