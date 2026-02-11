import { useRouteError, useNavigate } from "react-router-dom";
import { getErrorDataByCode } from "@/utils/errorCode";

// Router errorElement용
export function GlobalErrorFallback() {
  const error = useRouteError();
  const navigate = useNavigate();
  const errorData = getErrorDataByCode(error);

  const handleClick = () => {
    navigate(errorData.requireLogin ? "/login" : "/");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-status-danger text-2xl font-bold">
        {errorData.code}
      </h1>
      <p className="text-color-primary text-center whitespace-pre-line">
        {errorData.message}
      </p>
      <button
        onClick={handleClick}
        className="bg-brand-primary hover:bg-brand-primary/90 text-color-inverse rounded-lg px-4 py-2 transition-colors"
      >
        {errorData.requireLogin ? "로그인으로 이동" : "메인으로 이동"}
      </button>
    </div>
  );
}
