import { useDeleteMember } from "@/api/group";
import Alert from "@/assets/alert.svg";
import { useToastStore } from "@/stores/useToastStore";

type RemoveMemberModalProps = {
  onClose: () => void;
  selectedRemoveMember: {
    userId: number;
    userImage: string;
    userName: string;
    userEmail: string;
  } | null;
};

export default function RemoveMemberModal({
  onClose,
  selectedRemoveMember,
}: RemoveMemberModalProps) {
  const { mutate: removeMember } = useDeleteMember(3810);
  const { show: showToast } = useToastStore();

  return (
    <>
      <div className="p-5">
        <div className="mt-2 mb-5 flex w-full justify-center">
          <Alert />
        </div>
        <div className="mt-2 flex flex-col gap-2">
          <h2 className="text-lg-m text-color-primary">
            {selectedRemoveMember?.userName}님을 추방하시겠습니까?
          </h2>
        </div>
        <div className="mt-7 flex flex-row justify-center gap-2">
          <button
            onClick={onClose}
            className="text-lg-b text-color-default border-border-secondary h-[48px] w-[135px] rounded-[12px] border-[1px] border-solid text-center"
          >
            닫기
          </button>
          <button
            className="bg-status-danger text-lg-b text-color-inverse h-[48px] w-[135px] rounded-[12px] text-center"
            onClick={() => {
              if (selectedRemoveMember) {
                removeMember(selectedRemoveMember.userId);
                showToast(
                  `${selectedRemoveMember.userName}님이 추방되었습니다.`,
                );
                onClose();
              }
            }}
          >
            가차없이 추방
          </button>
        </div>
      </div>
    </>
  );
}
