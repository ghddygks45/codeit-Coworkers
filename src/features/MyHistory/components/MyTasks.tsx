import { TaskDoneClient } from "@/types/user";
import Todo from "@/components/common/Todo/todo";
import CalendarIcon from "@/assets/calendar.svg";
import RepeatIcon from "@/assets/repeat.svg";

const FREQUENCY_LABEL = {
  ONCE: "한번",
  DAILY: "매일 반복",
  WEEKLY: "주 반복",
  MONTHLY: "월 반복",
} as const;

type ProcessedData = Record<string, Record<string, TaskDoneClient[]>>;

function formatDate(dateKey: string, showWeekday = true) {
  const date = new Date(dateKey);
  const datePart = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!showWeekday) return datePart;

  const weekday = date.toLocaleDateString("ko-KR", {
    weekday: "short",
  });
  return `${datePart} (${weekday})`;
}

export default function MyTasks({
  processedData,
}: {
  processedData: ProcessedData;
}) {
  const dateEntries = Object.entries(processedData).sort(
    ([a], [b]) => new Date(b).getTime() - new Date(a).getTime(),
  );

  if (dateEntries.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-md-m text-color-default">
          해당 날짜에 완료된 할 일이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-[40px] md:space-y-[45px] lg:space-y-[80px]">
        {dateEntries.map(([dateKey, taskLists]) => (
          <div key={dateKey}>
            {/* 날짜 구분선 */}
            <div className="before:bg-background-tertiary relative mb-[12px] flex items-center justify-center before:absolute before:top-[50%] before:left-0 before:block before:h-px before:w-full before:content-['']">
              <p className="text-md-r md:text-lg-m text-color-default bg-background-primary z-10 px-[20px]">
                {formatDate(dateKey, true)}
              </p>
            </div>

            {/* 목록별 task 카드 */}
            <div className="space-y-[28px] md:space-y-[48px]">
              {Object.entries(taskLists).map(([listName, tasks]) => (
                <div key={listName}>
                  <h5 className="text-md-b text-color-primary md:text-lg-b mb-[13px]">
                    {listName}
                  </h5>
                  <div className="space-y-[12px]">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="group bg-background-secondary flex h-[64px] items-center rounded-[8px] px-[14px] md:h-[67px]"
                      >
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center">
                            <div className="flex-none">
                              <Todo
                                content={task.title}
                                isCompleted={task.isCompleted}
                                className="gap-2 md:gap-2"
                                iconClassName="md:h-[16px] md:w-[16px]"
                              />
                            </div>
                          </div>

                          <div className="text-xs-m text-color-disabled mt-1.5 flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <CalendarIcon className="h-[14px] w-[14px] md:h-[16px] md:w-[16px]" />
                              <span>{formatDate(task.date, false)}</span>
                              <span>
                                {new Date(task.doneAt).toLocaleTimeString(
                                  "ko-KR",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                            </div>

                            {task.frequency !== "ONCE" && (
                              <>
                                <span className="text-gray-300">|</span>
                                <div className="flex items-center gap-1.5">
                                  <RepeatIcon className="h-4 w-4" />
                                  <span>{FREQUENCY_LABEL[task.frequency]}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
