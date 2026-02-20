import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchClient } from "@/lib/fetchClient";
import { BASE_URL } from "@/api/config";
import { useToastStore } from "@/stores/useToastStore";
import { getGroups } from "@/api/user";
import { useAuthStore } from "@/stores/useAuthStore";

interface KakaoLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    nickname: string;
    image: string;
    teamId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function KakaoRedirectPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToastStore();
  const { login } = useAuthStore();
  const code = searchParams.get("code");

  const hasCalledAPI = useRef(false);

  useEffect(() => {
    if (!code || hasCalledAPI.current) return;

    const loginWithKakao = async () => {
      hasCalledAPI.current = true;

      try {
        const currentRedirectUri =
          window.location.origin + window.location.pathname;

        const response = await fetchClient<KakaoLoginResponse>(
          `${BASE_URL}/auth/signIn/KAKAO`,
          {
            method: "POST",
            body: JSON.stringify({
              state: "random_state",
              redirectUri: currentRedirectUri,
              token: code,
            }),
          },
        );
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        login();
        toast.show(
          `안녕하세요, ${response.user.nickname}님! 로그인이 완료되었습니다.`,
        );
        try {
          const groups = await getGroups();
          if (groups && groups.length > 0) {
            navigate(`/team/${groups[0].id}`);
          } else {
            navigate("/team");
          }
        } catch (groupError) {
          console.error("팀 목록 호출 실패:", groupError);
          navigate("/team");
        }
      } catch (error) {
        console.error("카카오 로그인 실패 상세:", error);

        if (error instanceof Error) {
          toast.show(`로그인 실패: ${error.message}`);
        } else {
          toast.show("알 수 없는 이유로 로그인에 실패했습니다.");
        }

        navigate("/login");
      }
    };

    loginWithKakao();
  }, [code, navigate, toast, login]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-bold">카카오 인증 처리 중...</p>
        <p className="text-color-secondary text-sm">잠시만 기다려 주세요.</p>
      </div>
    </div>
  );
}
