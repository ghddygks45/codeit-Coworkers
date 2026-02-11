import Close from "@/assets/close.svg";
import { useToastStore } from "@/stores/useToastStore";

type InviteModalProps = {
  onClose: () => void;
};

export default function InviteModal({ onClose }: InviteModalProps) {
  const { show: showToast } = useToastStore();

  const linkCopyHandler = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("링크가 복사되었습니다!");
  };

  return (
    <>
      <div className="-mb-2 flex w-full justify-end pt-2">
        <Close onClick={onClose} className="cursor-pointer" />
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg-m text-color-primary">멤버 초대</h2>
          <p className="text-md-m text-color-disabled md:text-color-primary mb-10">
            그룹에 참여할 수 있는 링크를 복사합니다.
          </p>
        </div>
        <button
          type="button"
          className="bg-brand-primary text-lg-b text-color-inverse h-[48px] w-[280px] rounded-[12px] text-center"
          onClick={() => {
            linkCopyHandler();
            onClose();
          }}
        >
          링크 복사하기
        </button>
      </div>
    </>
  );
}
