import { useMutation, useQueryClient } from "@tanstack/react-query";
import Close from "@/assets/close.svg";
import { useToastStore } from "@/stores/useToastStore";
import { useState } from "react";
import { createTaskList } from "@/api/tasklist";

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
  const queryClient = useQueryClient();

  // useCreateTaskList 훅 대신 직접 mutation 정의
  const mutation = useMutation({
    mutationFn: (listName: string) => createTaskList(groupId, listName),
    // ListCreateModal 내 invalidateQueries 부분
    onSuccess: () => {
      showToast("목록이 생성되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["taskLists", Number(groupId)],
      });
      onClose();
    },
  });

  const handleCreate = () => {
    if (!name.trim()) {
      showToast("목록 이름을 입력해주세요.");
      return;
    }
    mutation.mutate(name);
  };

  return (
    <div className="bg-background-primary border-border-primary font-pretendard relative w-full rounded-3xl border p-6 shadow-xl md:w-[384px]">
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

        <button
          className="bg-brand-primary text-lg-b text-color-inverse h-12 w-full rounded-xl text-center disabled:opacity-50"
          onClick={handleCreate}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "생성 중..." : "만들기"}
        </button>
      </div>
    </div>
  );
}
