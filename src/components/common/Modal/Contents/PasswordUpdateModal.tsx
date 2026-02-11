type PasswordUpdateModalProps = {
  onClose: () => void;
};

export default function PasswordUpdateModal({
  onClose,
}: PasswordUpdateModalProps) {
  return (
    <div className="p-5">
      <div className="mt-2 flex flex-col">
        <h2 className="text-lg-m text-color-primary mb-5">비밀번호 변경하기</h2>
        <div className="mb-5 flex flex-col gap-2 text-left">
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            id="newPassword"
            type="text"
            className="placeholder-color-default h-[48px] w-[280px] rounded-[12px] border-[1px] border-solid border-[#e2e8f0] p-4"
            placeholder="새 비밀번호를 입력해주세요."
          />
        </div>
        <div className="flex flex-col gap-2 text-left">
          <label htmlFor="newPassword">새 비밀번호 확인</label>
          <input
            id="newPassword"
            type="text"
            className="placeholder-color-default mb-6 h-[48px] w-[280px] rounded-[12px] border-[1px] border-solid border-[#e2e8f0] p-4"
            placeholder="새 비밀번호를 다시 한 번 입력해주세요."
          />
        </div>
      </div>
      <div className="flex flex-row justify-center gap-2">
        <button
          onClick={onClose}
          className="border-brand-primary text-lg-b text-brand-primary h-[48px] w-[135px] rounded-[12px] border-[1px] border-solid text-center"
        >
          닫기
        </button>
        <button className="bg-brand-primary text-lg-b text-color-inverse h-[48px] w-[135px] rounded-[12px] text-center">
          변경하기
        </button>
      </div>
    </div>
  );
}
