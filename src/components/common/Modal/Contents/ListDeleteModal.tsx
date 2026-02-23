import { useDeleteTaskList } from "@/api/tasklist";
import Alert from "@/assets/alert.svg";
import { useToastStore } from "@/stores/useToastStore";
type TaskListClient = { id: number; name: string };
import { Button } from "../../Button/Button";

type ListDeleteModalProps = {
  onClose: () => void;
  selectedTaskList: TaskListClient | null;
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
            {selectedTaskList.name.replace("{status:doing}", "").trim()} 목록을
            삭제하시겠어요?
          </h2>
        </div>
        <div className="mt-7 flex flex-row justify-center gap-2">
          <Button onClick={onClose} variant="close">
            닫기
          </Button>
          <Button
            type="submit"
            variant="danger"
            onClick={() => {
              handleDelete(selectedTaskList.id);
              onClose();
            }}
          >
            삭제
          </Button>
        </div>
      </div>
    </>
  );
}
