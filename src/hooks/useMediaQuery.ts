import { useState, useEffect } from "react";

/**
 * 화면 너비를 기준으로 "모바일 레이아웃 여부"를 판단하는 훅이다.
 *
 * 지정한 브레이크포인트보다 현재 viewport 너비가 작으면 `true`를 반환한다.
 * (기기 종류, UA, 터치 여부는 고려하지 않는다)
 *
 * @param breakpoint - 기준 브레이크포인트 키
 * @default "md"
 *
 * @returns 모바일 레이아웃 여부
 *
 * @example
 * ```ts
 * const isMobile = useIsMobile();        // md(768px) 기준
 * const isTablet = useIsMobile("lg");   // lg(1024px) 기준
 * ```
 */
const BREAKPOINTS = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type BreakpointKey = keyof typeof BREAKPOINTS;

export const useIsMobile = (breakpoint: BreakpointKey = "md") => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const check = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS[breakpoint]);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
};
