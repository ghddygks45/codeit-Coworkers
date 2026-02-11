import React, { useState } from "react";
import Toast from "@/components/common/Toast/Toast";

const ToastTestPage = () => {
  // 토스트 종류 상태: none(없음), info(안내), save(저장)
  const [activeToast, setActiveToast] = useState<"none" | "info" | "save">(
    "none",
  );

  const handleClose = () => {
    setActiveToast("none");
  };

  const handleSaveAction = () => {
    alert("변경사항이 성공적으로 저장되었습니다!");
    handleClose();
  };

  return (
    <div className="font-pretendard flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-md">
        <h1 className="text-2xl-b text-color-primary mb-4">
          Toast Component Test
        </h1>
        <p className="text-md-r text-color-tertiary mb-8">
          수정된 유동적인 토스트 옵션을 테스트해보세요.
        </p>

        <div className="flex flex-col gap-3">
          {/* 1. 일반 안내형 (버튼 없이 메시지만 노출) */}
          <button
            onClick={() => setActiveToast("info")}
            className="bg-color-tertiary text-md-sb w-full rounded-lg px-6 py-3 text-white shadow-md transition-all hover:opacity-90 active:scale-95"
          >
            일반 안내형 토스트
          </button>

          {/* 2. 저장 액션형 (기존 요구사항 반영) */}
          <button
            onClick={() => setActiveToast("save")}
            className="bg-brand-primary text-md-sb hover:bg-interaction-hover w-full rounded-lg px-6 py-3 text-white shadow-md transition-all active:scale-95"
          >
            저장 액션 토스트
          </button>
        </div>
      </div>

      <div className="text-sm-r text-color-disabled mt-10 text-center">
        <p>💡 버튼(onAction) 유무에 따라 토스트 UI가 유동적으로 변합니다.</p>
        <p>현재 z-index는 [99]로 설정되어 있습니다.</p>
      </div>

      {/* --- 토스트 렌더링 영역 --- */}

      {/* 안내형: onAction을 넘기지 않아 버튼이 렌더링되지 않음 */}
      {activeToast === "info" && (
        <Toast
          message="알림 메시지가 도착했습니다."
          onClose={handleClose}
          duration={3000}
        />
      )}

      {/* 저장형: actionLabel과 onAction을 넘겨 버튼 활성화 */}
      {activeToast === "save" && (
        <Toast
          message="저장하지 않은 변경사항이 있어요!"
          actionLabel="변경사항 저장하기"
          onAction={handleSaveAction}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default ToastTestPage;
