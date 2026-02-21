import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/config";
import { fetchClient } from "@/lib/fetchClient";
import {
  createTask,
  deleteTask,
  updateTask,
  CreateTaskParams,
} from "@/api/task";
import { useToastStore } from "@/stores/useToastStore";

export function useTaskMutations(params: {
  selectedTeamId: number;
  currentListId: number | null;
  dateParam: string;
  onCloseCreateModal: () => void;
}) {
  const { selectedTeamId, currentListId, dateParam, onCloseCreateModal } =
    params;
  const queryClient = useQueryClient();
  const { show: showToast } = useToastStore();

  const invalidateListAndTasks = (listId?: number) => {
    const targetListId = listId ?? currentListId;
    if (targetListId) {
      queryClient.invalidateQueries({
        queryKey: ["tasks", targetListId, dateParam],
      });
    }
    queryClient.invalidateQueries({ queryKey: ["taskLists", selectedTeamId] });
  };

  const createTaskMutation = useMutation({
    mutationFn: (data: { taskListId: number; body: CreateTaskParams }) =>
      createTask(selectedTeamId, data.taskListId, data.body),
    onSuccess: (_, variables) => {
      invalidateListAndTasks(variables.taskListId);
      showToast("할 일이 추가되었습니다.");
      onCloseCreateModal();
    },
    onError: () => showToast("할 일 추가에 실패했습니다."),
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, doneAt }: { id: number; doneAt: string | null }) =>
      updateTask(selectedTeamId, currentListId!, id, { done: !doneAt }),
    onSuccess: () => invalidateListAndTasks(),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => deleteTask(selectedTeamId, currentListId!, id),
    onSuccess: () => {
      invalidateListAndTasks();
      showToast("할 일이 삭제되었습니다.");
    },
    onError: () => showToast("할 일 삭제에 실패했습니다."),
  });

  const deleteRecurringMutation = useMutation({
    mutationFn: async ({
      taskId,
      recurringId,
    }: {
      taskId: number;
      recurringId: number;
    }) => {
      if (!currentListId) throw new Error("currentListId is missing");
      await fetchClient<void>(
        `${BASE_URL}/groups/${selectedTeamId}/task-lists/${currentListId}/tasks/${taskId}/recurring/${recurringId}`,
        { method: "DELETE" },
      );
    },
    onSuccess: () => {
      invalidateListAndTasks();
      showToast("반복 할 일이 전체 삭제되었습니다.");
    },
    onError: () => showToast("반복 할 일 삭제에 실패했습니다."),
  });

  return {
    invalidateListAndTasks, // ✅ 상세페이지에서 호출 가능하게 내려줄 것
    createTaskMutation,
    toggleTaskMutation,
    deleteTaskMutation,
    deleteRecurringMutation,
  };
}
