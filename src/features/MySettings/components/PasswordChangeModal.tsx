import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { Input } from "@/components/common/Input/Input";
import { useChangePassword } from "@/api/user";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { Button } from "@/components/common/Button/Button";
import { useToastStore } from "@/stores/useToastStore";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * 비밀번호 변경 모달
 * - 데스크/타블렛: 인풋·버튼과 모달 가장자리 패딩 52px
 * - 모바일: 48px, 하단에서 표시(Modal 기본 동작)
 */
export default function PasswordChangeModal({
  isOpen,
  onClose,
  onSuccess,
}: PasswordChangeModalProps) {
  const isMobile = useIsMobile();
  const modalPadding = isMobile ? "p-[48px]" : "p-[52px]";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const changePassword = useChangePassword();
  const showToast = useToastStore((s) => s.show);

  const isValid =
    password.length > 0 &&
    passwordConfirmation.length > 0 &&
    password === passwordConfirmation &&
    !passwordError &&
    !confirmError;

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
  };

  const handlePasswordBlur = () => {
    if (password.trim().length === 0) {
      setPasswordError("비밀번호를 입력해주세요.");
    } else if (password.length < 8) {
      setPasswordError("비밀번호는 8자 이상이어야 합니다.");
    }
  };

  const handleConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPasswordConfirmation(e.target.value);
    if (confirmError) setConfirmError("");
  };

  const handleConfirmBlur = () => {
    if (passwordConfirmation.trim().length === 0) {
      setConfirmError("비밀번호 확인을 입력해주세요.");
    } else if (passwordConfirmation !== password) {
      setConfirmError("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleSubmit = () => {
    if (!isValid || changePassword.isPending) return;
    changePassword.mutate(
      { password, passwordConfirmation },
      {
        onSuccess: () => {
          setPassword("");
          setPasswordConfirmation("");
          showToast("비밀번호가 변경되었습니다.");
          onSuccess?.();
          onClose();
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={`-mx-5 -my-3 flex flex-col text-left ${modalPadding}`}>
        <h2 className="text-xl-b text-color-primary mb-6">비밀번호 변경하기</h2>

        <div className="flex flex-col gap-5">
          <div className="relative mb-4">
            <Input
              label="새 비밀번호"
              type="password"
              size="auth"
              variant="default"
              placeholder="새 비밀번호를 입력해주세요."
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              className={`!h-12 ${passwordError ? "border-status-danger" : ""}`}
            />
            {passwordError && (
              <p className="text-status-danger absolute mt-[8px] text-xs">
                {passwordError}
              </p>
            )}
          </div>
          <div className="relative mb-4">
            <Input
              label="새 비밀번호 확인"
              type="password"
              size="auth"
              variant="default"
              placeholder="새 비밀번호를 다시 한 번 입력해주세요."
              value={passwordConfirmation}
              onChange={handleConfirmChange}
              onBlur={handleConfirmBlur}
              className={`!h-12 ${confirmError ? "border-status-danger" : ""}`}
            />
            {confirmError && (
              <p className="text-status-danger absolute mt-[8px] text-xs">
                {confirmError}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button type="button" variant="close" onClick={onClose}>
            닫기
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || changePassword.isPending}
            className="transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {changePassword.isPending ? "변경 중..." : "변경하기"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
