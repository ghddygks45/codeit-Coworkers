import { createPortal } from "react-dom";

interface SpinnerProps {
  message?: string;
}

export default function Spinner({ message }: SpinnerProps) {
  return createPortal(
    <div className="bg-background-secondary fixed inset-0 z-100 flex items-center justify-center">
      <div className="text-color-secondary flex flex-col items-center gap-3">
        <div className="border-brand-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
        {message && <span className="text-2lg-m mt-1">{message}</span>}
      </div>
    </div>,
    document.getElementById("modalRoot")!,
  );
}
