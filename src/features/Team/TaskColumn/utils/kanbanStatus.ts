import { TaskListServer } from "@/types/taskList";

export type KanbanStatus = "todo" | "doing" | "done";

// 할 일 목록 이름에서 상태를 파싱하는 함수
export function getGroupType(name: string): "doing" | "todo" {
  return name.includes("{status:doing}") ? "doing" : "todo";
}

// 서버에서 받은 할 일 목록을 상태별로 분류하는 함수
export function kanbanGroupStatus(taskLists: TaskListServer[]): {
  todo: TaskListServer[];
  doing: TaskListServer[];
  done: TaskListServer[];
} {
  const done = taskLists.filter(
    (tasklist) =>
      tasklist.tasks.length > 0 && tasklist.tasks.every((task) => task.doneAt),
  );
  const doing = taskLists.filter(
    (tasklist) =>
      !done.includes(tasklist) && getGroupType(tasklist.name) === "doing",
  );
  const todo = taskLists.filter(
    (tasklist) =>
      !done.includes(tasklist) && getGroupType(tasklist.name) === "todo",
  );
  return { todo, doing, done };
}
