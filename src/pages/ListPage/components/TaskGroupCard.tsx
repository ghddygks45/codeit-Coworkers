import React from "react";
import KebabIcon from "@/assets/kebab.svg";
import Loading from "@/assets/progress-ongoing.svg";
import LoadingDone from "@/assets/progress-done.svg";

import Dropdown, { Option } from "@/components/common/Dropdown/Dropdown";

type Status = "done" | "ongoing" | "loading";

interface TaskGroupCardProps {
  name: string;

  // 로딩 처리 위해 null 허용
  current: number | null;
  total: number | null;

  // 아이콘 표시용 상태
  status: Status;

  isActive?: boolean;
  onClick?: () => void;

  // 부모에서 모달 띄우도록 콜백만 호출
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TaskGroupCard = ({
  name,
  current,
  total,
  status,
  isActive,
  onClick,
  onEdit,
  onDelete,
}: TaskGroupCardProps) => {
  const countText =
    current === null || total === null ? "—/—" : `${current}/${total}`;

  // action에 이벤트가 없어서, 여기서는 "카드 클릭 방지"를 trigger 쪽에서 처리해줄게
  const menuOptions: Option[] = [
    {
      label: "수정하기",
      value: "edit",
      action: () => onEdit?.(),
    },
    {
      label: "삭제하기",
      value: "delete",
      action: () => onDelete?.(),
    },
  ];

  return (
    <div
      onClick={onClick}
      className={`group relative flex cursor-pointer items-center justify-between rounded-xl border p-3 shadow-sm transition-all sm:p-4 ${
        isActive
          ? "border-brand-primary bg-blue-50"
          : "border-border-primary hover:border-brand-primary bg-white"
      }`}
    >
      <span
        className={`text-md-m sm:text-lg-m truncate pr-2 ${
          isActive ? "text-brand-primary" : "text-color-primary"
        }`}
      >
        {name}
      </span>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* 아이콘이 0/0 앞쪽에 오도록 한 덩어리로 */}
        <div className="flex items-center gap-1.5">
          {status === "done" ? (
            <LoadingDone className="h-4 w-4" />
          ) : status === "ongoing" ? (
            <Loading className="h-4 w-4" />
          ) : (
            // 로딩 중 레이아웃 흔들림 방지 (자리만 확보)
            <span className="inline-block h-4 w-4" />
          )}

          <span className="text-sm-sb text-brand-primary sm:text-md-sb">
            {countText}
          </span>
        </div>

        {/* 케밥 메뉴: 공통 Dropdown */}
        <Dropdown
          trigger="kebab"
          listAlign="center"
          icon={
            <button
              type="button"
              className="hover:bg-background-secondary rounded-full p-1 transition-colors"
              aria-label="목록 메뉴"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <KebabIcon className="text-icon-primary h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          }
          options={menuOptions}
          listClassName="overflow-hidden border border-border-primary bg-white shadow-lg"
          usePortal
        />
      </div>
    </div>
  );
};
