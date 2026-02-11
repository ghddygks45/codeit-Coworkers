import { BASE_URL } from "./config";
import { useMutation } from "@tanstack/react-query";

// ========================================
// Types & Interfaces
// ========================================

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    nickname: string;
    updatedAt: string;
    createdAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface SignInRequest {
  email: string;
  password?: string; // 소셜 로그인의 경우 없을 수 있음
}

export interface SignUpRequest extends SignInRequest {
  nickname: string;
  passwordConfirmation: string;
}

// ========================================
// Auth API
// ========================================

/** 1. 회원가입 */
export async function signUp(data: SignUpRequest): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/signUp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "회원가입에 실패했습니다.");
  }
  return response.json();
}

/** 2. 로그인 */
export async function signIn(data: SignInRequest): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/signIn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "로그인에 실패했습니다.");
  }
  return response.json();
}

/** 3. 토큰 재발급 */
export async function refreshToken(
  token: string,
): Promise<{ accessToken: string }> {
  const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: token }),
  });

  if (!response.ok) throw new Error("토큰 갱신 실패");
  return response.json();
}

// ========================================
// React Query Hooks
// ========================================

export function useSignUp() {
  return useMutation<AuthResponse, Error, SignUpRequest>({
    mutationFn: (data) => signUp(data),
  });
}

export function useSignIn() {
  return useMutation<AuthResponse, Error, SignInRequest>({
    mutationFn: (data) => signIn(data),
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    },
  });
}
