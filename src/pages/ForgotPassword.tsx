import { useForm } from "react-hook-form";
import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { sendResetPasswordEmail } from "@/api/user";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>({
    mode: "onChange",
  });

  if (!isOpen) return null;

  const onSubmit = async (data: { email: string }) => {
    try {
      const REDIRECT_URL = window.location.origin;

      await sendResetPasswordEmail({
        email: data.email,
        redirectUrl: `${REDIRECT_URL}/reset-password`,
      });

      alert("비밀번호 재설정 이메일이 전송되었습니다. 메일함을 확인해주세요.");
      reset();
      onClose();
    } catch (error) {
      let message = "이메일 전송에 실패했습니다.";
      if (error instanceof Error) {
        message = error.message;
      }
      alert(message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 transition-all md:items-center"
      onClick={onClose}
    >
      <div
        className="bg-background-primary w-full max-w-full rounded-t-2xl px-4 py-8 shadow-xl md:max-w-[384px] md:rounded-2xl md:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-color-primary mb-2 text-center text-xl font-bold">
          비밀번호 재설정
        </h2>
        <p className="text-color-secondary mb-8 text-center text-sm">
          비밀번호 재설정 링크를 보내드립니다.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Input
              {...register("email", {
                required: "이메일을 입력해주세요.",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "이메일 형식에 맞지 않습니다.",
                },
              })}
              placeholder="이메일을 입력하세요"
              className={errors.email ? "border-status-danger" : ""}
            />
            <div className="h-4">
              {errors.email && (
                <p className="text-status-danger text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="close"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault();
                reset();
                onClose();
              }}
              disabled={isSubmitting}
            >
              닫기
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "전송 중..." : "링크 보내기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
