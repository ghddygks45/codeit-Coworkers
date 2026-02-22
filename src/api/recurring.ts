// ========================================
// Recurring API
// Swagger: recurring
// ========================================

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { BASE_URL } from "./config";
import { fetchClient } from "@/lib/fetchClient";

export type UpdateRecurringParams = {
  name: string;
  description: string;
  startDate: string;
  frequencyType: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
  monthDay: number;
  weekDays: number[];
};

export async function updateRecurring(
  groupId: number,
  taskListId: number,
  recurringId: number,
  body: UpdateRecurringParams,
): Promise<void> {
  await fetchClient<void>(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/recurring/${recurringId}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
  );
}

export function useUpdateRecurring(groupId: number, taskListId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recurringId,
      body,
    }: {
      recurringId: number;
      body: UpdateRecurringParams;
    }) => updateRecurring(groupId, taskListId, recurringId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["taskLists", groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks", taskListId],
      });
      queryClient.invalidateQueries({
        queryKey: ["recurring", groupId, taskListId, variables.recurringId],
      });
    },
  });
}
