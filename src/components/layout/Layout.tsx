import { Outlet } from "react-router-dom";
import Gnb from "./Gnb/Gnb";
import { useGnbStore } from "./Gnb/useGnbStore";
import { useIsMobile } from "@/hooks/useMediaQuery";

export default function Layout() {
  const { isFolded } = useGnbStore();
  const isMobile = useIsMobile();

  // GNB 너비: 펼침 270px, 접힘 72px, 모바일은 고정 없음
  const gnbWidth = isFolded ? "72px" : "270px";

  return (
    <>
      {/* 데스크톱: GNB 고정, main은 GNB 너비만큼 왼쪽 여백 * 이게 없으면 boards 페이지에서 자유게시판 스크롤시 고정이 안됨됨*/}
      {/* 모바일: 기존 flex 레이아웃 유지 */}
      <div className="flex flex-col overflow-hidden md:flex-row">
        <div
          className={`${isMobile ? "" : "fixed top-0 left-0 z-10 h-screen"}`}
        >
          <Gnb />
        </div>
        <main
          className="bg-background-primary min-w-0 flex-1"
          style={!isMobile ? { marginLeft: gnbWidth } : undefined}
        >
          {/* 각 페이지 랜더링 */}
          <Outlet />
        </main>
      </div>
    </>
  );
}
