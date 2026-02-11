import { User } from "@/types/user";
import { GroupSummaryServer } from "@/types/group";
import { TaskDoneResponse, TaskDoneClientResponse } from "@/types/user";
import { BASE_URL } from "./config";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/fetchClient";

/** 현재 로그인한 사용자 조회 */
export async function getUser(): Promise<User> {
  return await fetchClient(`${BASE_URL}/user`, {
    method: "GET",
  });
}

/** 그룹 목록 조회 (사용자가 속한 그룹) */
export async function getGroups(): Promise<GroupSummaryServer[]> {
  return await fetchClient(`${BASE_URL}/user/groups`, {
    method: "GET",
  });
}

/** 비밀번호 재설정 이메일 전송 */
export async function sendResetPasswordEmail(data: {
  email: string;
  redirectUrl: string;
}): Promise<{ message: string }> {
  return await fetchClient(`${BASE_URL}/user/send-reset-password-email`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** 비밀번호 재설정 (패치) */
export async function resetPassword(data: {
  passwordConfirmation: string;
  password: string;
  token: string;
}): Promise<{ message: string }> {
  return await fetchClient(`${BASE_URL}/user/reset-password`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ========================================
// React Query Hooks
// ========================================

export function useUser() {
  return useSuspenseQuery<User>({
    queryKey: ["user"],
    queryFn: () => getUser(),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

export function useGroups() {
  return useSuspenseQuery<GroupSummaryServer[]>({
    queryKey: ["groups"],
    queryFn: getGroups,
    staleTime: 1000 * 10, // 10초
  });
}

// 로그인 한 유저의 완료된 태스크 목록 조회
export async function getCompletedTasks(): Promise<TaskDoneResponse> {
  return await fetchClient(`${BASE_URL}/user/history`, {
    method: "GET",
  });
}

// react-query를 활용한 완료된 태스크 목록 조회 훅
export function useCompletedTasks() {
  return useSuspenseQuery<TaskDoneResponse, Error, TaskDoneClientResponse>({
    queryKey: ["completedTasks"],
    queryFn: getCompletedTasks,
    staleTime: 1000 * 10,
    select: (data) => ({
      tasksDone: data.tasksDone.map((task) => ({
        ...task,
        title: task.name,
        isCompleted: Boolean(task.doneAt),
      })),
    }),
  });
}
