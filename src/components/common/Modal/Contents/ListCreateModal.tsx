import Close from "@/assets/close.svg";
import { useToastStore } from "@/stores/useToastStore";
import { useState } from "react";
import { useCreateTaskList } from "@/api/tasklist";
import { Button } from "../../Button/Button";


type ListCreateModalProps = {
  onClose: () => void;
  groupId: number;
};

export default function ListCreateModal({
  onClose,
  groupId,
}: ListCreateModalProps) {
  const [name, setName] = useState("");
  const { show: showToast } = useToastStore();
  const mutation = useCreateTaskList(groupId);

  const handleCreate = () => {
    if (!name.trim()) {
      showToast("목록 이름을 입력해주세요.");
      return;
    }
    mutation.mutate(name, {
      onSuccess: () => {
        showToast("목록이 생성되었습니다.");
        onClose();
      },
    });
  };

  return (
    <div>
      <div className="-mb-2 flex w-full justify-end pt-2">
        <Close onClick={onClose} className="cursor-pointer" />
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg-m text-color-primary">할 일 목록</h2>

          <input
            type="text"
            className="placeholder-color-default border-border-primary mb-6 h-12 w-full rounded-xl border border-solid p-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="목록 명을 입력해주세요."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
          />
        </div>

        <Button
          size="authWide"
          onClick={handleCreate}
          disabled={mutation.isPending}
          className="disabled:opacity-50"
        >
          {mutation.isPending ? "생성 중..." : "만들기"}
        </Button>
      </div>
    </div>
  );
}
