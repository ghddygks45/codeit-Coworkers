import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@/assets/settings.svg";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import Modal from "@/components/common/Modal/Modal";
import TeamDeleteModal from "@/components/common/Modal/Contents/TeamDeleteModal";
import { useGroup } from "@/api/group";

interface Props {
  groupId: number;
}

export default function MyHistoryHeader({ groupId }: Props) {
  const { data: group } = useGroup(groupId);
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = () => navigate(`/team/${groupId}/edit`);
  const handleDelete = () => setIsDeleteModalOpen(true);

  return (
    <header className="text-color-primary text-lg-b lg:border-border-primary lg:bg-background-primary mb-[25px] lg:mb-[48px] lg:flex lg:w-full lg:max-w-[1120px] lg:items-center lg:rounded-[20px] lg:border lg:px-8 lg:py-5 lg:shadow-sm">
      <div className="flex w-full items-center gap-2 lg:justify-between">
        <h2 className="text-color-primary text-lg-b md:text-2xl-b">
          {group.name}
        </h2>
        <button type="button">
          <Dropdown
            optionsKey="edit"
            listAlign="center"
            trigger="set"
            icon={
              <SettingsIcon className="h-[16px] w-[16px] md:h-[24px] md:w-[24px]" />
            }
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
    </header>
  );
}
