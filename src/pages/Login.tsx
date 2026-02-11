"use client";

import { useState } from "react";
import Gnb from "@/components/gnb/Gnb";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useSignIn, useSignUp, SignInRequest, SignUpRequest } from "@/api/auth";
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";
import Kakaoicon from "@/assets/kakao.svg";
import ForgotPasswordModal from "@/pages/ForgotPassword";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: signIn, isPending: isSignInPending } = useSignIn();
  const { mutate: signUp, isPending: isSignUpPending } = useSignUp();

  const isPending = isSignInPending || isSignUpPending;

  const {
    control,
    handleSubmit,
    reset,
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
  const passwordConfirmValue = useWatch({
    control,
    name: "passwordConfirmation",
  });

  const onSubmit = (data: SignUpRequest) => {
    if (isSignup) {
      // 💡 Swagger 확인 결과 passwordConfirmation 필드도 함께 보내야 함
      signUp(data, {
        onSuccess: () => {
          alert("회원가입이 완료되었습니다! 로그인해주세요.");
          setIsSignup(false);
          reset();
        },
        onError: (error: Error) => {
          alert(error.message);
        },
      });
    } else {
      const signInData: SignInRequest = {
        email: data.email,
        password: data.password,
      };
      signIn(signInData, {
        onSuccess: () => {
          alert("로그인 성공!");
          navigate("/");
        },
        onError: (error: Error) => {
          alert(error.message);
        },
      });
    }
  };

  return (
    <div className="bg-background-secondary flex h-full w-full flex-col items-center sm:flex-row">
      <Gnb />
      <div className="flex w-full items-center justify-center">
        <div className="relative mt-15 mb-[90px] flex max-w-[343px] flex-1 items-center justify-center md:m-0 md:max-w-[460px] md:p-0">
          <div className="bg-background-primary h-full w-full rounded-2xl p-6 pt-[57px] shadow-md transition-all duration-300">
            <div className="w-full">
              <div className="mb-8 text-center">
                <h1 className="text-color-primary text-xl font-bold">
                  {isSignup ? "회원가입" : "로그인"}
                </h1>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-10 space-y-4">
                  {isSignup && (
                    <div className="space-y-1">
                      <Controller
                        name="nickname"
                        control={control}
                        rules={{
                          required: "이름을 입력해주세요.",
                          minLength: {
                            value: 2,
                            message: "이름은 최소 2자 이상이어야 합니다.",
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label="이름"
                            placeholder="이름을 입력하세요"
                            className={`focus:ring-2 focus:outline-none ${errors.nickname ? "border-status-danger" : ""}`}
                          />
                        )}
                      />
                      {errors.nickname && (
                        <p className="text-status-danger text-xs">
                          {errors.nickname.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: "이메일을 입력해주세요.",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "이메일 형식에 맞지 않습니다.",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="이메일"
                          type="email"
                          placeholder="email@example.com"
                          className={`focus:ring-2 focus:outline-none ${errors.email ? "border-status-danger" : ""}`}
                        />
                      )}
                    />
                    {errors.email && (
                      <p className="text-status-danger text-xs">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Controller
                      name="password"
                      control={control}
                      rules={{
                        required: "비밀번호를 입력해주세요.",
                        minLength: {
                          value: 8,
                          message: "비밀번호는 8자 이상이어야 합니다.",
                        },
                        // 💡 [수정] 서버 규격에 맞춘 영문/숫자/특수문자 정규식 추가
                        pattern: {
                          value:
                            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          message: "영문, 숫자, 특수문자를 포함해야 합니다.",
                        },
                      }}
                      render={({ field: { onChange, ...field } }) => (
                        <Input
                          {...field}
                          onChange={(e) => {
                            onChange(e);
                            if (passwordConfirmValue) {
                              trigger("passwordConfirmation");
                            }
                          }}
                          label="비밀번호"
                          type="password"
                          placeholder="영문+숫자+특수문자 8자 이상"
                          className={`focus:ring-2 focus:outline-none ${errors.password ? "border-status-danger" : ""}`}
                        />
                      )}
                    />
                    {errors.password && (
                      <p className="text-status-danger text-xs">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {isSignup && (
                    <div className="space-y-1">
                      <Controller
                        name="passwordConfirmation"
                        control={control}
                        rules={{
                          required: "비밀번호 확인을 입력해주세요.",
                          validate: (value) =>
                            value === passwordValue ||
                            "비밀번호가 일치하지 않습니다.",
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label="비밀번호 확인"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            className={`focus:ring-2 focus:outline-none ${errors.passwordConfirmation ? "border-status-danger" : ""}`}
                          />
                        )}
                      />
                      {errors.passwordConfirmation && (
                        <p className="text-status-danger text-xs">
                          {errors.passwordConfirmation.message}
                        </p>
                      )}
                    </div>
                  )}

                  {!isSignup && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="text-brand-primary cursor-pointer text-sm underline"
                      >
                        비밀번호를 잊으셨나요?
                      </button>
                    </div>
                  )}
                  <ForgotPasswordModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                  />
                </div>

                <div className="w-full">
                  <Button
                    type="submit"
                    size="authWide"
                    variant="default"
                    disabled={isPending || !isValid}
                    className={`w-full ${isPending || !isValid ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {isPending
                      ? "처리 중..."
                      : isSignup
                        ? "가입하기"
                        : "로그인"}
                  </Button>
                </div>
              </form>

              <div className="mt-6 flex items-center justify-center gap-3 text-sm">
                <span className="text-color-secondary">
                  {isSignup ? "이미 계정이 있으신가요?" : "계정이 없으신가요?"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    reset();
                  }}
                  className="text-md-m text-brand-primary font-bold underline"
                >
                  {isSignup ? "로그인하기" : "가입하기"}
                </button>
              </div>

              <div className="mt-12 mb-[16px] flex items-center justify-center gap-6">
                <div className="bg-border-primary h-[1px] w-full"></div>
                <span className="text-color-secondary">OR</span>
                <div className="bg-border-primary h-[1px] w-full"></div>
              </div>

              <div className="flex items-center justify-between gap-2 pb-6">
                <span className="text-color-default">간편 로그인하기</span>
                <Link to="/login/kakao">
                  <Kakaoicon />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
