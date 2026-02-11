import Alert from "@/assets/alert.svg";

type DangerModalProps = {
  onClose: () => void;
};

export default function DangerModal({ onClose }: DangerModalProps) {
  return (
    <div className="p-5">
      <div className="mt-2 mb-5 flex w-full justify-center">
        <Alert />
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <h2 className="text-lg-m text-color-primary">
          팀 삭제를 진행하시겠어요?
        </h2>
        <p className="text-md-r text-color-primary mb-7">
          팀 삭제 버튼을 누르시면, 팀이 완전히 삭제되고
          <br /> 복구할 수 없으니 신중히 선택해주세요.
        </p>
      </div>
      <div className="flex flex-row justify-center gap-2">
        <button
          onClick={onClose}
          className="text-lg-b text-color-default h-[48px] w-[135px] rounded-[12px] border-[1px] border-solid border-[#cbd5e1] text-center"
        >
          닫기
        </button>
        <button className="bg-status-danger text-lg-b text-color-inverse h-[48px] w-[135px] rounded-[12px] text-center">
          팀 삭제
        </button>
      </div>
    </div>
  );
}
