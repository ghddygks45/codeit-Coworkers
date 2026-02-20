import { Link } from "react-router-dom";
import PlusIcon from "@/assets/plus.svg";

/**
 * 자유게시판 플로팅 글쓰기 버튼 (데스크톱)
 */
export default function FloatingWriteButton() {
  return (
    <Link
      to="/boards/write"
      className="bg-brand-primary hover:bg-interaction-hover fixed right-[120px] bottom-[76px] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors"
    >
      <PlusIcon className="h-6 w-6 text-white" />
    </Link>
  );
}
