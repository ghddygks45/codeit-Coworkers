import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function useListPageParams() {
  const navigate = useNavigate();
  const { teamId, listId, taskId } = useParams<{
    teamId: string;
    listId: string;
    taskId?: string;
  }>();

  const selectedTeamId = useMemo(() => Number(teamId), [teamId]);
  const urlListId = useMemo(() => (listId ? Number(listId) : null), [listId]);

  const isOpen = Boolean(taskId);

  const closePanel = () => {
    if (!teamId || !listId) return;
    navigate(`/team/${teamId}/tasklists/${listId}`);
  };

  const goToList = (targetListId: number) => {
    if (!teamId) return;
    navigate(`/team/${teamId}/tasklists/${targetListId}`);
  };

  const goToTaskDetail = (currentListId: number, targetTaskId: number) => {
    if (!teamId) return;
    navigate(
      `/team/${teamId}/tasklists/${currentListId}/tasks/${targetTaskId}`,
    );
  };

  return {
    teamId,
    listId,
    taskId,
    selectedTeamId,
    urlListId,
    isOpen,
    closePanel,
    goToList,
    goToTaskDetail,
  };
}
