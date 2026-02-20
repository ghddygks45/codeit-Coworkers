// ========================================
// Task API (현재 백엔드 스펙 기준)
// Swagger: task
// ========================================

import { TaskServer } from "@/types/task";
import { BASE_URL } from "./config";
import { fetchClient } from "@/lib/fetchClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// anyOf DTO
export type CreateTaskParams =
  | {
      name: string;
      description?: string;
      startDate: string;
      frequencyType: "ONCE";
    }
  | {
      name: string;
      description?: string;
      startDate: string;
      frequencyType: "DAILY";
    }
  | {
      name: string;
      description?: string;
      startDate: string;
      frequencyType: "WEEKLY";
      weekDays: number[]; // 1~7
    }
  | {
      name: string;
      description?: string;
      startDate: string;
      frequencyType: "MONTHLY";
      monthDay: number; // 1~31
    };

// Tasks 목록 조회
export async function getTasks(
  groupId: number,
  taskListId: number,
  date?: string,
): Promise<TaskServer[]> {
  const url = new URL(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks`,
  );
  if (date) url.searchParams.append("date", date);

  return await fetchClient<TaskServer[]>(url.toString(), { method: "GET" });
}

// Task 단일 조회
export async function getTask(
  groupId: number,
  taskListId: number,
  taskId: number,
): Promise<TaskServer> {
  return await fetchClient<TaskServer>(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
    { method: "GET" },
  );
}

// 할 일 생성
export async function createTask(
  groupId: number,
  taskListId: number,
  body: CreateTaskParams,
): Promise<void> {
  await fetchClient<void>(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
}

// 할 일 수정
export async function updateTask(
  groupId: number,
  taskListId: number,
  taskId: number,
  body: { done?: boolean; name?: string; description?: string },
): Promise<TaskServer> {
  return await fetchClient(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
}

// react-query를 활용한 Task 수정 훅
export function useUpdateTask(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskListId,
      taskId,
      ...body
    }: {
      taskListId: number;
      taskId: number;
      done?: boolean;
      name?: string;
      description?: string;
    }) => updateTask(groupId, taskListId, taskId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

// 할 일 삭제
export async function deleteTask(
  groupId: number,
  taskListId: number,
  taskId: number,
): Promise<void> {
  await fetchClient<void>(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
    { method: "DELETE" },
  );
}

// 반복 할 일 전체 삭제
export async function deleteRecurring(
  groupId: number,
  recurringId: number,
): Promise<void> {
  await fetchClient<void>(
    `${BASE_URL}/groups/${groupId}/recurrings/${recurringId}`,
    { method: "DELETE" },
  );
}
