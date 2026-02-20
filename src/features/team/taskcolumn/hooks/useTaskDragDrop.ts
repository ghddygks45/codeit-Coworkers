import React, { useState, useEffect } from "react";
import { useUpdateTaskList, useOrderTaskList } from "@/api/tasklist";
import { useUpdateTask } from "@/api/task";
import { useToastStore } from "@/stores/useToastStore";
import { TaskListServer } from "@/types/taskList";
import { KanbanStatus, kanbanGroupStatus } from "../utils/kanbanStatus";

interface UseTaskDragDropParams {
  groupId: number;
  taskLists: TaskListServer[];
}

export function useTaskDragDrop({ groupId, taskLists }: UseTaskDragDropParams) {
  // 컬럼별 로컬 상태
  const [todoLists, setTodoLists] = useState<TaskListServer[]>([]);
  const [doingLists, setDoingLists] = useState<TaskListServer[]>([]);
  const [doneLists, setDoneLists] = useState<TaskListServer[]>([]);

  // 서버 데이터 변경 시 컬럼 상태 동기화
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const { todo, doing, done } = kanbanGroupStatus(taskLists);
    setTodoLists(todo);
    setDoingLists(doing);
    setDoneLists(done);
  }, [taskLists]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // 드래그 상태
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [draggingFrom, setDraggingFrom] = useState<KanbanStatus | null>(null);

  // 플레이스홀더 위치 상태
  const [dropTargetColumn, setDropTargetColumn] = useState<KanbanStatus | null>(
    null,
  );
  const [dropTargetIndex, setDropTargetIndex] = useState<number>(0);

  // API / 외부 액션
  const { mutate: updateTaskList } = useUpdateTaskList(groupId);
  const { mutate: updateTaskDone } = useUpdateTask(groupId);
  const { mutateAsync: orderTaskListAsync } = useOrderTaskList(groupId);
  const { show: showToast } = useToastStore();

  // [1] 드래그 시작 함수
  const handleDragStart = (id: number, from: KanbanStatus) => {
    setDraggingId(id);
    setDraggingFrom(from);
  };

  // [2] 드래그 중 - 플레이스홀더 위치 추적 함수들
  const handleDragEnterCard = (
    column: KanbanStatus,
    index: number,
    e: React.DragEvent,
  ) => {
    e.stopPropagation();
    setDropTargetColumn(column);
    setDropTargetIndex(index);
  };

  // 컬럼 빈 공간에 드래그할 때도 플레이스홀더가 나타나도록 하는 함수
  const handleDragEnterColumn = (column: KanbanStatus, listLength: number) => {
    setDropTargetColumn((prev) => {
      if (prev !== column) {
        setDropTargetIndex(listLength);
      }
      return column;
    });
  };

  // [3] 드롭
  const handleDrop = async (target: KanbanStatus) => {
    if (draggingId === null || draggingFrom === null) return;

    const columnListMap = {
      todo: todoLists,
      doing: doingLists,
      done: doneLists,
    };

    const columnSetterMap = {
      todo: setTodoLists,
      doing: setDoingLists,
      done: setDoneLists,
    };

    // 드래그 중인 아이템 찾기
    const item = columnListMap[draggingFrom].find(
      (tasklist) => tasklist.id === draggingId,
    );

    if (!item) return;

    if (target === "done" && item.tasks.length === 0) {
      showToast("완료할 할일이 없습니다.");
      return;
    }

    // API는 "최종 위치"로 이동하는 방식이라, 이동 방향에 따라 displayIndex 보정 필요
    // - 앞→뒤(forward): 사이 항목들이 당겨지므로 target.displayIndex - 1
    // - 뒤→앞(backward): 사이 항목들이 밀리므로 target.displayIndex 그대로
    const targetList = columnListMap[target];
    let targetDisplayIndex: number;

    if (targetList.length === 0) {
      targetDisplayIndex = 0;
    } else if (dropTargetIndex < targetList.length) {
      const targetItem = targetList[dropTargetIndex];
      const isForward = item.displayIndex < targetItem.displayIndex;
      targetDisplayIndex = isForward
        ? targetItem.displayIndex - 1
        : targetItem.displayIndex;
    } else {
      const lastItem = targetList[targetList.length - 1];
      const isForward = item.displayIndex < lastItem.displayIndex;
      targetDisplayIndex = isForward
        ? lastItem.displayIndex
        : lastItem.displayIndex + 1;
    }

    // 같은 컬럼 내 재정렬
    if (draggingFrom === target) {
      columnSetterMap[target]((prev) => {
        // 원래 위치 찾기
        const originalIndex = prev.findIndex(
          (tasklist) => tasklist.id === draggingId,
        );

        // 드래그 중인 아이템 제거
        const next = prev.filter((tasklist) => tasklist.id !== draggingId);

        // 새로운 위치에 아이템 삽입
        const insertAt =
          dropTargetIndex > originalIndex
            ? dropTargetIndex - 1
            : dropTargetIndex;

        next.splice(insertAt, 0, item);
        return next;
      });

      setDraggingId(null);
      setDraggingFrom(null);
      setDropTargetColumn(null);

      // 같은 컬럼 내 이동은 이름 변경이 없으므로 순서 API만 호출
      await orderTaskListAsync({
        taskListId: item.id,
        displayIndex: targetDisplayIndex,
      });
      return;
    }

    // 출발 컬럼에서 제거
    columnSetterMap[draggingFrom]((prev) =>
      prev.filter((tasklist) => tasklist.id !== draggingId),
    );

    // 도착 컬럼에 추가 (name 마커 처리)
    const cleanName = item.name.replace("{status:doing}", "").trim();
    const newName =
      target === "doing" ? `${cleanName}{status:doing}` : cleanName;

    // 로컬 상태 업데이트
    columnSetterMap[target]((prev) => {
      const next = [...prev];
      next.splice(dropTargetIndex, 0, { ...item, name: newName });
      return next;
    });

    setDraggingId(null);
    setDraggingFrom(null);
    setDropTargetColumn(null);

    // 순서 변경 API 완료 후에 status API 호출 (레이스 컨디션 방지)
    await orderTaskListAsync({
      taskListId: item.id,
      displayIndex: targetDisplayIndex,
    });

    // 완료 컬럼으로 이동할 때: 전부 done 처리
    if (target === "done") {
      item.tasks
        .filter((task) => !task.doneAt)
        .forEach((task) => {
          updateTaskDone({ taskListId: item.id, taskId: task.id, done: true });
        });
    } else if (draggingFrom === "done") {
      // 완료에서 나올 때: 전부 done 취소
      item.tasks.forEach((task) => {
        updateTaskDone({ taskListId: item.id, taskId: task.id, done: false });
      });
      updateTaskList({ taskListId: item.id, newName });
    } else {
      // todo <-> doing: name 마커만 변경
      updateTaskList({ taskListId: item.id, newName });
    }
  };

  // [4] 드래그 종료 (성공/ESC/바깥 릴리즈 모두)
  const handleDragEnd = () => {
    setDraggingId(null);
    setDraggingFrom(null);
    setDropTargetColumn(null);
  };

  return {
    todoLists,
    doingLists,
    doneLists,
    draggingId,
    dropTargetColumn,
    dropTargetIndex,
    handleDragStart,
    handleDrop,
    handleDragEnd,
    handleDragEnterCard,
    handleDragEnterColumn,
  };
}
