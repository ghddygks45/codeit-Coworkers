// import InviteModal from "@/components/common/Modal/Contents/InviteModal";
// import ListCreateModal from "@/components/common/Modal/Contents/ListCreateModal";
// import DangerModal from "@/components/common/Modal/Contents/DangerModal";
// import PasswordResetModal from "@/components/common/Modal/Contents/PasswordResetModal";
// import PasswordUpdateModal from "@/components/common/Modal/Contents/PasswordUpdateModal";
// import LogoutModal from "@/components/common/Modal/Contents/LogoutModal";
import TaskCreateModal from "@/components/common/Modal/Contents/TaskCreateModal";
import Modal from "@/components/common/Modal/Modal";
import ModalButton from "@/components/common/Modal/ModalButton";
import { useState } from "react";

/**
 * 공통 Modal + 콘텐츠 모달 테스트 페이지
 *
 * ## 목적
 * - 공통 `Modal` 컨테이너에 다양한 **콘텐츠 전용 모달 컴포넌트**를
 *   children으로 주입해 동작과 UI를 검증하기 위한 테스트 페이지입니다.
 * - 각 콘텐츠 모달은 독립된 컴포넌트로 분리되어 있으며,
 *   이 페이지에서는 하나씩 교체하며 테스트합니다.
 *
 * ## 구조 설명
 * - `Modal`: 배경, 레이아웃, 닫기 규칙, Portal 처리 담당
 * - `InviteModal`, `ListCreateModal`, `DangerModal` 등:
 *   실제 모달 내부 콘텐츠 및 비즈니스 UI 담당
 *
 * ## 사용 방법
 * 1. 하단의 `<Modal>` 블록 중 **하나만 활성화**합니다.
 * 2. "모달 열기" 버튼을 클릭하여 해당 콘텐츠 모달을 확인합니다.
 * 3. 배경 클릭 또는 내부 닫기 버튼을 통해 정상적으로 닫히는지 확인합니다.
 *
 * @example
 * // 예: 비밀번호 재설정 모달 테스트
 * <Modal isOpen={isOpen} onClose={handleModalClose}>
 *   <PasswordResetModal onClose={handleModalClose} />
 * </Modal>
 */
export default function TestModal() {
  /** 현재 모달 열림 여부 */
  const [isOpen, setIsOpen] = useState(false);

  /** 모달 열기, 닫기 */
  const handleModalOpen = () => setIsOpen(true);
  const handleModalClose = () => setIsOpen(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4">Modal Test Page</h1>

      {/* 모달을 여는 테스트 버튼 */}
      <ModalButton buttonText="모달 열기" onClick={handleModalOpen} />

      {/* 초대 모달 테스트 */}
      {/* <Modal isOpen={isOpen} onClose={handleModalClose}>
        <InviteModal onClose={handleModalClose} />
      </Modal> */}

      {/* 리스트 생성 모달 테스트 */}
      {/* <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ListCreateModal onClose={handleModalClose} />
      </Modal> */}

      {/* 비밀번호 재설정 모달 테스트 */}
      {/* <Modal isOpen={isOpen} onClose={handleModalClose}>
        <PasswordResetModal onClose={handleModalClose} />
      </Modal> */}

      {/* 비밀번호 변경 모달 테스트 */}
      {/* <Modal isOpen={isOpen} onClose={handleModalClose}>
        <PasswordUpdateModal onClose={handleModalClose} />
      </Modal> */}

      {/* 회원 탈퇴(위험) 모달 테스트 */}
      {/* <Modal isOpen={isOpen} onClose={handleModalClose}>
        <DangerModal onClose={handleModalClose} />
      </Modal> */}

      {/* 로그아웃 모달 테스트 */}
      {/* <Modal isOpen={isOpen} onClose={handleModalClose}>
        <LogoutModal onClose={handleModalClose} />
      </Modal> */}

      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <TaskCreateModal />
      </Modal>
    </div>
  );
}
