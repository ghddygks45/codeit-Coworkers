import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { refreshToken } from "@/api/auth";
import { Button } from "@/components/common/Button/Button";
import AlertIcon from "@/assets/alert.svg";

interface TokenRefreshModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TokenRefreshModal({
  isOpen,
  onClose,
}: TokenRefreshModalProps) {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (!storedRefreshToken) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      navigate("/Login");
      return;
    }

    try {
      setIsRefreshing(true);
      const { accessToken } = await refreshToken(storedRefreshToken);

      localStorage.setItem("accessToken", accessToken);
      alert("로그인이 연장되었습니다.");

      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      alert(errorMessage);
      localStorage.clear();
      navigate("/Login");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-background-secondary pointer-events-auto w-full max-w-[343px] rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="bg-brand-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <AlertIcon className="text-brand-primary h-6 w-6" />
          </div>

          <h2 className="text-color-primary mb-2 text-xl font-bold">
            로그인 연장
          </h2>
          <p className="text-color-secondary mb-8 text-sm">
            로그인 세션이 곧 만료됩니다.
            <br />
            로그인을 연장하시겠습니까?
          </p>

          <div className="flex w-full flex-col gap-3">
            <Button
              size="authWide"
              variant="default"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? "연장 중..." : "로그인 연장하기"}
            </Button>

            <Button
              size="authWide"
              variant="outline_blue"
              onClick={() => {
                localStorage.clear();
                navigate("/Login");
              }}
            >
              다시 로그인하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
