import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import Modal from "@/components/common/Modal/Modal";
import TeamDeleteModal from "@/components/common/Modal/Contents/TeamDeleteModal";
import MemberAvatars from "./MemberAvatars";

type Member = {
  userId: number;
  userImage: string;
  userName: string;
  role: string;
};

type GroupHeaderProps = {
  groupName: string;
  members: Member[];
  isAdmin?: boolean;
};

export default function GroupHeader({
  groupName,
  members,
  isAdmin = false,
}: GroupHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = () => {
    navigate(`${location.pathname}/edit`);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="flex w-full items-center justify-between px-[26px] pt-[20px] pb-[34px] md:pt-[30px] lg:pt-[32px] lg:pr-[84px] lg:pb-[37px]">
      <div className="flex items-center gap-2">
        <h2 className="text-xl-b md:text-2xl-b">{groupName}</h2>
        <MemberAvatars members={members} />
      </div>
      {isAdmin && (
        <div>
          <button
            type="button"
            className="right-[38px] bottom-[36px] z-1 lg:absolute"
          >
            <Dropdown
              optionsKey="edit"
              listAlign="center"
              trigger="set"
              options={[
                { label: "수정하기", value: "edit", action: handleEdit },
                { label: "삭제하기", value: "delete", action: handleDelete },
              ]}
            />
          </button>
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
          >
            <TeamDeleteModal onClose={() => setIsDeleteModalOpen(false)} />
          </Modal>
        </div>
      )}
    </div>
  );
}
