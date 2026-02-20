import { useMemo } from "react";
import { useGroup } from "@/api/group";
import { useCompletedTasks } from "@/api/user";

// description에서 taskListId 추출하는 유틸 함수
function parseTaskListId(description: string): number | null {
  try {
    const parsed = JSON.parse(description);
    if (parsed.taskListId != null) return Number(parsed.taskListId);
  } catch {
    // JSON 아닌 경우 정규식으로 추출
  }

  // taskListId: 5310 또는 "taskListId": 5310 패턴 매칭
  const match = description.match(/taskListId["\s]*:\s*(\d+)/);
  return match ? Number(match[1]) : null;
}

interface Params {
  groupId: number;
  selectedDate: Date;
  selectedTaskListId: number | null;
  isDayFilter: boolean;
}

export function useMyHistoryData({
  groupId,
  selectedDate,
  selectedTaskListId,
  isDayFilter,
}: Params) {
  const { data: group } = useGroup(groupId);
  const { data: completedTasks } = useCompletedTasks();

  // taskListId → taskListName 매핑
  const taskListMap = useMemo(() => {
    const map = new Map<number, string>();
    group.taskLists.forEach((taskList) => map.set(taskList.id, taskList.name));
    return map;
  }, [group.taskLists]);

  // 완료된 task에 taskListName 붙이기
  const doneTasks = useMemo(() => {
    return completedTasks.tasksDone.map((task) => {
      const taskListId = parseTaskListId(task.description);
      const UNKNOWN = "알 수 없는 목록";
      const taskListName =
        taskListId !== null
          ? (taskListMap.get(taskListId) ?? UNKNOWN)
          : UNKNOWN;
      return { ...task, taskListId, taskListName };
    });
  }, [completedTasks, taskListMap]);

  // 선택한 월 + 날짜 + 목록 기준 필터링
  const filteredTasks = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    return doneTasks
      .filter((task) => {
        const doneDate = new Date(task.doneAt);
        const matchMonth =
          doneDate.getFullYear() === year && doneDate.getMonth() === month;
        if (!matchMonth) return false;
        if (isDayFilter) return doneDate.getDate() === selectedDate.getDate();
        return true;
      })
      .filter((task) => {
        if (selectedTaskListId === null) return true;
        return task.taskListId === selectedTaskListId;
      });
  }, [doneTasks, selectedDate, selectedTaskListId, isDayFilter]);

  // taskList별 완료 개수 (선택된 월 기준)
  const taskListCounts = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const counts = new Map<number, number>();

    for (const task of doneTasks) {
      if (task.taskListId === null) continue;
      const doneDate = new Date(task.doneAt);
      if (doneDate.getFullYear() === year && doneDate.getMonth() === month) {
        counts.set(task.taskListId, (counts.get(task.taskListId) ?? 0) + 1);
      }
    }

    return counts;
  }, [doneTasks, selectedDate]);

  // 완료 개수 1개 이상인 taskList만
  const activeTaskLists = group.taskLists.filter(
    (taskList) => (taskListCounts.get(taskList.id) ?? 0) > 0,
  );

  // 날짜별 → taskList별 2단계 그룹핑
  const processedData = useMemo(() => {
    const grouped: Record<string, Record<string, typeof filteredTasks>> = {};

    for (const task of filteredTasks) {
      const doneDate = new Date(task.doneAt);
      const dateKey = `${doneDate.getFullYear()}-${doneDate.getMonth() + 1}-${doneDate.getDate()}`;
      const listName = task.taskListName;

      if (grouped[dateKey] === undefined) grouped[dateKey] = {};
      if (grouped[dateKey][listName] === undefined)
        grouped[dateKey][listName] = [];

      grouped[dateKey][listName].push(task);
    }

    return grouped;
  }, [filteredTasks]);

  return { activeTaskLists, taskListCounts, processedData };
}
