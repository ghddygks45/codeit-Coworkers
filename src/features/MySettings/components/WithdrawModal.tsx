import Modal from "@/components/common/Modal/Modal";
import AlertIcon from "@/assets/alert.svg";
import { useDeleteUser } from "@/api/user";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 회원 탈퇴 확인 모달
 * - 모바일: 하단에서 표시(Modal 기본 동작)
 * - 탈퇴 성공 시 토큰 제거 후 로그인 페이지로 이동 (재가입·재로그인 가능하도록)
 */
export default function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const deleteUser = useDeleteUser();

  const handleWithdraw = () => {
    deleteUser.mutate(undefined, {
      onSuccess: () => {
        logout(); // 토큰 제거해서 재가입/재로그인 시 깨끗한 상태
        onClose();
        navigate("/login");
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-5 text-center md:px-8 md:py-6">
        <div className="mb-5 flex w-full justify-center">
          <AlertIcon />
        </div>
        <h2 className="text-xl-b text-color-primary mb-2">
          회원 탈퇴를 진행하시겠어요?
        </h2>
        <p className="text-color-secondary text-md-r mb-8">
          그룹장으로 있는 그룹은 자동으로 삭제되고, 모든 그룹에서 나가집니다.
        </p>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-color-default border-border-primary text-md-sb h-12 w-[135px] rounded-lg border bg-white text-center"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={deleteUser.isPending}
            className="bg-status-danger text-color-inverse text-md-sb h-12 w-[135px] rounded-lg text-center disabled:opacity-50"
          >
            {deleteUser.isPending ? "처리 중..." : "회원 탈퇴"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
