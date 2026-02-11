import { useDeleteTaskList } from "@/api/tasklist";
import Alert from "@/assets/alert.svg";
import { useToastStore } from "@/stores/useToastStore";
import { TaskListServer } from "@/types/taskList";

type ListDeleteModalProps = {
  onClose: () => void;
  selectedTaskList: TaskListServer | null;
  groupId: number;
};

export default function ListDeleteModal({
  onClose,
  selectedTaskList,
  groupId,
}: ListDeleteModalProps) {
  const { mutate: deleteList } = useDeleteTaskList(groupId);

  const { show: showToast } = useToastStore();

  const handleDelete = (taskListId: number) => {
    deleteList(taskListId);
    showToast("목록이 삭제되었습니다.");
  };

  if (!selectedTaskList) return null;

  return (
    <>
      <div className="p-5">
        <div className="mt-2 mb-5 flex w-full justify-center">
          <Alert />
        </div>
        <div className="mt-2 flex flex-col gap-2">
          <h2 className="text-lg-m text-color-primary">
            {selectedTaskList.name} 목록을 삭제하시겠어요?
          </h2>
        </div>
        <div className="mt-7 flex flex-row justify-center gap-2">
          <button
            onClick={onClose}
            className="text-lg-b text-color-default h-[48px] w-[135px] rounded-[12px] border-[1px] border-solid border-[#cbd5e1] text-center"
          >
            닫기
          </button>
          <button
            type="submit"
            className="bg-status-danger text-lg-b text-color-inverse h-[48px] w-[135px] rounded-[12px] text-center"
            onClick={() => {
              handleDelete(selectedTaskList.id);
              onClose();
            }}
          >
            가차없이 삭제
          </button>
        </div>
      </div>
    </>
  );
}
