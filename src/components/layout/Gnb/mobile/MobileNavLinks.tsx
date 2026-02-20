import BoardIcon from "@/assets/board.svg";
import { Link } from "react-router-dom";

interface MobileNavLinksProps {
  isMenuOpen: boolean;
  animationDelay: number;
  isSelected: boolean;
}

export default function MobileNavLinks({
  isMenuOpen,
  animationDelay,
  isSelected,
}: MobileNavLinksProps) {
  return (
    <div
      className={`border-border-primary border-t ${
        isMenuOpen
          ? "mx-0 animate-[fadeDown_0.5s_ease-out_forwards] opacity-0"
          : "mx-4"
      }`}
      style={isMenuOpen ? { animationDelay: `${animationDelay}ms` } : {}}
    >
      <div className="mt-[12px]">
        <Link
          to="/boards"
          className={`group text-lg-m hover:bg-brand-secondary flex h-[52px] w-full items-center gap-3 rounded-[12px] px-4 text-left ${isSelected ? "bg-brand-secondary" : ""}`}
        >
          <BoardIcon
            className={`group-hover:text-brand-primary h-[20px] w-[20px] flex-shrink-0 ${isSelected ? "text-brand-primary" : "text-icon-gnb"}`}
          />
          <span
            className={`text-lg-r group-hover:text-brand-primary line-clamp-2 group-hover:font-semibold ${isSelected ? "text-brand-primary font-semibold" : "text-color-primary"}`}
          >
            자유게시판
          </span>
        </Link>
      </div>
    </div>
  );
}
