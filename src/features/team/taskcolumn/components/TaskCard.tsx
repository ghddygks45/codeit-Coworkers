import React from "react";
import Badge from "@/components/common/Badge/Badge";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import Todo from "@/components/common/Todo/todo";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { TaskListServer } from "@/types/taskList";
import { useUpdateTask } from "@/api/task";

// 브라우저 기본 고스트 이미지 대신 카드 클론을 드래그 이미지로 등록한다.
// clone을 body에 붙였다가 rAF에서 즉시 제거해 화면에 보이지 않게 한다.
function createDragImage(e: React.DragEvent<HTMLElement>): void {
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const clone = el.cloneNode(true) as HTMLElement;

  clone.style.position = "fixed";
  clone.style.top = "0px";
  clone.style.left = "0px";
  clone.style.transform = "translate(-9999px, -9999px)";
  clone.style.width = `${rect.width}px`;
  clone.style.opacity = "1";
  clone.style.backgroundColor = "#fff";
  clone.style.mixBlendMode = "normal";
  clone.style.filter = "none";
  clone.style.backdropFilter = "none";
  clone.style.willChange = "transform";
  clone.style.borderRadius = "12px";
  clone.style.pointerEvents = "none";

  document.body.appendChild(clone);
  e.dataTransfer.setDragImage(
    clone,
    e.clientX - rect.left,
    e.clientY - rect.top,
  );
  requestAnimationFrame(() => {
    document.body.removeChild(clone);
  });
}

interface TaskCardProps {
  groupId: number;
  taskList: TaskListServer;
  badgeState: "start" | "ongoing" | "done";
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  isDragging?: boolean;
  onDragEnd?: () => void;
}

export default function TaskCard({
  groupId,
  taskList,
  badgeState,
  onEdit,
  onDelete,
  onDragStart,
  isDragging,
  onDragEnd,
}: TaskCardProps) {
  const { mutate: updateTaskDone } = useUpdateTask(groupId);
  const showTasks = badgeState !== "done";
  const cardPadding = showTasks
    ? "pt-[16px] pr-[16px] pb-[24px]"
    : "pt-[14px] pr-[12px] pb-[14px]";

  const isMobile = useIsMobile();

  return (
    <div
      className={`mt-[12px] lg:mt-[20px] ${isDragging ? "opacity-30" : ""}`}
      draggable
      onDragEnd={onDragEnd}
      onDragStart={(e: React.DragEvent<HTMLElement>) => {
        createDragImage(e);
        onDragStart();
      }}
    >
      <div
        className={`border-border-primary bg-background-primary rounded-[12px] border-1 pl-[20px] ${cardPadding}`}
      >
        <div className="flex items-center justify-between gap-1">
          <p className="text-color-primary text-md-sb truncate">
            {taskList.name.replace("{status:doing}", "").trim()}
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
                usePortal
                portalOffset={isMobile ? { top: 0, right: 102 } : undefined}
              />
            </button>
          </div>
        </div>
        {showTasks && (
          <div className="mt-[16px] space-y-[10px]">
            {taskList.tasks.map((task) => (
              <div key={task.id} onClick={(e) => e.stopPropagation()}>
                <Todo
                  content={task.name}
                  isCompleted={Boolean(task.doneAt)}
                  onToggle={() =>
                    updateTaskDone({
                      taskListId: taskList.id,
                      taskId: task.id,
                      done: !task.doneAt,
                    })
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
