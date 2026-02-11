import { useIsMobile } from "@/hooks/useMediaQuery";

interface CarouselArrowsProps {
  /** 이전 버튼 클릭 핸들러 */
  onPrev: () => void;
  /** 다음 버튼 클릭 핸들러 */
  onNext: () => void;
  /** 이전 버튼 비활성화 여부 */
  disablePrev?: boolean;
  /** 다음 버튼 비활성화 여부 */
  disableNext?: boolean;
}

/**
 * 캐러셀 좌우 화살표 버튼 컴포넌트
 */
export default function CarouselArrows({
  onPrev,
  onNext,
  disablePrev = false,
  disableNext = false,
}: CarouselArrowsProps) {
  const isMobile = useIsMobile();
  const buttonSize = isMobile ? "w-6 h-6" : "w-8 h-8";
  const iconSize = isMobile ? 12 : 16;

  return (
    <div className="flex items-center gap-2">
      {/* 이전 버튼 */}
      <button
        type="button"
        onClick={onPrev}
        disabled={disablePrev}
        aria-label="이전"
        className={`${buttonSize} bg-background-primary flex items-center justify-center rounded-full border border-[#CBD5E1] transition-colors disabled:opacity-50`}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="#64748B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 다음 버튼 */}
      <button
        type="button"
        onClick={onNext}
        disabled={disableNext}
        aria-label="다음"
        className={`${buttonSize} bg-background-primary flex items-center justify-center rounded-full border border-[#CBD5E1] transition-colors disabled:opacity-50`}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="#64748B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
