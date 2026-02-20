import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useSignUp, SignUpRequest } from "@/api/auth";
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";
import { useToastStore } from "@/stores/useToastStore";

export default function SignupPage() {
  const navigate = useNavigate();
  const { mutate: signUp, isPending } = useSignUp();
  const toast = useToastStore();

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<SignUpRequest>({
    mode: "onChange",
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const passwordValue = useWatch({ control, name: "password" });

  const onSubmit = (data: SignUpRequest) => {
    signUp(data, {
      onSuccess: () => {
        toast.show("회원가입이 완료되었습니다! 로그인해주세요.");
        navigate("/login");
      },
      onError: (error: Error) => toast.show(error.message),
    });
  };

  return (
    <div className="bg-background-secondary flex min-h-screen w-full items-center justify-center p-6">
      <div className="bg-background-primary w-full max-w-[343px] rounded-2xl p-6 pt-[57px] shadow-md md:max-w-[460px]">
        <h1 className="text-color-primary mb-8 text-center text-xl font-bold">
          회원가입
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative mb-[36px]">
            <Controller
              name="nickname"
              control={control}
              rules={{
                required: "이름을 입력해주세요.",
                minLength: { value: 2, message: "2자 이상 입력해주세요." },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="이름"
                  placeholder="이름을 입력하세요"
                />
              )}
            />
            {errors.nickname && (
              <p className="text-status-danger absolute mt-[8px] text-xs">
                {errors.nickname.message}
              </p>
            )}
          </div>
          <div className="relative mb-[36px]">
            <Controller
              name="email"
              control={control}
              rules={{
                required: "이메일을 입력해주세요.",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "이메일 형식이 아닙니다.",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="이메일"
                  type="email"
                  placeholder="email@example.com"
                />
              )}
            />
            {errors.email && (
              <p className="text-status-danger absolute mt-[8px] text-xs">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="relative mb-[36px]">
            <Controller
              name="password"
              control={control}
              rules={{
                required: "비밀번호를 입력해주세요.",
                pattern: {
                  value:
                    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: "영문, 숫자, 특수문자 포함 8자 이상",
                },
              }}
              render={({ field: { onChange, ...field } }) => (
                <Input
                  {...field}
                  label="비밀번호"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  onChange={(e) => {
                    onChange(e);
                    trigger("passwordConfirmation");
                  }}
                />
              )}
            />
            {errors.password && (
              <p className="text-status-danger absolute mt-[8px] text-xs">
                {errors.password.message}
              </p>
            )}
          </div>
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
            type="submit"
            size="authWide"
            disabled={isPending || !isValid}
            className="mt-4 w-full"
          >
            {isPending ? "가입 중..." : "가입하기"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-color-secondary">이미 계정이 있으신가요? </span>
          <Link to="/login" className="text-brand-primary font-bold underline">
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
}
