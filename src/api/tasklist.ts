// ========================================
// TaskList API
// Swagger: tasklist
// ========================================

import { TaskListServer } from "@/types/tasklist";
import { BASE_URL } from "./config";
import { fetchClient } from "@/lib/fetchClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// TaskList 단일 조회
export async function getTaskList(
  groupId: number,
  taskListId: number,
): Promise<TaskListServer> {
  return await fetchClient(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

// TaskList 생성
export async function createTaskList(
  groupId: number,
  newName: string,
): Promise<TaskListServer> {
  return await fetchClient(`${BASE_URL}/groups/${groupId}/task-lists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: newName }),
  });
}

// react-query를 활용한 taskList 생성 훅
export function useCreateTaskList(groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newName: string) => createTaskList(groupId, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

// TaskList 수정
export async function updateTaskList(
  groupId: number,
  taskListId: number,
  newName: string,
): Promise<TaskListServer> {
  return await fetchClient(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    },
  );
}

// react-query를 활용한 taskList 수정 훅
export function useUpdateTaskList(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskListId,
      newName,
    }: {
      taskListId: number;
      newName: string;
    }) => updateTaskList(groupId, taskListId, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

// TaskList 삭제
export async function deleteTaskList(
  groupId: number,
  taskListId: number,
): Promise<void> {
  return await fetchClient(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

// react-query를 활용한 taskList 삭제 훅
export function useDeleteTaskList(groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskListId: number) => deleteTaskList(groupId, taskListId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}
