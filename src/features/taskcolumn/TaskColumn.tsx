import { useGroup } from "@/api/group";
import TaskCard from "./components/TaskCard";
import TaskColumnModals from "./components/TaskColumnModals";
import { useTaskColumnModals } from "./components/useTaskColumnModals";
import { Button } from "@/components/common/Button/Button";
import PlusBlue from "@/assets/plus_blue.svg";
import FoldTrue from "@/assets/fold-true.svg";
import FoldFalse from "@/assets/fold-false.svg";

interface TaskColumnProps {
  groupId: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function TaskColumn({
  groupId,
  isCollapsed,
  onToggleCollapse,
}: TaskColumnProps) {
  const { data: groupData } = useGroup(groupId);

  // 서버에서 받은 할 일 목록
  const taskLists = groupData?.taskLists ?? [];

  // 할 일: 모든 task의 doneAt === null
  const todoLists = taskLists.filter((taskList) => {
    return taskList.tasks.every((task) => !task.doneAt);
  });

  // 진행중: doneAt !== null이 하나 이상 있고, 전부 완료는 아님
  const inProgressLists = taskLists.filter((taskList) => {
    const hasDoneTask = taskList.tasks.some((task) => task.doneAt);
    const allDone = taskList.tasks.every((task) => task.doneAt);
    return hasDoneTask && !allDone;
  });

  // 완료: 모든 task의 doneAt !== null
  const doneLists = taskLists.filter((taskList) => {
    return (
      taskList.tasks.length > 0 && taskList.tasks.every((task) => task.doneAt)
    );
  });

  // 접기/펼치기 상태에 따른 클래스
  const foldClass = isCollapsed
    ? { height: "md:h-[calc(100vh-152px)]", colWidth: "md:w-[330px]" }
    : { height: "md:h-[calc(100vh-546px)]", colWidth: "md:w-[270px]" };

  // 모달 관련 상태와 함수
  const { modalType, selectedTaskList, openModal, closeModal } =
    useTaskColumnModals();

  return (
    <div>
      {/* 목록 명 */}
      <div className="flex items-center justify-between">
        <p className="flex gap-1">
          <span className="text-lg-m text-color-primary">할 일 목록</span>
          <span className="text-lg-m text-color-default">
            ({taskLists.length}개)
          </span>
        </p>
        <div className="flex items-center gap-2">
          {onToggleCollapse && (
            <button
              type="button"
              className="hidden h-7 w-7 rotate-[-90deg] cursor-pointer transition-opacity hover:opacity-70 md:block"
              onClick={onToggleCollapse}
            >
              {isCollapsed ? (
                <FoldTrue className="h-full w-full" />
              ) : (
                <FoldFalse className="h-full w-full" />
              )}
            </button>
          )}
          <Button
            size="todoAdd"
            variant="default"
            icon={<PlusBlue className="h-4 w-4" />}
            onClick={() => openModal("ListCreate", null)}
          >
            목록 추가
          </Button>
        </div>
      </div>

      {/* 할 일 칼럼 */}
      <div
        className={`mt-[16px] justify-between md:mt-[30px] md:flex md:gap-[16px] md:overflow-visible md:overflow-y-auto ${foldClass.height}`}
      >
        {/* 할 일 */}
        <div className={foldClass.colWidth}>
          <div className="bg-background-tertiary flex items-center justify-between rounded-[12px] py-[10px] pr-[8px] pl-[20px]">
            <span className="text-color-primary text-md-m">할 일</span>
          </div>
          <div className="relative md:mt-[20px] md:h-[calc(100%-57px)] md:overflow-y-auto md:px-[5px] md:pb-[40px]">
            <div className="relative">
              {todoLists.length === 0 && (
                <p className="flex h-full items-center justify-center py-[20px] md:py-0">
                  할 일 목록이 없습니다.
                </p>
              )}

              {todoLists.map((taskList) => (
                <TaskCard
                  key={taskList.id}
                  taskList={taskList}
                  badgeState="start"
                  onEdit={() => openModal("ListEdit", taskList)}
                  onDelete={() => openModal("ListDelete", taskList)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 진행중 */}
        <div className={`mt-[16px] md:mt-0 ${foldClass.colWidth}`}>
          <div className="bg-background-tertiary flex items-center justify-between rounded-[12px] py-[10px] pr-[8px] pl-[20px]">
            <span className="text-color-primary text-md-m">진행중</span>
          </div>
          <div className="md:mt-[20px] md:h-[calc(100%-57px)] md:overflow-y-auto md:pb-[40px]">
            <div className="relative md:overflow-y-auto md:px-[5px] md:pb-[40px]">
              {inProgressLists.length === 0 && (
                <p className="flex h-full items-center justify-center py-[20px] md:py-0">
                  진행중인 목록이 없습니다.
                </p>
              )}
              {inProgressLists.map((taskList) => (
                <TaskCard
                  key={taskList.id}
                  taskList={taskList}
                  badgeState="ongoing"
                  onEdit={() => openModal("ListEdit", taskList)}
                  onDelete={() => openModal("ListDelete", taskList)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 완료 */}
        <div className={`mt-[16px] md:mt-0 ${foldClass.colWidth}`}>
          <div className="bg-background-tertiary flex items-center justify-between rounded-[12px] py-[10px] pr-[8px] pl-[20px]">
            <span className="text-color-primary text-md-m">완료</span>
          </div>
          <div className="md:mt-[20px] md:h-[calc(100%-57px)] md:overflow-y-auto md:pb-[40px]">
            <div className="relative md:overflow-y-auto md:px-[5px] md:pb-[40px]">
              {doneLists.length === 0 && (
                <p className="flex h-full items-center justify-center py-[20px] md:py-0">
                  완료된 목록이 없습니다.
                </p>
              )}

              {doneLists.map((taskList) => (
                <TaskCard
                  key={taskList.id}
                  taskList={taskList}
                  badgeState="done"
                  onEdit={() => openModal("ListEdit", taskList)}
                  onDelete={() => openModal("ListDelete", taskList)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <TaskColumnModals
        modalType={modalType}
        selectedTaskList={selectedTaskList}
        closeModal={closeModal}
      />
    </div>
  );
}
