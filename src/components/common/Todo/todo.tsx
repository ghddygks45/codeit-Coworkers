import React from "react";
import CheckedIcon from "@/assets/checkbox-active.svg";
import UncheckedIcon from "@/assets/checkbox.svg";
import { cn } from "@/utils/clsx";

/**
 * @interface TodoProps
 * @property {string} content - 할 일의 상세 내용입니다.
 * @property {boolean} isCompleted - 할 일의 완료 여부(체크 상태)를 결정합니다.
 * @property {() => void} [onToggle] - 체크박스 상태가 변경될 때 실행되는 이벤트 핸들러입니다.
 * @property {boolean} [isWeb] - 테스트/디버깅용으로 특정 레이아웃을 강제할 때 사용합니다.
 * 이 프롭이 없으면 화면 너비에 따라 반응형으로 동작합니다.
 */
interface TodoProps {
  content: string;
  isCompleted: boolean;
  onToggle?: () => void;
  isWeb?: boolean;
  className?: string;
  iconClassName?: string;
}

/**
 * Coworkers 프로젝트의 웹 접근성(A11y)을 고려한 공통 Todo 아이템 컴포넌트입니다.
 * 실제 체크박스(input)를 숨기고 커스텀 SVG 아이콘을 라벨로 연결하여 구현되었습니다.
 */
const Todo = ({
  content,
  isCompleted,
  onToggle,
  isWeb,
  className,
  iconClassName,
}: TodoProps) => {
  const isWebForced = isWeb !== undefined;

  const containerStyle = isWebForced
    ? isWeb
      ? "gap-4"
      : "gap-3"
    : "gap-3 md:gap-4";

  const iconSize = isWebForced
    ? isWeb
      ? "h-5 w-5"
      : "h-3 w-3"
    : "h-3 w-3 md:h-5 md:w-5";

  const textSize = isWebForced
    ? isWeb
      ? "text-md-r"
      : "text-xs-r"
    : "text-xs-r md:text-md-r";

  return (
    <label
      className={cn(
        `group flex w-full ${onToggle ? "cursor-pointer" : "cursor-default"} items-center transition-all ${containerStyle}`,
        className,
      )}
    >
      {/* 실제 체크박스 요소를 사용하여 접근성을 확보합니다. */}
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={onToggle}
        readOnly={!onToggle}
        className="sr-only"
      />

      {/* 체크 상태에 따른 커스텀 아이콘 렌더링 영역 */}
      <div
        className={cn(
          `flex shrink-0 items-center justify-center transition-transform active:scale-95 ${iconSize}`,
          iconClassName,
        )}
      >
        {isCompleted ? (
          <CheckedIcon className="h-full w-full" />
        ) : (
          <UncheckedIcon className="h-full w-full" />
        )}
      </div>

      <span
        className={`transition-all duration-200 select-none ${textSize} ${
          isCompleted
            ? "text-color-disabled line-through opacity-60"
            : "text-color-primary"
        }`}
      >
        {content}
      </span>
    </label>
  );
};

export default Todo;
