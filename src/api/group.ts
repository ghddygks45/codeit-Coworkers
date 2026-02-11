// ========================================
// Group API
// Swagger: group
// ========================================

import { GroupServer, GroupMemberServer } from "@/types/group";
import { BASE_URL } from "./config";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { fetchClient } from "@/lib/fetchClient";
import { TaskServer } from "@/types/task";

// 단일 그룹 조회
export async function getGroup(id: number): Promise<GroupServer> {
  return await fetchClient(`${BASE_URL}/groups/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// react-query를 활용한 단일 그룹 조회 훅
export function useGroup(id: number) {
  return useSuspenseQuery<GroupServer>({
    queryKey: ["group", id],
    queryFn: () => getGroup(id),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

// 멤버 단일 조회
export async function getMember(
  groupId: number,
  memberUserId: number,
): Promise<GroupMemberServer> {
  return await fetchClient(
    `${BASE_URL}/groups/${groupId}/member/${memberUserId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

// 멤버 삭제
export async function deleteMember(groupId: number, memberUserId: number) {
  return await fetchClient(
    `${BASE_URL}/groups/${groupId}/member/${memberUserId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

// 멤버 삭제 훅
export function useDeleteMember(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberUserId: number) => deleteMember(groupId, memberUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

// Tasks 목록 조회(그룹 전체 항목)
export async function getAllTasks(
  groupId: number,
  date?: string,
): Promise<TaskServer[]> {
  const url = new URL(`${BASE_URL}/groups/${groupId}/tasks`);
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

// react-query를 활용한 Tasks 목록 조회 훅(그룹 전체 항목)
export function useAllTasks(groupId: number, date?: string) {
  return useSuspenseQuery<TaskServer[]>({
    queryKey: ["allTasks", groupId, date],
    queryFn: () => getAllTasks(groupId, date),
    staleTime: 1000 * 60 * 5,
  });
}
