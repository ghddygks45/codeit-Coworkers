import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/api/config";
import { fetchClient, HttpError } from "@/lib/fetchClient";
import type { GroupDetailResponse, TaskListResponse } from "../types";

export function useTaskListsQuery(selectedTeamId: number) {
  return useQuery({
    queryKey: ["taskLists", selectedTeamId],
    queryFn: async () => {
      try {
        const data = await fetchClient<GroupDetailResponse>(
          `${BASE_URL}/groups/${selectedTeamId}`,
          { method: "GET" },
        );
        return data.taskLists ?? [];
      } catch (error: unknown) {
        if (error instanceof HttpError && error.status === 404) return [];
        throw error;
      }
    },
    enabled: !!selectedTeamId && !isNaN(selectedTeamId),
  }) as {
    data: TaskListResponse[] | undefined;
    isLoading: boolean;
  };
}
