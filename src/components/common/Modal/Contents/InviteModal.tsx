import { useInvitationLink } from "@/api/group";
import Close from "@/assets/close.svg";
import { useToastStore } from "@/stores/useToastStore";
import { useParams } from "react-router-dom";
import { useState } from "react";

type InviteModalProps = {
  onClose: () => void;
};

export default function InviteModal({ onClose }: InviteModalProps) {
  const { id: groupId } = useParams();
  const { data: invitationLinkData } = useInvitationLink(Number(groupId));
  const { show: showToast } = useToastStore();
  const [showLink, setShowLink] = useState(false);

  const linkCopyHandler = () => {
    navigator.clipboard.writeText(String(invitationLinkData));
    showToast("링크가 복사되었습니다!");
    setShowLink(true);
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
          }}
        >
          링크 복사하기
        </button>
        {showLink && (
          <div className="mt-6 flex flex-col">
            <div className="text-md-m text-color-disabled md:text-color-primary">
              아래 링크를 복사해 주세요.
            </div>
            <p className="md:text-color-primary text-color-disabled text-md-m mt-3 break-all">
              {String(invitationLinkData)}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
