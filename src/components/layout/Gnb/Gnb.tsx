import { useIsMobile } from "@/hooks/useMediaQuery";
import MobileGnb from "./mobile/MobileGnb";
import DesktopGnb from "./desktop/DesktopGnb";

/**
 * 글로벌 네비게이션 바 컴포넌트
 *
 * 화면 크기에 따라 모바일 또는 데스크탑 GNB를 렌더링합니다.
 * - 모바일: MobileGnb 컴포넌트
 * - 데스크탑: DesktopGnb 컴포넌트
 *
 * @returns 현재 뷰포트에 맞는 GNB 컴포넌트
 *
 * @example
 * // 레이아웃에서 GNB 사용
 * import Gnb from "@/components/gnb/Gnb";
 *
 * function Layout({ children }) {
 *   return (
 *     <>
 *       <Gnb />
 *       <main>{children}</main>
 *     </>
 *   );
 * }
 */
export default function Gnb() {
  const isMobile = useIsMobile();

  if (isMobile) return <MobileGnb />;
  return <DesktopGnb />;
}
