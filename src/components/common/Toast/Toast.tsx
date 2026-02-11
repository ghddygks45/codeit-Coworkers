import React, { useEffect, useState, useCallback } from "react";
import AlertIcon from "@/assets/alert-white.svg";

/**
 * Coworkers 프로젝트의 공통 알림(Toast) 컴포넌트입니다.
 * * @description
 * - 화면 하단에 고정되어 사용자에게 알림 또는 액션 버튼을 제공합니다.
 * - z-index를 99로 설정하여 다른 UI 요소보다 상단에 노출되도록 개선되었습니다.
 * - 버튼(action)은 선택 사항이며, 없을 경우 일반 안내형 토스트로 동작합니다.
 * * @param {Object} props
 * @param {string} props.message - 토스트에 표시될 메시지
 * @param {string} [props.actionLabel] - 버튼에 표시될 텍스트 (기본값: "확인")
 * @param {() => void} [props.onAction] - 버튼 클릭 시 실행될 핸들러 (없으면 버튼이 렌더링되지 않음)
 * @param {() => void} props.onClose - 토스트가 닫힐 때 실행되는 콜백
 * @param {number} [props.duration=5000] - 유지 시간 (ms)
 */
interface ToastProps {
  message: string;
  actionLabel?: string; // 버튼 텍스트를 유동적으로 변경
  onAction?: () => void; // 필수(onSave)에서 선택(onAction)으로 변경
  onClose: () => void;
  duration?: number;
}

const Toast = ({
  message,
  actionLabel = "확인",
  onAction,
  onClose,
  duration = 5000,
}: ToastProps) => {
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  return (
    <div
      className={`bg-brand-primary fixed bottom-8 left-1/2 z-1000 flex -translate-x-1/2 items-center justify-between shadow-lg transition-all duration-300 ease-in-out ${
        isExiting ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
      } w-[calc(100vw-32px)] max-w-217 rounded-2xl px-3 py-3 sm:w-full sm:px-6 sm:py-4`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <div className="hidden shrink-0 sm:block">
          <AlertIcon width="24" height="24" className="text-color-inverse" />
        </div>
        <span className="text-color-inverse sm:text-lg-sb overflow-hidden text-sm text-ellipsis whitespace-nowrap">
          {message}
        </span>
      </div>

      {onAction && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction();
          }}
          className="hover:bg-opacity-90 bg-background-inverse text-md-sb text-brand-primary ml-4 h-9 w-auto min-w-20 shrink-0 rounded-lg px-3 text-center transition-colors sm:h-10 sm:min-w-25 sm:px-4"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Toast;
