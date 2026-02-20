import { Input } from "@/components/common/Input/Input";

interface BoardListHeaderProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  headerMarginClass: string;
  titleClass: string;
  isMobile: boolean;
}

/**
 * 자유게시판 페이지 상단: 제목 + 검색창
 */
export default function BoardListHeader({
  keyword,
  onKeywordChange,
  headerMarginClass,
  titleClass,
  isMobile,
}: BoardListHeaderProps) {
  return (
    <header
      className={`${headerMarginClass} ${
        isMobile ? "flex flex-col gap-5" : "flex items-center justify-between"
      }`}
    >
      <h1 className={`${titleClass} text-color-primary`}>자유게시판</h1>
      <div className={isMobile ? "w-full" : "w-[420px]"}>
        <Input
          variant="search"
          withSearchIcon
          placeholder="검색어를 입력해주세요"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className={`focus:!border-brand-primary !rounded-[1000px] !border-2 focus:!outline-none ${
            isMobile ? "!h-[48px]" : "!h-[56px]"
          }`}
        />
      </div>
    </header>
  );
}
