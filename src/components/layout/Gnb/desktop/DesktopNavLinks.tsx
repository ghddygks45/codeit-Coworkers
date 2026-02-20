import BoardIcon from "@/assets/board.svg";
import { Link, useLocation } from "react-router-dom";
import { useGnbStore } from "../useGnbStore";

export default function DesktopNavLinks() {
  const isFolded = useGnbStore((state) => state.isFolded);
  const { pathname } = useLocation();
  const isSelected = pathname.startsWith("/boards");

  if (isFolded) {
    return (
      <div className="mt-2 flex justify-center">
        <Link
          to="/boards"
          className={`group hover:bg-brand-secondary flex h-[52px] w-[52px] items-center gap-3 rounded-[12px] px-4 text-left ${isSelected ? "bg-brand-secondary" : ""}`}
        >
          <BoardIcon
            className={`group-hover:text-brand-primary h-[20px] w-[20px] flex-shrink-0 ${isSelected ? "text-brand-primary" : "text-icon-gnb"}`}
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="border-border-primary mx-4 border-t">
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
