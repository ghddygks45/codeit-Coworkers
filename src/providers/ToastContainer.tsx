import { useToastStore } from "@/stores/useToastStore";
import Toast from "@/components/common/Toast/Toast";

export function ToastContainer() {
  const { isOpen, message, type, hide } = useToastStore();

  if (!isOpen) return null;

  return <Toast message={message} type={type} onAction={hide} onClose={hide} />;
}
