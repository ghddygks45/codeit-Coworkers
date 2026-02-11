import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowDown from "@/assets/arrow-down.svg";
import User from "@/assets/user.svg";
import Kebab from "@/assets/kebab.svg";
import Set from "@/assets/set.svg";

/**
 * 드롭다운 옵션 타입
 *
 * @property {string} label - 화면에 표시될 텍스트
 * @property {string} value - 옵션을 식별하기 위한 값(React key 및 선택 식별에 사용)
 * @property {string} [link] - 선택 시 이동할 라우트 경로 (react-router-dom 사용)
 * @property {() => void} [action] - 선택 시 실행할 커스텀 액션
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
 *
 * - `optionsKey`로 공용 옵션 세트를 빠르게 선택할 수 있습니다.
 * - `options` props가 전달되면 해당 옵션 목록이 프리셋보다 우선 적용됩니다.
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
 * @property {OptionsKey} [optionsKey="newest"]
 * 기본 옵션 프리셋 키 (`DEFAULT_LIST` 중 하나). `options`가 없을 때 사용됩니다.
 *
 * @property {Option[]} [options]
 * 커스텀 옵션 목록. 전달되면 `optionsKey`보다 우선합니다.
 *
 * @property {"text" | "user" | "kebab" | "set"} [trigger="text"]
 * 드롭다운을 여는 트리거 타입.
 * - `"text"`: 텍스트 버튼(기본)
 * - `"user"` / `"kebab"` / `"set"`: 아이콘 버튼 트리거
 *
 * @property {string} [defaultLabel=""]
 * 선택된 값이 없을 때 텍스트 트리거에 표시할 기본 라벨
 *
 * @property {React.ReactNode} [icon]
 * 트리거가 text가 아닐 때 표시할 커스텀 아이콘(지정 시 기본 아이콘보다 우선)
 *
 * @property {"left" | "center"} [listAlign="left"]
 * 옵션 리스트 아이템 정렬 방식
 *
 * @property {boolean} [keepSelected=true]
 * 옵션 선택 후 선택 상태를 유지할지 여부
 * - `true`: 선택한 label을 트리거에 표시
 * - `false`: 선택 상태를 저장하지 않음(메뉴처럼 사용 가능)
 *
 * @property {(item: Option) => void} [onSelect]
 * 옵션 선택 시 호출되는 콜백
 *
 * @property {boolean} [showArrow=true]
 * `trigger="text"`일 때 화살표 아이콘 표시 여부
 */
type DropdownProps = {
  optionsKey?: OptionsKey;
  options?: Option[];
  trigger?: "text" | "user" | "kebab" | "set";
  defaultLabel?: string;

  icon?: React.ReactNode;
  listAlign?: "left" | "center";
  keepSelected?: boolean;
  onSelect?: (item: Option) => void;

  showArrow?: boolean;
  listClassName?: string;
};

/**
 * 공용 Dropdown 컴포넌트 (프리셋 + 커스텀 옵션 + 다양한 트리거 + 링크/액션 지원)
 *
 * ## 역할
 * - 옵션 목록을 선택할 수 있는 드롭다운 UI를 제공합니다.
 * - 프리셋 옵션(`optionsKey`) 또는 커스텀 옵션(`options`)을 사용할 수 있습니다.
 * - 텍스트 트리거뿐 아니라 아이콘 트리거(user/kebab/set)도 지원합니다.
 *
 * ## 동작 방식
 * - 트리거 클릭 → 목록 열기/닫기
 * - 옵션 클릭 → 선택 처리(`keepSelected`) + `onSelect` 호출 + (필요 시) `action/link` 실행 + 닫기
 * - 컴포넌트 외부 클릭 → 자동 닫힘
 *
 * ## 옵션 우선순위
 * 1) `options` (커스텀 옵션)
 * 2) `DEFAULT_LIST[optionsKey]` (프리셋 옵션)
 *
 * ## 선택 시 실행 우선순위
 * 1) `item.action()` 실행
 * 2) `item.link`가 있으면 `navigate(item.link)` 이동
 *
 * ## 사용 예시
 * @example
 * // 1) 프리셋 사용 (정렬)
 * <Dropdown
 *   optionsKey="newest"
 *   defaultLabel="정렬"
 *   onSelect={(item) => console.log(item.value)}
 * />
 *
 * @example
 * // 2) 커스텀 옵션 + 라우팅 이동
 * <Dropdown
 *   trigger="user"
 *   options={[
 *     { label: "마이페이지", value: "mypage", link: "/mypage" },
 *     { label: "로그아웃", value: "logout", action: () => logout() },
 *   ]}
 *   keepSelected={false}
 * />
 *
 * ## 주의사항
 * - 이 컴포넌트는 내부적으로 `document.addEventListener("click", ...)`를 사용합니다. (브라우저 환경)
 * - `useNavigate()`를 사용하므로 **react-router-dom 환경에서만** 정상 동작합니다.
 * - 단일 선택(single select) 구조이며 멀티 선택은 지원하지 않습니다.
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
}: DropdownProps) {
  /** 드롭다운 열림 여부 */
  const [open, setOpen] = useState(false);

  /** 현재 선택된 옵션(keepSelected=true일 때만 의미가 큼) */
  const [selected, setSelected] = useState<Option | null>(null);

  /** 외부 클릭 감지를 위한 루트 요소 ref */
  const rootRef = useRef<HTMLDivElement>(null);

  /** react-router-dom 네비게이션 함수 */
  const navigate = useNavigate();

  /** 최종 옵션: 커스텀 옵션이 있으면 우선, 없으면 프리셋 사용 */
  const finalOptions = options ?? DEFAULT_LIST[optionsKey];

  useEffect(() => {
    /** 드롭다운 영역 바깥 클릭 시 닫기 */
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /** 리스트 아이템 정렬 클래스 */
  const listItemAlign =
    listAlign === "center" ? "justify-center text-center" : "justify-start";

  /**
   * 옵션 선택 처리
   *
   * - keepSelected가 true면 선택 상태를 저장합니다.
   * - onSelect 콜백을 호출합니다.
   * - item.action이 있으면 실행하고, 없으면 item.link로 이동합니다.
   *
   * @param {Option} item - 선택된 옵션
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

  /** 트리거 아이콘 결정: icon이 있으면 우선, 없으면 trigger 타입별 기본 아이콘 사용 */
  const triggerIcon =
    icon ??
    (trigger === "kebab" ? (
      <Kebab />
    ) : trigger === "user" ? (
      <User />
    ) : trigger === "set" ? (
      <Set />
    ) : null);

  return (
    <div ref={rootRef}>
      {trigger === "text" ? (
        <div className="relative flex items-center">
          {showArrow && (
            <ArrowDown
              onClick={() => setOpen((item) => !item)}
              className={`absolute right-[14px] cursor-pointer transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
            />
          )}
          <div
            onClick={() => setOpen((item) => !item)}
            className="md:text-md-m text-xs-m text-color-default border-background-tertiary active:bg-background-tertiary hover:bg-background-tertiary flex h-[40px] w-[120px] cursor-pointer items-center rounded-[12px] border-1 px-[14px] py-[10px] md:h-[44px] md:w-[130px]"
          >
            {selected ? selected.label : defaultLabel}
          </div>
        </div>
      ) : (
        <div
          className="cursor-pointer"
          onClick={() => setOpen((item) => !item)}
        >
          {triggerIcon}
        </div>
      )}

      {open && (
        <div>
          <ul
            className={`border-background-tertiary bg-color-inverse absolute z-50 mt-[10px] rounded-[12px] border-1 ${listClassName}`}
          >
            {finalOptions.map((item) => (
              <li
                key={item.value}
                onClick={() => {
                  handleSelect(item);
                }}
                className={`md:text-md-m text-xs-m text-color-default flex h-[40px] w-[120px] cursor-pointer items-center px-[14px] md:h-[47px] md:w-[130px] ${listItemAlign}`}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
