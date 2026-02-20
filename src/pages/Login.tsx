import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useSignIn, SignInRequest } from "@/api/auth";
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";
import Kakaoicon from "@/assets/kakao.svg";
import ForgotPasswordModal from "@/pages/ForgotPassword";
import { useToastStore } from "@/stores/useToastStore";
import { useAuthStore } from "@/stores/useAuthStore";
import Spinner from "@/components/common/Spinner/Spinner";
import { getGroup } from "@/api/group";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: signIn, isPending } = useSignIn();
  const toast = useToastStore();
  const { login } = useAuthStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const KAKAO_REST_API_KEY = "35804a1d124738c314f9abcb9b9181ea";
  const REDIRECT_URI = `${window.location.origin}/login/kakao`;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInRequest>({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: SignInRequest) => {
    setIsLoggingIn(true);
    signIn(data, {
      onSuccess: async (response) => {
        login();
        setIsLoggingIn(false);
        toast.show(
          `안녕하세요 ${response.user.nickname}님 오늘도 즐거운 일 시작해요!`,
        );
        const groups = await getGroup(response.user.id);
        if (groups && groups.id) {
          navigate(`/team/${groups.id}`);
        } else {
          navigate("/team");
        }
      },
      onError: (error: Error) => {
        setIsLoggingIn(false);
        toast.show(error.message);
      },
    });
  };

  if (isLoggingIn) {
    return <Spinner message="로그인 중..." />;
  }

  return (
    <div className="bg-background-secondary flex min-h-screen w-full items-center justify-center p-6">
      <div className="bg-background-primary w-full max-w-[343px] rounded-2xl p-6 pt-[57px] shadow-md md:max-w-[460px]">
        <h1 className="text-color-primary mb-8 text-center text-xl font-bold">
          로그인
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative mb-[36px]">
            <Controller
              name="email"
              control={control}
              rules={{ required: "이메일을 입력해주세요." }}
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
              rules={{ required: "비밀번호를 입력해주세요." }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="비밀번호"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                />
              )}
            />
            {errors.password && (
              <p className="text-status-danger absolute mt-[8px] text-xs">
                {errors.password.message}
              </p>
            )}
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-brand-primary text-sm underline"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            size="authWide"
            disabled={isPending || !isValid}
            className="w-full"
          >
            {isPending ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-color-secondary">계정이 없으신가요? </span>
          <Link to="/signup" className="text-brand-primary font-bold underline">
            가입하기
          </Link>
        </div>

        <div className="mt-10 mb-6 flex items-center gap-4">
          <div className="bg-border-primary h-[1px] flex-1"></div>
          <span className="text-color-secondary text-xs">OR</span>
          <div className="bg-border-primary h-[1px] flex-1"></div>
        </div>

        <div className="flex items-center justify-between gap-2 pb-6">
          <span className="text-color-default text-sm">간편 로그인하기</span>
          <a href={KAKAO_AUTH_URL}>
            <Kakaoicon />
          </a>
        </div>
      </div>
      <ForgotPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
