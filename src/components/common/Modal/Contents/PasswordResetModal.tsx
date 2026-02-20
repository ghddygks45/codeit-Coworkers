type PasswordResetModalProps = {
  onClose: () => void;
};

export default function PasswordResetModal({
  onClose,
}: PasswordResetModalProps) {
  return (
    <div className="p-5">
      <div className="mt-2 mb-4 flex flex-col gap-2">
        <h2 className="text-lg-m text-color-primary">비밀번호 재설정</h2>
        <p className="text-md-m text-color-disabled">
          비밀번호 재설정 링크를 보내드립니다.
        </p>
      </div>
      <input
        type="text"
        className="placeholder-color-default border-border-primary mt-2 mb-6 h-[48px] w-full rounded-[12px] border-[1px] border-solid p-4"
        placeholder="이메일을 입력하세요."
      />
      <div className="flex flex-row justify-center gap-2">
        <button
          onClick={onClose}
          className="border-brand-primary text-lg-b text-brand-primary h-[48px] w-[135px] rounded-[12px] border-[1px] border-solid text-center"
        >
          닫기
        </button>
        <button className="bg-brand-primary text-lg-b text-color-inverse h-[48px] w-[135px] rounded-[12px] text-center">
          링크 보내기
        </button>
      </div>
    </div>
  );
}
