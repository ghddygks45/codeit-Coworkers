import { useToastStore } from "@/stores/useToastStore";
import Toast from "@/components/common/Toast/Toast";

export function ToastContainer() {
  const { isOpen, message, hide } = useToastStore();

  if (!isOpen) return null;

  return (
    <Toast
      message={message}
      onAction={hide} // 일단 닫기 버튼으로 사용
      onClose={hide}
    />
  );
}
