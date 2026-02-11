import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import TokenRefreshModal from "@/pages/TokenRefreshModal";

export default function RootLayout() {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();

        const fiveMinutesInMs = 5 * 60 * 1000;
        const timeLeft = expirationTime - currentTime;

        if (timeLeft <= fiveMinutesInMs && timeLeft > 0) {
          setIsTokenModalOpen(true);
        }
      } catch (error) {
        console.error("토큰 확인 중 오류 발생:", error);
      }
    };

    const timer = setInterval(checkTokenExpiration, 60000);
    checkTokenExpiration();

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <TokenRefreshModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
      />
      <Outlet />
    </>
  );
}
