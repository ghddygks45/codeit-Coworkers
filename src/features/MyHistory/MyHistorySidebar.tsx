import type { TaskListServer } from "@/types/taskList";

interface Props {
  selectedDate: Date;
  selectedTaskListId: number | null;
  onTaskListSelect: (id: number) => void;
  activeTaskLists: TaskListServer[];
  taskListCounts: Map<number, number>;
}

export default function MyHistorySidebar({
  selectedDate,
  selectedTaskListId,
  onTaskListSelect,
  activeTaskLists,
  taskListCounts,
}: Props) {
  return (
    <div className="hidden w-[322px] lg:block">
      <h3 className="text-xl-b text-color-primary">내가 한 일</h3>
      <div className="mt-[40px] flex flex-col gap-[55px] overflow-y-auto pr-[52px]">
        <div>
          <h4 className="text-lg-m text-color-primary">
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
          </h4>
          {activeTaskLists.length === 0 ? (
            <p className="text-md-m text-color-default flex h-[120px] items-center justify-center">
              해당 월에 완료된 할 일이 없습니다.
            </p>
          ) : (
            <ul className="mt-[17px] flex flex-col gap-1">
              {activeTaskLists.map((tasklist) => {
                const count = taskListCounts.get(tasklist.id) ?? 0;

                return (
                  <li key={tasklist.id}>
                    <button
                      type="button"
                      onClick={() => onTaskListSelect(tasklist.id)}
                      className={`flex h-[54px] w-[270px] items-center justify-between rounded-[12px] border-1 px-[20px] ${
                        selectedTaskListId === tasklist.id
                          ? "border-brand-primary bg-background-primary"
                          : "hover:border-brand-primary bg-background-primary border-border-primary"
                      }`}
                    >
                      <span className="text-md-sb text-color-primary">
                        {tasklist.name}
                      </span>
                      <span className="text-md-b text-brand-primary">
                        {count}개
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
