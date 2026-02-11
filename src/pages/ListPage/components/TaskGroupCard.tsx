import React, { useState, useEffect, useRef } from "react";
import KebabIcon from "@/assets/kebab.svg";

interface TaskGroupCardProps {
  name: string;
  current: number;
  total: number;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TaskGroupCard = ({
  name,
  current,
  total,
  onClick,
  onEdit,
  onDelete,
}: TaskGroupCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 시 닫기 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      onClick={onClick}
      className="border-border-primary hover:border-brand-primary group relative flex cursor-pointer items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition-all"
    >
      <span className="text-lg-m text-color-primary">{name}</span>

      <div className="flex items-center gap-3">
        <span className="text-md-sb text-brand-primary">
          {current}/{total}
        </span>

        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="hover:bg-background-secondary rounded-md p-1 transition-colors"
          >
            <KebabIcon className="text-icon-primary h-4 w-4" />
          </button>

          {isMenuOpen && (
            <div className="border-border-primary absolute right-0 z-50 mt-2 w-28 overflow-hidden rounded-lg border bg-white shadow-lg">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                  setIsMenuOpen(false);
                }}
                className="text-md-m text-color-primary hover:bg-background-secondary w-full px-4 py-2 text-left transition-colors"
              >
                수정하기
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                  setIsMenuOpen(false);
                }}
                className="text-md-m w-full px-4 py-2 text-left text-red-500 transition-colors hover:bg-red-50"
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
