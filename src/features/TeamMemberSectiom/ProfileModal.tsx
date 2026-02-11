import Close from "@/assets/close.svg";
import { useToastStore } from "@/stores/useToastStore";

type ProfileModalProps = {
  onClose: () => void;
  selectedMember: {
    userImage: string;
    userName: string;
    userEmail: string;
  } | null;
};

export default function ProfileModal({
  onClose,
  selectedMember,
}: ProfileModalProps) {
  const { show: showToast } = useToastStore();

  const emailCopyHandler = () => {
    if (selectedMember?.userEmail) {
      navigator.clipboard.writeText(selectedMember.userEmail);
      showToast("이메일이 복사되었습니다!");
    }
  };

  return (
    <>
      <div className="-mb-2 flex w-full justify-end pt-2">
        <Close onClick={onClose} className="cursor-pointer" />
      </div>
      <div className="p-5">
        <div className="flex flex-col gap-3">
          <div className="mb-6 flex flex-col items-center justify-center">
            <div className="h-[40px] w-[40px] overflow-hidden rounded-[12px]">
              <img
                className="h-full w-full object-cover"
                src={selectedMember?.userImage}
                alt={selectedMember?.userName + " 프로필 이미지"}
              />
            </div>
            <div className="mt-[16px]">
              <p className="text-md-sb text-color-primary">
                {selectedMember?.userName}
              </p>
              <p className="text-xs-r text-color-default mt-1">
                {selectedMember?.userEmail}
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="bg-brand-primary text-lg-b text-color-inverse h-[48px] w-[280px] rounded-[12px] text-center"
          onClick={() => {
            emailCopyHandler();
            onClose();
          }}
        >
          이메일 복사하기
        </button>
      </div>
    </>
  );
}
