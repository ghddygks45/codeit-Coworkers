import type { TaskListServer } from "@/types/taskList";
import type { TaskDoneClient } from "@/types/user";
import MyTasks from "@/features/MyHistory/components/MyTasks";
import DatePagination from "@/pages/ListPage/components/DatePagination";
import CalendarPicker from "@/pages/ListPage/components/CalendarPicker";

type ProcessedData = Record<string, Record<string, TaskDoneClient[]>>;

interface Props {
  selectedDate: Date;
  selectedTaskListId: number | null;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateSelect: (date: Date) => void;
  onTaskListSelect: (id: number) => void;
  activeTaskLists: TaskListServer[];
  taskListCounts: Map<number, number>;
  processedData: ProcessedData;
}

export default function MyHistoryContent({
  selectedDate,
  selectedTaskListId,
  showCalendar,
  setShowCalendar,
  onPrevMonth,
  onNextMonth,
  onDateSelect,
  onTaskListSelect,
  activeTaskLists,
  taskListCounts,
  processedData,
}: Props) {
  return (
    <div className="bg-background-primary w-full rounded-[20px] px-[22px] pt-[33px] pb-[52px] md:px-[30px] md:pt-[46px] lg:w-[758px]">
      <div className="relative flex items-center justify-center md:justify-start">
        <DatePagination
          variant="myhistory"
          selectedDate={selectedDate}
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
        />
        <div className="absolute right-0">
          <CalendarPicker
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
          />
        </div>
      </div>

      {/* 모바일 목록 아이템 */}
      <div className="lg:hidden">
        <ul className="mt-[27px] flex flex-wrap gap-1 md:mt-[40px]">
          {activeTaskLists.map((tasklist) => {
            const count = taskListCounts.get(tasklist.id) ?? 0;
            const isSelected = selectedTaskListId === tasklist.id;

            return (
              <li key={tasklist.id}>
                <button
                  type="button"
                  onClick={() => onTaskListSelect(tasklist.id)}
                  className={`group flex h-[33px] shrink-0 items-center gap-1 rounded-[33px] border-1 px-[12px] md:h-[43px] md:rounded-[43px] md:px-[16px] ${
                    isSelected
                      ? "bg-brand-primary border-brand-primary"
                      : "bg-background-primary border-border-primary hover:bg-brand-primary hover:border-brand-primary"
                  }`}
                >
                  <span
                    className={`text-sm-m md:text-lg-m ${
                      isSelected
                        ? "text-color-inverse"
                        : "text-color-primary group-hover:text-color-inverse"
                    }`}
                  >
                    {tasklist.name}
                  </span>
                  <span
                    className={`text-md-b md:text-lg-b ${
                      isSelected
                        ? "text-color-inverse"
                        : "text-color-primary group-hover:text-color-inverse"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-[26px] min-h-[400px] md:mt-[28px]">
        <MyTasks processedData={processedData} />
      </div>
    </div>
  );
}
