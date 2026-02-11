import Modal from "@/components/common/Modal/Modal";
import AlertIcon from "@/assets/alert.svg";

interface ArticleDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

/**
 * 게시글 삭제 확인 모달
 */
export default function ArticleDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: ArticleDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-5">
        <div className="mt-2 mb-5 flex w-full justify-center">
          <AlertIcon />
        </div>
        <div className="mt-2 flex flex-col gap-2">
          <h2 className="text-lg-m text-color-primary">
            게시글을 삭제하시겠어요?
          </h2>
          <p className="text-md-r text-color-primary mb-7">
            삭제된 게시글은 복구할 수 없습니다.
          </p>
        </div>
        <div className="flex flex-row justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-lg-b text-color-default h-[48px] w-[135px] rounded-[12px] border-[1px] border-solid border-[#cbd5e1] text-center"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="bg-status-danger text-lg-b text-color-inverse h-[48px] w-[135px] rounded-[12px] text-center disabled:opacity-50"
          >
            {isPending ? "삭제 중..." : "삭제하기"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
