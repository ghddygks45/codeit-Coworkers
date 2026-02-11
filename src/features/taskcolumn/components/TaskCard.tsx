import Badge from "@/components/common/Badge/Badge";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import Todo from "@/components/common/Todo/todo";
import { TaskListServer } from "@/types/tasklist";

interface TaskCardProps {
  taskList: TaskListServer;
  badgeState: "start" | "ongoing" | "done";
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskCard({
  taskList,
  badgeState,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const showTasks = badgeState !== "done";
  const cardPadding = showTasks
    ? "pt-[16px] pr-[16px] pb-[24px]"
    : "pt-[14px] pr-[12px] pb-[14px]";

  return (
    <div className="mt-[12px] lg:mt-[20px]">
      <div
        className={`border-border-primary bg-background-primary rounded-[12px] border-1 pl-[20px] ${cardPadding}`}
      >
        <div className="flex items-center justify-between gap-1">
          <p className="text-color-primary text-md-sb truncate">
            {taskList.name}
          </p>
          <div className="flex items-center">
            <Badge
              state={badgeState}
              size="small"
              current={taskList.tasks.filter((task) => task.doneAt).length}
              total={taskList.tasks.length}
            />
            <button type="button">
              <Dropdown
                options={[
                  { value: "수정하기", label: "수정하기", action: onEdit },
                  { value: "삭제하기", label: "삭제하기", action: onDelete },
                ]}
                listAlign="center"
                trigger="kebab"
              />
            </button>
          </div>
        </div>
        {showTasks && (
          <div className="mt-[16px]">
            {taskList.tasks.map((task) => (
              <Todo
                key={task.id}
                content={task.name}
                isCompleted={Boolean(task.doneAt)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
