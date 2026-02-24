"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";
import { resetPassword } from "@/api/user";
import { useToastStore } from "@/stores/useToastStore";

interface ResetPasswordFormData {
  password: string;
  passwordConfirmation: string;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToastStore();
  const token = searchParams.get("token");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordFormData>({
    mode: "onChange",
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const passwordValue = useWatch({
    control,
    name: "password",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.showError(
        "유효하지 않은 접근입니다. 메일의 링크를 다시 확인해주세요.",
      );
      return;
    }

    try {
      await resetPassword({
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
        token: token,
      });

      toast.show(
        "비밀번호가 성공적으로 변경되었습니다. 새로운 비밀번호로 로그인해주세요.",
      );
      navigate("/login");
    } catch (error) {
      let message = "비밀번호 재설정에 실패했습니다.";
      if (error instanceof Error) {
        message = error.message;
      }
      toast.showError(message);
    }
  };

  return (
    <div className="bg-background-secondary flex min-h-screen w-full items-center justify-center p-6">
      <div className="bg-background-primary w-full max-w-[343px] rounded-2xl p-8 shadow-md md:max-w-[460px]">
        <h1 className="text-color-primary mb-8 text-center text-2xl font-bold">
          새 비밀번호 설정
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 새 비밀번호 */}
          <div className="relative mb-[36px]">
            <Controller
              name="password"
              control={control}
              rules={{
                required: "새 비밀번호를 입력해주세요.",
                minLength: { value: 8, message: "8자 이상 입력해주세요." },
                pattern: {
                  value:
                    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: "영문, 숫자, 특수문자를 모두 포함해야 합니다.",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="새 비밀번호"
                  type="password"
                  placeholder="영문+숫자+특수문자 8자 이상"
                />
              )}
            />
            {errors.password && (
              <p className="text-status-danger absolute mt-[8px] text-xs">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="relative mb-[36px]">
            <Controller
              name="passwordConfirmation"
              control={control}
              rules={{
                required: "비밀번호 확인을 입력해주세요.",
                validate: (value) =>
                  value === passwordValue || "비밀번호가 일치하지 않습니다.",
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="비밀번호 확인"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                />
              )}
            />
            {errors.passwordConfirmation && (
              <p className="text-status-danger absolute mt-[8px] text-xs">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>

          <Button
            size="authWide"
            variant="default"
            disabled={isSubmitting || !isValid}
            className="mt-4 w-full"
          >
            {isSubmitting ? "변경 중..." : "비밀번호 변경하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
