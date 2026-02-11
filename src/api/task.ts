// ========================================
// Task API
// Swagger: task
// ========================================

import { TaskServer } from "@/types/task";
import { BASE_URL } from "./config";
import { fetchClient } from "@/lib/fetchClient";

// Tasks 목록 조회
export async function getTasks(
  groupId: number,
  taskListId: number,
  date?: string,
): Promise<TaskServer[]> {
  const url = new URL(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks`,
  );
  if (date) {
    url.searchParams.append("date", date);
  }

  return await fetchClient(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Task 단일 조회
export async function getTask(
  groupId: number,
  taskListId: number,
  taskId: number,
): Promise<TaskServer> {
  return await fetchClient(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
