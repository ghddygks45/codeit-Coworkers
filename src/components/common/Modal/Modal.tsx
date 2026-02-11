import React, { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Modal 컴포넌트 Props
 *
 * @property {boolean} isOpen - 모달을 화면에 표시할지 여부
 * @property {() => void} onClose - 배경 클릭 시 호출되는 모달 닫기 콜백
 * @property {React.ReactNode} [children] - 모달 내부에 렌더링될 콘텐츠
 */
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

/**
 * 공통 Modal 컨테이너 컴포넌트 (Portal 기반)
 *
 * ## 역할
 * - 모달의 배경(overlay), 레이아웃, 열림/닫힘 규칙을 담당하는 공통 컨테이너
 * - 실제 모달 콘텐츠는 `children`으로 전달받아 렌더링합니다.
 *
 * ## 동작 방식
 * - `isOpen`이 `true`일 때만 렌더링됩니다.
 * - 배경(overlay)을 클릭하면 `onClose`가 호출됩니다.
 * - 모달 내부 클릭 시 이벤트 전파를 막아 닫힘을 방지합니다.
 * - 모달이 열리면 `document.body.style.overflow = "hidden"`으로
 *   페이지 스크롤을 잠급니다.
 * - 모달이 닫히거나 컴포넌트가 언마운트되면 스크롤 상태를 복원합니다.
 *
 * ## Portal 구조
 * - 이 컴포넌트는 `createPortal`을 사용하여 DOM 트리 외부에 렌더링됩니다.
 * - 아래와 같은 DOM 노드가 반드시 존재해야 합니다.
 *
 * @example
 * <!-- index.html -->
 * <div id="root"></div>
 * <div id="modalRoot"></div>
 *
 * ## 사용 예시
 * @example
 * import { useState } from "react";
 * import Modal from "@/components/common/Modal";
 *
 * function Example() {
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsOpen(true)}>모달 열기</button>
 *
 *       <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *         <h2>제목</h2>
 *         <p>모달 내용</p>
 *       </Modal>
 *     </>
 *   );
 * }
 *
 * ## 주의사항
 * - 이 컴포넌트는 `document`에 접근하므로 **브라우저 환경에서만 사용**해야 합니다.
 * - `modalRoot`가 존재하지 않으면 모달이 렌더링되지 않습니다.
 * - 키보드 접근성(ESC 닫기, focus trap)은 필요 시 별도 구현이 필요합니다.
 */
export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      // 모달 오픈 시 스크롤 방지
      document.body.style.overflow = "hidden";
    } else {
      // 모달 닫을 시 스크롤 복원
      document.body.style.overflow = "unset";
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  /** Portal이 마운트될 DOM 노드 */
  const modalRoot = document.getElementById("modalRoot");

  if (!modalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-background-primary flex w-full flex-col items-center rounded-t-[24px] md:w-[384px] md:items-center md:rounded-[24px]`}
      >
        <div className="flex w-full flex-col gap-2 text-center">
          <div className="px-5 py-3">{children}</div>
        </div>
      </div>
    </div>,
    modalRoot,
  );
}
