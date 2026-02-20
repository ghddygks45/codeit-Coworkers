import PlusIcon from "@/assets/plus.svg";
import { Link } from "react-router-dom";

interface AddTeamButtonProps {
  size?: "sm" | "md";
  className?: string;
  style?: React.CSSProperties;
}

export default function AddTeamButton({
  size = "sm",
  className,
  style,
}: AddTeamButtonProps) {
  const heightClass = size === "md" ? "h-[42px]" : "h-[33px]";

  return (
    <>
      <Link
        to="team/add"
        className={`group text-md-sb text-brand-primary border-brand-primary hover:bg-brand-primary flex w-full items-center justify-center rounded-[8px] border hover:text-white ${heightClass} ${className ?? ""}`}
        style={style}
      >
        <span className="flex items-center gap-1">
          <PlusIcon className="text-brand-primary h-4 w-4 group-hover:text-white" />
          팀 추가하기
        </span>
      </Link>
    </>
  );
}
