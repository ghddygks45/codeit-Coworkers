import { FallbackProps } from "react-error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { getErrorDataByCode } from "@/utils/errorCode";

export function DefaultErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const { reset } = useQueryErrorResetBoundary();
  const errorData = getErrorDataByCode(error);

  // 인증이 필요한 에러는 상위 GlobalBoundary로 전파
  if (errorData.requireLogin) {
    throw error;
  }

  const handleRetry = () => {
    reset(); // react-query 에러 상태 초기화
    resetErrorBoundary(); // ErrorBoundary 상태 초기화
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <p className="text-lg font-semibold text-red-500">{errorData.code}</p>
      <p className="text-center text-sm whitespace-pre-line text-gray-600">
        {errorData.message}
      </p>
      <button
        onClick={handleRetry}
        className="bg-brand-primary hover:bg-brand-primary/90 rounded-lg px-4 py-2 text-sm text-white transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}
