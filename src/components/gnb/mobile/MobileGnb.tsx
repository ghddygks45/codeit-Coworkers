import { useState } from "react";
import MobileUserArea from "./MobileUserArea";
import MobileHeaderMenus from "./MobileHeaderMenus";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLocation } from "react-router-dom";

export default function MobileGnb() {
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
      <header className="border-border-primary relative w-full md:border-r md:border-solid">
        <MobileUserArea onMenuOpen={setIsMenuOpen} />
        <MobileHeaderMenus
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
      </header>
    </>
  );
}
