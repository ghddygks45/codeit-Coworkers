import Dropdown from "@/components/common/Dropdown/Dropdown";

/**
 * Dropdown 컴포넌트 테스트 페이지
 *
 * ## 목적
 * - 공용 `Dropdown` 컴포넌트의 다양한 사용 시나리오를 한 화면에서 확인하기 위한 테스트 페이지입니다.
 * - `optionsKey`, `trigger`, `listAlign` 조합에 따른 UI/동작을 검증합니다.
 *
 * ## 테스트 항목
 * - 기본 텍스트 트리거 드롭다운 (정렬 / 반복 주기)
 * - 아이콘 트리거(user / set / kebab) 드롭다운
 * - 옵션 리스트 중앙 정렬(listAlign="center") 동작 확인
 *
 * ## 사용 방법
 * - 각 드롭다운을 클릭하여 옵션 선택
 * - 선택 시 리스트 닫힘 및 선택 상태 유지 여부 확인
 */
export default function TestDropdown() {
  return (
    <div className="mt-5 flex flex-col gap-20">
      {/* 정렬 옵션 드롭다운 테스트 */}
      <div className="border-background-tertiary m-auto flex h-[100px] w-[200px] items-center justify-center rounded-[12px] border-1">
        <Dropdown optionsKey="newest" defaultLabel="최신순" />
      </div>

      {/* 반복 주기 드롭다운 테스트 */}
      <div className="border-background-tertiary m-auto flex h-[100px] w-[200px] items-center justify-center rounded-[12px] border-1">
        <Dropdown optionsKey="repeat" defaultLabel="한 번" />
      </div>

      {/* 마이 히스토리 드롭다운 (중앙 정렬) */}
      <div className="border-background-tertiary m-auto flex h-[100px] w-[200px] items-center justify-center rounded-[12px] border-1">
        <Dropdown optionsKey="myHistory" listAlign="center" trigger="user" />
      </div>

      {/* 삭제/수정하기 드롭다운 (중앙 정렬) */}
      <div className="border-background-tertiary m-auto flex h-[100px] w-[200px] items-center justify-center rounded-[12px] border-1">
        <Dropdown optionsKey="edit" listAlign="center" trigger="set" />
      </div>

      {/* 리스트 페이지 케밥 드롭다운 (중앙 정렬) */}
      <div className="border-background-tertiary m-auto flex h-[100px] w-[200px] items-center justify-center rounded-[12px] border-1">
        <Dropdown optionsKey="myList" listAlign="center" trigger="kebab" />
      </div>
    </div>
  );
}
