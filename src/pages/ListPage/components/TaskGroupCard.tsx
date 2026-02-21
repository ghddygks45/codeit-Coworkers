import React, { useEffect, useRef, useState } from "react";
import KebabIcon from "@/assets/kebab.svg";
import Loading from "@/assets/progress-ongoing.svg";
import LoadingDone from "@/assets/progress-done.svg";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const countText =
    current === null || total === null ? "—/—" : `${current}/${total}`;

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
        {/* ✅ 아이콘이 0/0 앞쪽에 오도록 한 덩어리로 */}
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

        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="hover:bg-background-secondary rounded-md p-1 transition-colors"
            aria-label="목록 메뉴"
          >
            <KebabIcon className="text-icon-primary h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>

          {isMenuOpen && (
            <div className="border-border-primary absolute right-0 z-50 mt-2 w-24 overflow-hidden rounded-lg border bg-white shadow-lg sm:w-28">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                  setIsMenuOpen(false);
                }}
                className="text-sm-m text-color-primary hover:bg-background-secondary sm:text-md-m w-full px-4 py-2 text-left transition-colors"
              >
                수정하기
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                  setIsMenuOpen(false);
                }}
                className="text-sm-m sm:text-md-m w-full px-4 py-2 text-left text-red-500 transition-colors hover:bg-red-50"
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
