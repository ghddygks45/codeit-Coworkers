import { useEffect, useRef, useState } from "react";
import MobileUserArea from "./MobileUserArea";
import MobileHeaderMenus from "./MobileHeaderMenus";
import { useAuthStore } from "@/stores/useAuthStore";
import { FetchBoundary } from "@/providers/boundary";
import { useLocation } from "react-router-dom";

export default function MobileGnb() {
  const lastScrollY = useRef(0);
  const [isHeaderTrigger, setIsHeaderTrigger] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const headerHeight = document.querySelector("header")?.clientHeight || 0;

      if (currentScrollY > headerHeight) {
        setIsHeaderTrigger(true);
      } else {
        setIsHeaderTrigger(false);
      }

      // 아래 스크롤할 때
      if (currentScrollY > lastScrollY.current) {
        setIsHeaderHidden(true);
      }
      // 위로 스크롤할 때
      if (currentScrollY < lastScrollY.current) {
        setIsHeaderHidden(false);
      }

      // 스크롤 위치 저장
      // 스크롤이 멈췄을 때 마지막 위치를 저장하여 빠르게 스크롤할 때도 헤더가 정상적으로 동작하도록 함
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // useEffect를 사용하지 않은 이유
  // useEffect를 사용하면 렌더링 이후에 상태가 변경되어 잠시 메뉴가 열려있는 상태가 보일 수 있음.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
  }

  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return (
      <header className="border-border-primary relative w-full md:border-r md:border-solid">
        <MobileUserArea onMenuOpen={setIsMenuOpen} />
      </header>
    );
  }

  return (
    <>
      <header
        className={`border-border-primary bg-background-primary fixed z-50 w-full transition-transform duration-300 md:border-r md:border-solid ${isHeaderTrigger ? "shadow-[0_2px_8px_rgba(0,0,0,0.08)]" : ""} ${isHeaderHidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <MobileUserArea onMenuOpen={setIsMenuOpen} />
        <FetchBoundary loadingFallback={null}>
          <MobileHeaderMenus
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          />
        </FetchBoundary>
      </header>
    </>
  );
}
