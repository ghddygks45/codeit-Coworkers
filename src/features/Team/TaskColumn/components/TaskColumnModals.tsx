import Modal from "@/components/common/Modal/Modal";
import ListCreateModal from "@/components/common/Modal/Contents/ListCreateModal";
import ListEditModal from "@/components/common/Modal/Contents/ListEditModal";
import ListDeleteModal from "@/components/common/Modal/Contents/ListDeleteModal";
import { TaskListServer } from "@/types/taskList";
import { ModalType } from "../hooks/useTaskColumnModals";
import { useParams } from "react-router-dom";

interface TaskColumnModalsProps {
  modalType: ModalType;
  selectedTaskList: TaskListServer | null;
  closeModal: () => void;
}

export default function TaskColumnModals({
  modalType,
  selectedTaskList,
  closeModal,
}: TaskColumnModalsProps) {
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);

  if (!groupId) return;

  return (
    <>
      {/* 목록 추가 모달 */}
      <Modal isOpen={modalType === "ListCreate"} onClose={closeModal}>
        <ListCreateModal onClose={closeModal} groupId={groupId} />
      </Modal>
      {/* 목록 수정 모달 */}
      <Modal isOpen={modalType === "ListEdit"} onClose={closeModal}>
        <ListEditModal
          key={selectedTaskList?.id}
          selectedTaskList={selectedTaskList}
          onClose={closeModal}
          groupId={groupId}
        />
      </Modal>
      {/* 목록 삭제 모달 */}
      <Modal isOpen={modalType === "ListDelete"} onClose={closeModal}>
        <ListDeleteModal
          selectedTaskList={selectedTaskList}
          onClose={closeModal}
          groupId={groupId}
        />
      </Modal>
    </>
  );
}
