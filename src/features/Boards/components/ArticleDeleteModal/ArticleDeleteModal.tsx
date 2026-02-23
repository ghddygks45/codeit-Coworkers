import Modal from "@/components/common/Modal/Modal";
import AlertIcon from "@/assets/alert.svg";
import { Button } from "@/components/common/Button/Button";

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
          <Button variant="close" type="button" onClick={onClose}>
            닫기
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="disabled:opacity-50"
          >
            {isPending ? "삭제 중..." : "삭제하기"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
