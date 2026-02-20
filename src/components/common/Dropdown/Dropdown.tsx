import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import ArrowDown from "@/assets/arrow-down.svg";
import User from "@/assets/user.svg";
import Kebab from "@/assets/kebab.svg";
import KebabSmall from "@/assets/kebab-small.svg";
import Set from "@/assets/set.svg";

/**
 * 드롭다운 옵션 타입
 *
 * @property {string} label - 화면에 표시될 텍스트
 * @property {string} value - 옵션을 식별하기 위한 값 (React key 및 선택 식별에 사용)
 * @property {string} [link] - 선택 시 이동할 라우트 경로 (react-router-dom 사용)
 * @property {() => void} [action] - 선택 시 실행할 커스텀 함수
 *
 * @remarks
 * - `action`과 `link`가 모두 있는 경우, **action이 우선 실행**됩니다.
 */
export type Option = {
  label: string;
  value: string;
  link?: string;
  action?: () => void;
};

/**
 * 기본 옵션 프리셋 목록
 * - `optionsKey`를 통해 자주 사용되는 옵션 세트를 빠르게 선택할 수 있습니다.
 */
const DEFAULT_LIST = {
  newest: [
    { label: "최신순", value: "최신순" },
    { label: "좋아요 많은순", value: "좋아요 많은순" },
  ],
  myHistory: [
    { label: "마이 히스토리", value: "마이 히스토리" },
    { label: "계정 설정", value: "계정 설정" },
    { label: "팀 참여", value: "팀 참여" },
    { label: "로그아웃", value: "로그아웃" },
  ],
  repeat: [
    { label: "한 번", value: "한 번" },
    { label: "매일", value: "매일" },
    { label: "주 반복", value: "주 반복" },
    { label: "월 반복", value: "월 반복" },
    { label: "반복 안함", value: "반복 안함" },
  ],
  edit: [
    { label: "수정하기", value: "수정하기" },
    { label: "삭제하기", value: "삭제하기" },
  ],
  myList: [
    { label: "마이 히스토리", value: "마이 히스토리" },
    { label: "로그아웃", value: "로그아웃" },
  ],
};

type OptionsKey = keyof typeof DEFAULT_LIST;

/**
 * Dropdown 컴포넌트 Props
 *
 * @property {OptionsKey} [optionsKey="newest"] - 프리셋 키 (`DEFAULT_LIST` 기준)
 * @property {Option[]} [options] - 커스텀 옵션 목록. 전달 시 프리셋보다 우선 적용됩니다.
 * @property {"text" | "user" | "kebab" | "set"} [trigger="text"] - 드롭다운 트리거 타입
 * @property {string} [defaultLabel=""] - 선택된 값이 없을 때 표시할 기본 라벨
 * @property {React.ReactNode} [icon] - 트리거가 아이콘일 때 표시할 커스텀 아이콘
 * @property {"left" | "center"} [listAlign="left"] - 리스트 아이템 텍스트 정렬
 * @property {boolean} [keepSelected=true] - 선택된 상태를 트리거에 유지할지 여부
 * @property {(item: Option) => void} [onSelect] - 옵션 선택 시 호출되는 콜백 함수
 * @property {boolean} [showArrow=true] - text 트리거일 때 화살표 아이콘 표시 여부
 * @property {string} [listClassName] - 옵션 리스트(ul)에 추가할 커스텀 클래스
 */
type DropdownProps = {
  optionsKey?: OptionsKey;
  options?: Option[];
  trigger?: "text" | "user" | "kebab" | "kebabSmall" | "set";
  defaultLabel?: string;
  icon?: React.ReactNode;
  listAlign?: "left" | "center";
  keepSelected?: boolean;
  onSelect?: (item: Option) => void;
  showArrow?: boolean;
  listClassName?: string;
  usePortal?: boolean;
  portalOffset?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
  };
};

/**
 * 공용 Dropdown 컴포넌트
 *
 * ## 역할
 * - 다양한 트리거(텍스트, 아이콘)를 통해 옵션 리스트를 노출합니다.
 * - 내부 프리셋 옵션 또는 커스텀 옵션을 지원하며, 라우팅 및 액션 실행 기능을 포함합니다.
 *
 * ## 동작 방식
 * - 외부 영역 클릭 시 자동 닫힘 기능 (`rootRef` 및 `mousedown` 이벤트 사용)
 * - `item.action` 우선 실행 후 없을 경우 `item.link`로 이동
 *
 * @example
 * <Dropdown optionsKey="newest" onSelect={(item) => console.log(item)} />
 */
export default function Dropdown({
  optionsKey = "newest",
  options,
  trigger = "text",
  defaultLabel = "",
  icon,
  listAlign = "left",
  keepSelected = true,
  onSelect,
  showArrow = true,
  listClassName,
  usePortal = false,
  portalOffset,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const [portalPos, setPortalPos] = useState({ top: 0, left: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  /** 최종 옵션: 커스텀 옵션 우선, 없으면 프리셋 사용 */
  const finalOptions = options ?? DEFAULT_LIST[optionsKey];

  /** portal 모드: 트리거 위치 기반으로 드롭다운 좌표 계산 */
  const updatePortalPos = useCallback(() => {
    if (usePortal && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      setPortalPos({
        top:
          rect.bottom +
          10 +
          (portalOffset?.top ?? 0) -
          (portalOffset?.bottom ?? 0),
        left:
          rect.left + (portalOffset?.left ?? 0) - (portalOffset?.right ?? 0),
      });
    }
  }, [usePortal, portalOffset]);

  useEffect(() => {
    if (open && usePortal) updatePortalPos();
  }, [open, usePortal, updatePortalPos]);

  useEffect(() => {
    if (!open || !usePortal) return;
    const handleScroll = () => setOpen(false);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", updatePortalPos);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", updatePortalPos);
    };
  }, [open, usePortal, updatePortalPos]);

  useEffect(() => {
    /** 드롭다운 영역 외부 클릭 시 닫기 처리 */
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        rootRef.current &&
        !rootRef.current.contains(target) &&
        (!listRef.current || !listRef.current.contains(target))
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const listItemAlign =
    listAlign === "center" ? "justify-center text-center" : "justify-start";

  /**
   * 옵션 선택 시 처리 로직
   * 1. 선택 상태 업데이트 (keepSelected 시)
   * 2. 외부 콜백(onSelect) 호출
   * 3. action 실행 혹은 link 이동
   */
  const handleSelect = (item: Option) => {
    if (keepSelected) setSelected(item);
    onSelect?.(item);

    if (item.action) {
      item.action();
    } else if (item.link) {
      navigate(item.link);
    }
    setOpen(false);
  };

  /** 트리거 아이콘 결정 (커스텀 아이콘 우선) */
  const triggerIcon =
    icon ??
    (trigger === "kebab" ? (
      <Kebab />
    ) : trigger === "kebabSmall" ? (
      <KebabSmall />
    ) : trigger === "user" ? (
      <User />
    ) : trigger === "set" ? (
      <Set />
    ) : null);

  return (
    <div ref={rootRef}>
      {/* 트리거 영역: 텍스트 타입 */}
      {trigger === "text" ? (
        <div
          className="relative flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpen((prev) => !prev);
          }}
        >
          {showArrow && (
            <ArrowDown
              className={`absolute right-[14px] cursor-pointer transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
            />
          )}
          <div className="md:text-md-m text-xs-m text-color-default border-background-tertiary active:bg-background-tertiary hover:bg-background-tertiary flex h-[40px] w-[120px] cursor-pointer items-center rounded-[12px] border-1 px-[14px] py-[10px] md:h-[44px] md:w-[130px]">
            {selected ? selected.label : defaultLabel}
          </div>
        </div>
      ) : (
        /* 트리거 영역: 아이콘 타입 */
        <div
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpen((prev) => !prev);
          }}
        >
          {triggerIcon}
        </div>
      )}

      {/* 옵션 리스트 영역 */}
      {open &&
        (usePortal ? (
          createPortal(
            <div
              ref={listRef}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "fixed",
                top: portalPos.top,
                left: portalPos.left,
                zIndex: 9999,
              }}
            >
              <ul
                className={`border-background-tertiary bg-color-inverse rounded-[12px] border-1 ${listClassName}`}
              >
                {finalOptions.map((item) => (
                  <li
                    key={item.value}
                    onClick={() => handleSelect(item)}
                    className={`md:text-md-m text-xs-m text-color-default hover:bg-background-secondary flex h-[40px] w-[120px] cursor-pointer items-center px-[14px] first:rounded-t-[12px] last:rounded-b-[12px] md:h-[47px] md:w-[130px] ${listItemAlign}`}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>,
            document.body,
          )
        ) : (
          <div onClick={(e) => e.stopPropagation()}>
            <ul
              className={`border-background-tertiary bg-color-inverse absolute z-50 mt-[10px] rounded-[12px] border-1 ${listClassName}`}
            >
              {finalOptions.map((item) => (
                <li
                  key={item.value}
                  onClick={() => handleSelect(item)}
                  className={`md:text-md-m text-xs-m text-color-default hover:bg-background-secondary flex h-[40px] w-[120px] cursor-pointer items-center px-[14px] first:rounded-t-[12px] last:rounded-b-[12px] md:h-[47px] md:w-[130px] ${listItemAlign}`}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
