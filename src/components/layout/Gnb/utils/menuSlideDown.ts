import type { GroupSummaryServer } from "@/types/group";

export const ITEM_DELAY = 200; // 각 항목 간 딜레이 (ms)

// 모바일 메뉴 아이템 타입 정의
export type MobileMenuItem =
  | { type: "team"; data: GroupSummaryServer }
  | { type: "addTeamButton" }
  | { type: "navLinks" };

// 전체 아이템 순서 정의 - 이 배열 순서가 애니메이션 순서
export function getMobileMenuItems(
  groups: GroupSummaryServer[],
): MobileMenuItem[] {
  return [
    ...groups.map((group) => ({ type: "team" as const, data: group })),
    { type: "addTeamButton" as const },
    { type: "navLinks" as const },
  ];
}

// 특정 타입 아이템의 인덱스 찾기
export const getItemIndex = (
  items: MobileMenuItem[],
  type: Exclude<MobileMenuItem["type"], "team">,
) => items.findIndex((item) => item.type === type);

// 애니메이션 props 생성
export const menuSlideDownProps = (index: number, isOpen: boolean) => {
  if (!isOpen) return {};

  return {
    className: "opacity-0 animate-[fadeDown_0.5s_ease-out_forwards]",
    style: { animationDelay: `${index * ITEM_DELAY}ms` },
  };
};
