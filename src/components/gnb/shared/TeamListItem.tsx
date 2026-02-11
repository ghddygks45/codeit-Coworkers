import Chess from "@/assets/chess.svg";
import { Link } from "react-router-dom";

interface TeamListItemProps {
  id: number;
  name: string;
  isSelected: boolean;
  className?: string;
}

export default function TeamListItem({
  id,
  name,
  isSelected,
  className,
}: TeamListItemProps) {
  return (
    <Link
      to={`/team/${id}`}
      className={`group text-lg-m hover:bg-brand-secondary flex h-[52px] w-full items-center gap-3 rounded-[12px] px-4 text-left ${isSelected ? "bg-brand-secondary text-brand-primary" : ""} ${className ?? ""}`}
    >
      <Chess
        className={`group-hover:text-brand-primary h-[20px] w-[20px] flex-shrink-0 ${isSelected ? "text-brand-primary" : "text-icon-gnb"}`}
      />
      <span
        className={`group-hover:text-brand-primary group-hover:text-lg-sb text-lg-r line-clamp-2 ${isSelected ? "text-lg-sb text-brand-primary" : "text-color-primary"}`}
      >
        {name}
      </span>
    </Link>
  );
}
