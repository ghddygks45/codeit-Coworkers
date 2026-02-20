import Alert from "@/assets/alert.svg";

type DangerModalProps = {
  onClose: () => void;
  onDelete: () => void;
};

export default function TaskDangerModal({
  onClose,
  onDelete,
}: DangerModalProps) {
  return (
    <div className="p-5">
      <div className="mt-2 mb-5 flex w-full justify-center">
        <Alert />
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <h2 className="text-lg-m text-color-primary">
          할 일 삭제를 진행하시겠어요?
        </h2>
        <p className="text-md-r text-color-primary mb-7">
          삭제 버튼을 누르시면, 할 일이 완전히 삭제되고
          <br /> 복구할 수 없으니 신중히 선택해주세요.
        </p>
      </div>
      <div className="flex flex-row justify-center gap-2">
        <button
          onClick={onClose}
          className="text-lg-b text-color-default border-border-secondary h-[48px] w-[135px] rounded-[12px] border-[1px] border-solid text-center"
        >
          닫기
        </button>
        <button
          onClick={onDelete}
          className="bg-status-danger text-lg-b text-color-inverse h-[48px] w-[135px] rounded-[12px] text-center"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
