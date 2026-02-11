export interface ChipProps {
  /**
   * Chip 상태
   * - 'default': 기본 상태 (흰색 배경, 테두리)
   * - 'hover': 호버 상태 (흰색 배경, 테두리 없음)
   * - 'pressed': 선택/눌림 상태 (초록색 배경)
   */
  state: "default" | "hover" | "pressed";

  /**
   * Chip 크기
   * - 'small': 86x33, 13px 텍스트
   * - 'large': 109x43, 16px 텍스트
   */
  size: "small" | "large";

  /**
   * 표시할 숫자
   */
  count: number;

  /**
   * 라벨 텍스트 (예: "법인 등기")
   */
  children: React.ReactNode;
}

/**
 * Chip 컴포넌트
 *
 * @description
 * 카테고리나 상태를 표시하는 Chip 컴포넌트입니다.
 * 라벨과 숫자를 함께 표시하며, 클릭 가능한 인터랙션을 지원합니다.
 *
 * @example
 * ```tsx
 * <Chip state="default" size="large" count={3}>법인 등기</Chip>
 * <Chip state="pressed" size="small" count={5}>개인 등기</Chip>
 * ```
 */
export default function Chip({ state, size, count, children }: ChipProps) {
  // 크기별 스타일 (고정 크기)
  const sizeClass =
    size === "small"
      ? "w-[86px] min-w-[86px] max-w-[86px] h-[33px]"
      : "w-[109px] min-w-[109px] max-w-[109px] h-[43px]";

  const textSizeClass = size === "small" ? "text-sm-m" : "text-lg-m";
  const gapClass = size === "small" ? "gap-1" : "gap-1.5"; // gap-1 = 4px, gap-1.5 = 6px

  // state별 스타일 (명시적 인자 전달)
  const getStateStyles = (currentState: ChipProps["state"]) => {
    switch (currentState) {
      case "default":
        return {
          bg: "bg-background-inverse",
          border: "border border-border-primary",
          labelColor: "text-color-primary",
          countColor: "text-brand-primary",
        };
      case "hover":
        return {
          bg: "bg-background-secondary",
          border: "", // 테두리 없음
          labelColor: "text-color-primary",
          countColor: "text-brand-primary",
        };
      case "pressed":
        return {
          bg: "bg-brand-primary",
          border: "", // 테두리 없음
          labelColor: "text-color-inverse",
          countColor: "text-color-inverse",
        };
      default:
        return {
          bg: "bg-background-inverse",
          border: "border border-border-primary",
          labelColor: "text-color-primary",
          countColor: "text-brand-primary",
        };
    }
  };

  const { bg, border, labelColor, countColor } = getStateStyles(state); //명시적 인자 전달

  return (
    <button
      className={`inline-flex flex-shrink-0 items-center justify-center rounded-full ${sizeClass} ${gapClass} ${bg} ${border} transition-colors`}
      type="button"
    >
      {/* 라벨 */}
      <span className={`${textSizeClass} ${labelColor}`}>{children}</span>

      {/* 숫자 */}
      <span className={`${textSizeClass} ${countColor}`}>{count}</span>
    </button>
  );
}
