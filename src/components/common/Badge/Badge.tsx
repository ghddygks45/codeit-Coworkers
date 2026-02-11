// SVG 아이콘 컴포넌트 import
import ProgressDone from "@/assets/progress-done.svg";
import ProgressDoneSmall from "@/assets/progress-done-small.svg";
import ProgressOngoing from "@/assets/progress-ongoing.svg";
import ProgressOngoingSmall from "@/assets/progress-ongoing-small.svg";
import ProgressStart from "@/assets/progress-start.svg";
import ProgressStartSmall from "@/assets/progress-start-small.svg";

export interface BadgeProps {
  /**
   * Badge 상태
   * - 'done': 완료 (체크 아이콘)
   * - 'ongoing': 진행 중 (로딩 아이콘)
   * - 'start': 시작 전 (빈 원)
   */
  state: "done" | "ongoing" | "start";

  /**
   * Badge 크기
   * - 'small': 58x25, 14px 텍스트
   * - 'large': 66x28, 16px 텍스트
   */
  size: "small" | "large";

  /**
   * 현재 달성한 개수
   */
  current: number;

  /**
   * 총 개수
   */
  total: number;
}

// 아이콘 컴포넌트 맵핑
const ICON_MAP = {
  done: { small: ProgressDoneSmall, large: ProgressDone },
  ongoing: { small: ProgressOngoingSmall, large: ProgressOngoing },
  start: { small: ProgressStartSmall, large: ProgressStart },
} as const;

/**
 * Badge 컴포넌트
 *
 * @description
 * 진행 상태를 표시하는 Badge 컴포넌트입니다.
 * 아이콘과 숫자(current/total)를 함께 표시합니다.
 *
 * @example
 * ```tsx
 * <Badge state="ongoing" size="small" current={3} total={5} />
 * <Badge state="done" size="large" current={5} total={5} />
 * <Badge state="start" size="small" current={0} total={0} />
 * ```
 */
export default function Badge({ state, size, current, total }: BadgeProps) {
  // 아이콘 컴포넌트 결정
  const IconComponent = ICON_MAP[state][size];

  // 스타일 결정
  const isZero = current === 0 && total === 0;

  // state에 따른 텍스트 색상 (done과 ongoing은 모두 초록색)
  const textColorClass = isZero ? "text-color-default" : "text-brand-primary";

  const textSizeClass = size === "small" ? "text-md-r" : "text-lg-r";
  const paddingClass = "px-2 py-1"; // px-2 = 8px, py-1 = 4px

  // 너비 고정 (내용에 따라 변하지 않게)
  const widthClass = size === "small" ? "w-[58px]" : "w-[66px]";
  const heightClass = size === "small" ? "h-[25px]" : "h-[28px]";

  // 라운드 크기 (Large는 더 동그랗게)
  const roundedClass = size === "small" ? "rounded-xl" : "rounded-[14px]";

  return (
    <div
      className={`bg-background-inverse inline-flex flex-row items-center justify-center gap-1 ${roundedClass} ${widthClass} ${heightClass} ${paddingClass}`}
    >
      {/* 아이콘 */}
      <IconComponent
        width={16}
        height={16}
        className="block flex-shrink-0"
        aria-hidden="true"
      />

      {/* 숫자 텍스트 */}
      <span className={`${textSizeClass} ${textColorClass} leading-none`}>
        {current}/{total}
      </span>
    </div>
  );
}
