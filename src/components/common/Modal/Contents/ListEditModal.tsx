import { useUpdateTaskList } from "@/api/tasklist";
import Close from "@/assets/close.svg";
import { TaskListServer } from "@/types/taskList";
import { Input } from "@/components/common/Input/Input";
import { useState } from "react";
import { useToastStore } from "@/stores/useToastStore";

type ListEditModalProps = {
  onClose: () => void;
  selectedTaskList: TaskListServer | null;
  groupId: number;
};

export default function ListEditModal({
  onClose,
  selectedTaskList,
  groupId,
}: ListEditModalProps) {
  const { mutate: updateList } = useUpdateTaskList(groupId);
  const [name, setName] = useState(selectedTaskList?.name || "");

  const { show: showToast } = useToastStore();

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const isDoing = name.includes("{status:doing}");
    setName(isDoing ? `${e.target.value}{status:doing}` : e.target.value);
  };

  const handleEdit = (taskListId: number) => {
    updateList({ taskListId, newName: name });
    showToast("목록이 수정되었습니다.");
  };

  if (!selectedTaskList) return null;

  return (
    <>
      <div className="-mb-2 flex w-full justify-end pt-2">
        <Close onClick={onClose} className="cursor-pointer" />
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg-m text-color-primary">할 일 목록</h2>
          <div className="mb-6">
            <Input
              placeholder="목록 명을 입력해주세요."
              type="text"
              value={name.replace("{status:doing}", "").trim()}
              onChange={handleNameChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-brand-primary text-lg-b text-color-inverse h-[48px] w-[280px] rounded-[12px] text-center"
          onClick={() => {
            handleEdit(selectedTaskList.id);
            onClose();
          }}
        >
          수정하기
        </button>
      </div>
    </>
  );
}
