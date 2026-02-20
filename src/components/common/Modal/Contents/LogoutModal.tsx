type LogoutModalProps = {
  onClose: () => void;
};

export default function LogoutModal({ onClose }: LogoutModalProps) {
  return (
    <div className="p-5">
      <div className="mt-4 flex flex-col">
        <h2 className="text-lg-m text-color-primary mb-6">
          로그아웃 하시겠어요?
        </h2>
      </div>
      <div className="flex flex-row justify-center gap-2">
        <button
          onClick={onClose}
          className="text-lg-b text-color-default border-border-secondary h-[48px] w-[135px] rounded-[12px] border-[1px] border-solid text-center"
        >
          닫기
        </button>
        <button className="bg-status-danger text-lg-b text-color-inverse h-[48px] w-[135px] rounded-[12px] text-center">
          로그아웃
        </button>
      </div>
    </div>
  );
}
