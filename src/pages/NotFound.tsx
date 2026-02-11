import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-status-danger text-6xl font-bold">404</h1>
      <p className="text-color-primary text-lg">페이지를 찾을 수 없습니다.</p>
      <button
        onClick={() => navigate("/")}
        className="bg-brand-primary hover:bg-brand-primary/90 text-color-inverse rounded-lg px-4 py-2 transition-colors"
      >
        메인으로 이동
      </button>
    </div>
  );
}
