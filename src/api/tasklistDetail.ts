import { BASE_URL } from "./config";
import { fetchClient } from "@/lib/fetchClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * 사용자 정보 타입
 */
type User = {
  id: number;
  nickname: string;
  image: string | null;
};

/**
 * Task 완료 처리한 사용자 정보 타입 (nullable)
 * - API 응답에서 `doneBy`가 없거나, 내부 `user`가 없을 수 있어 모두 nullable 처리
 */
type DoneBy = {
  user: User | null;
} | null;

/**
 * 반복(Recurring) 설정 정보 타입
 */
type Recurring = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  frequencyType: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
  groupId: number;
  monthDay: number | null;
  startDate: string;
  taskListId: number;
  weekDays: number[];
  writerId: number;
};

/**
 * Task(또는 TaskList 상세) 응답 타입
 *
 * @remarks
 * - 현재 API 사용처에 맞춰 Task 단건 조회/업데이트 응답으로도 재사용되고 있습니다.
 * - `doneAt`, `deletedAt` 등 일부 필드는 nullable 입니다.
 */
type TaskListDetailResponse = {
  id: number;
  name: string;
  description: string;
  date: string;
  frequency: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
  displayIndex: number;
  commentCount: number;
  doneAt: null;
  doneBy: DoneBy;
  deletedAt: string | null;
  recurringId: number;
  recurring: Recurring;
  updatedAt: string;
  writer: User;
  createdAt: string;
};

/**
 * Task 댓글 타입
 */
type TaskComment = {
  id: number;
  taskId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: User;
};

/**
 * Task 댓글 목록 응답 타입
 */
type TaskCommentsResponse = TaskComment[];

/**
 * 현재 로그인 사용자 정보를 조회합니다.
 *
 * @returns {Promise<User>} 사용자 정보
 *
 * @example
 * const user = await getUser();
 */
export async function getUser(): Promise<User> {
  const response = await fetchClient<User>(`${BASE_URL}/user`, {
    method: "GET",
  });
  return response;
}

/**
 * 현재 로그인 사용자 정보를 조회하는 React Query 훅입니다.
 *
 * @returns React Query의 query 객체 (data, isLoading, error 등)
 *
 * @example
 * const { data: user, isLoading } = useGetUser();
 */
export function useGetUser() {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });
}

/**
 * 특정 그룹의 특정 TaskList 상세 정보를 조회합니다.
 *
 * @param {number} groupId - 그룹 ID
 * @param {number} taskListId - TaskList ID
 * @returns {Promise<TaskListDetailResponse>} TaskList 상세 응답
 */
export async function getTaskList(groupId: number, taskListId: number) {
  const response = await fetchClient<TaskListDetailResponse>(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}`,
    {
      method: "GET",
    },
  );
  return response;
}

/**
 * 특정 Task의 done 상태를 변경합니다.
 *
 * @param {number} groupId - 그룹 ID
 * @param {number} taskListId - TaskList ID
 * @param {number} taskId - Task ID
 * @param {boolean} done - 완료 여부
 * @returns {Promise<TaskListDetailResponse>} 업데이트된 Task 응답
 *
 * @example
 * await updateTaskListDone(1, 10, 3, true);
 */
export async function updateTaskListDone(
  groupId: number,
  taskListId: number,
  taskId: number,
  done: boolean,
) {
  const response = await fetchClient<TaskListDetailResponse>(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ done }),
    },
  );
  return response;
}

/**
 * 특정 Task의 done 상태를 변경하는 React Query Mutation 훅입니다.
 *
 * ## 캐시 처리
 * - 성공 시 `["task", groupId, taskListId, taskId]` 쿼리를 invalidate 합니다.
 *
 * @param {number} groupId - 그룹 ID
 * @param {number} taskListId - TaskList ID
 * @param {number} taskId - Task ID
 * @returns React Query mutation 객체 (mutate, mutateAsync 등)
 *
 * @example
 * const { mutate } = useUpdateTaskListDone(groupId, taskListId, taskId);
 * mutate(true);
 */
export function useUpdateTaskListDone(
  groupId: number,
  taskListId: number,
  taskId: number,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (done: boolean) =>
      updateTaskListDone(groupId, taskListId, taskId, done),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", groupId, taskListId, taskId],
      });
    },
  });
}

/**
 * 특정 Task 단건 정보를 조회합니다.
 *
 * @param {number} groupId - 그룹 ID
 * @param {number} taskListId - TaskList ID
 * @param {number} taskId - Task ID
 * @returns {Promise<TaskListDetailResponse>} Task 단건 응답
 */
export async function getTask(
  groupId: number,
  taskListId: number,
  taskId: number,
) {
  const response = await fetchClient<TaskListDetailResponse>(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
    {
      method: "GET",
    },
  );
  return response;
}

/**
 * 특정 Task 단건 정보를 조회하는 React Query 훅입니다.
 *
 * @param {number} groupId - 그룹 ID
 * @param {number} taskListId - TaskList ID
 * @param {number} taskId - Task ID
 * @returns React Query의 query 객체 (data, isLoading, error 등)
 */
export function useGetTask(
  groupId: number,
  taskListId: number,
  taskId: number,
) {
  return useQuery<TaskListDetailResponse>({
    queryKey: ["task", groupId, taskListId, taskId],
    queryFn: () => getTask(groupId, taskListId, taskId),
  });
}

export async function deleteTask(
  groupId: number,
  taskListId: number,
  taskId: number,
): Promise<void> {
  const response = await fetchClient<void>(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
    {
      method: "DELETE",
    },
  );
  return response;
}

export function useDeleteTask(
  groupId: number,
  taskListId: number,
  taskId: number,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteTask(groupId, taskListId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", groupId, taskListId, taskId],
      });
    },
  });
}

/**
 * 특정 Task의 댓글 목록을 조회합니다.
 *
 * @param {number} taskId - Task ID
 * @returns {Promise<TaskCommentsResponse>} 댓글 목록
 */
export async function getTaskComments(
  taskId: number,
): Promise<TaskCommentsResponse> {
  const response = await fetchClient<TaskCommentsResponse>(
    `${BASE_URL}/tasks/${taskId}/comments`,
    {
      method: "GET",
    },
  );
  return response;
}

/**
 * 특정 Task의 댓글 목록을 조회하는 React Query 훅입니다.
 *
 * @param {number} taskId - Task ID
 * @returns React Query의 query 객체 (data, isLoading, error 등)
 *
 * @remarks
 * - `enabled: !!taskId`로 taskId가 truthy일 때만 실행됩니다.
 */
export function useGetTaskComment(taskId: number) {
  return useQuery({
    queryKey: ["taskComments", taskId],
    queryFn: () => getTaskComments(taskId),
    enabled: !!taskId,
  });
}

/**
 * 특정 Task에 댓글을 생성합니다.
 *
 * @param {number} taskId - Task ID
 * @param {string} content - 댓글 내용
 * @returns {Promise<TaskCommentsResponse>} 생성 후 댓글 목록(서버 스펙에 따름)
 */
export async function createTaskComments(
  taskId: number,
  content: string,
): Promise<TaskCommentsResponse> {
  const response = await fetchClient<TaskCommentsResponse>(
    `${BASE_URL}/tasks/${taskId}/comments`,
    {
      method: "POST",
      // headers: authHeaders,
      body: JSON.stringify({ content }),
    },
  );
  return response;
}

/**
 * 특정 Task에 댓글을 생성하는 React Query Mutation 훅입니다.
 *
 * ## 캐시 처리
 * - 성공 시 `["taskComments", taskId]` 쿼리를 invalidate 합니다.
 *
 * @param {number} taskId - Task ID
 * @returns React Query mutation 객체 (mutate, mutateAsync 등)
 */
export function useCreateTaskComment(taskId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createTaskComments(taskId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taskComments", taskId],
      });
    },
  });
}

/**
 * 특정 Task의 특정 댓글을 수정합니다.
 *
 * @param {number} taskId - Task ID
 * @param {number} commentId - 댓글 ID
 * @param {string} content - 수정할 댓글 내용
 * @returns {Promise<TaskCommentsResponse>} 수정 후 댓글 목록(서버 스펙에 따름)
 */
export async function updateTaskComments(
  taskId: number,
  commentId: number,
  content: string,
): Promise<TaskCommentsResponse> {
  const response = await fetchClient<TaskCommentsResponse>(
    `${BASE_URL}/tasks/${taskId}/comments/${commentId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ content }),
    },
  );
  return response;
}

/**
 * 특정 Task의 댓글을 수정하는 React Query Mutation 훅입니다.
 *
 * ## 캐시 처리
 * - 성공 시 `["taskComments", taskId]` 쿼리를 invalidate 합니다.
 *
 * @param {number} taskId - Task ID
 * @returns React Query mutation 객체 (mutate, mutateAsync 등)
 *
 * @example
 * const { mutate } = useUpdateTaskComment(taskId);
 * mutate({ commentId: 123, content: "수정 내용" });
 */
export function useUpdateTaskComment(taskId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { commentId: number; content: string }) =>
      updateTaskComments(taskId, params.commentId, params.content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taskComments", taskId],
      });
    },
  });
}

/**
 * 특정 Task의 특정 댓글을 삭제합니다.
 *
 * @param {number} taskId - Task ID
 * @param {number} commentId - 댓글 ID
 * @returns {Promise<void>} 삭제 결과
 */
export async function deleteTaskComments(
  taskId: number,
  commentId: number,
): Promise<void> {
  const response = await fetchClient<void>(
    `${BASE_URL}/tasks/${taskId}/comments/${commentId}`,
    {
      method: "DELETE",
    },
  );
  return response;
}

/**
 * 특정 Task의 댓글을 삭제하는 React Query Mutation 훅입니다.
 *
 * ## 캐시 처리
 * - 성공 시 `["taskComments", taskId]` 쿼리를 invalidate 합니다.
 *
 * @param {number} taskId - Task ID
 * @returns React Query mutation 객체 (mutate, mutateAsync 등)
 *
 * @example
 * const { mutate } = useDeleteTaskComment(taskId);
 * mutate(commentId);
 */
export function useDeleteTaskComment(taskId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteTaskComments(taskId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taskComments", taskId],
      });
    },
  });
}
