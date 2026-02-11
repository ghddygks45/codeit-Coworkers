import { useCreateTaskList } from "@/api/tasklist";
import Close from "@/assets/close.svg";
import { useToastStore } from "@/stores/useToastStore";
import { useState } from "react";

type ListCreateModalProps = {
  onClose: () => void;
  groupId: number;
};

export default function ListCreateModal({
  onClose,
  groupId,
}: ListCreateModalProps) {
  const { mutate: createList } = useCreateTaskList(groupId);
  const [name, setName] = useState("");

  const { show: showToast } = useToastStore();

  const handleCreate = () => {
    createList(name);
    showToast("목록이 생성되었습니다.");
    onClose();
  };

  return (
    /* 기존 Fragment(<>) 대신 흰색 배경과 라운딩이 들어간 div로 감싸줍니다. 
      w-[320px] md:w-[384px] 정도로 너비를 잡아주면 원본과 비슷합니다.
    */
    <div className="bg-background-primary border-border-primary font-pretendard relative w-full rounded-3xl border p-6 shadow-xl md:w-[384px]">
      {/* 1. 상단 닫기 버튼 영역 */}
      <div className="flex w-full justify-end">
        <Close
          onClick={onClose}
          className="text-icon-primary hover:text-color-primary cursor-pointer transition-colors"
        />
      </div>

      {/* 2. 콘텐츠 영역 */}
      <div className="mt-2 flex flex-col gap-4">
        <h2 className="text-xl-b text-color-primary text-center">할 일 목록</h2>

        <input
          type="text"
          className="text-md-r placeholder:text-color-disabled border-border-primary bg-background-secondary focus:border-brand-primary h-12 w-full rounded-xl border p-4 transition-all outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="목록 명을 입력해주세요."
        />

        {/* 3. 버튼 영역 (w-full로 변경하여 박스 너비에 맞춤) */}
        <button
          className="bg-brand-primary text-lg-b text-color-inverse hover:bg-interaction-hover active:bg-interaction-pressed mt-2 h-12 w-full rounded-xl text-center transition-colors"
          onClick={() => {
            // 만들기 로직...
            handleCreate();
          }}
        >
          만들기
        </button>
      </div>
    </div>
  );
}
