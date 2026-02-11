import { Link } from "react-router-dom";
import Dropdown from "@/components/common/Dropdown/Dropdown";

interface BoardListSectionHeaderProps {
  onSortChange: (item: { label: string; value: string }) => void;
  isMobile: boolean;
  isTablet: boolean;
}

/**
 * 전체 게시글 섹션 상단: "전체" 제목 + 글쓰기 버튼(모바일/태블릿) + 정렬 드롭다운
 */
export default function BoardListSectionHeader({
  onSortChange,
  isMobile,
  isTablet,
}: BoardListSectionHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-xl-b text-color-primary">전체</h2>
      <div className="flex items-center gap-3">
        {(isMobile || isTablet) && (
          <Link
            to="/boards/write"
            className="bg-brand-primary hover:bg-interaction-hover rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            글쓰기
          </Link>
        )}
        <Dropdown
          optionsKey="newest"
          defaultLabel="최신순"
          onSelect={onSortChange}
        />
      </div>
    </div>
  );
}
