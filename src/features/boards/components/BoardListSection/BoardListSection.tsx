import { RefObject } from "react";
import BoardListSectionHeader from "../BoardListSectionHeader/BoardListSectionHeader";
import BoardListSkeleton from "../BoardListSkeleton/BoardListSkeleton";
import BoardListEmpty from "../BoardListEmpty/BoardListEmpty";
import BoardListGrid from "../BoardListGrid/BoardListGrid";
import Pagination from "@/components/common/Pagination/Pagination";
import type { ArticleSummary } from "@/types/article";

interface BoardListSectionProps {
  sectionGapClass: string;
  handleSortChange: (item: { label: string; value: string }) => void;
  isMobile: boolean;
  isTablet: boolean;
  isLoading: boolean;
  displayArticles: ArticleSummary[];
  debouncedKeyword: string;
  gridClass: string;
  cardSize: "small" | "large";
  data: { list: ArticleSummary[]; totalCount: number } | undefined;
  pageSize: number;
  page: number;
  setPage: (page: number) => void;
  observerRef: RefObject<HTMLDivElement | null>;
  hasNextPage: boolean | undefined;
  isFetching: boolean;
}

/**
 * 자유게시판 "전체" 섹션 (헤더 + 목록/스켈레톤/빈목록 + 페이지네이션 + 무한스크롤 + 로딩 오버레이)
 */
export default function BoardListSection({
  sectionGapClass,
  handleSortChange,
  isMobile,
  isTablet,
  isLoading,
  displayArticles,
  debouncedKeyword,
  gridClass,
  cardSize,
  data,
  pageSize,
  page,
  setPage,
  observerRef,
  hasNextPage,
  isFetching,
}: BoardListSectionProps) {
  return (
    <section className={sectionGapClass}>
      <BoardListSectionHeader
        onSortChange={handleSortChange}
        isMobile={isMobile}
        isTablet={isTablet}
      />

      {isLoading && displayArticles.length === 0 ? (
        <BoardListSkeleton />
      ) : displayArticles.length > 0 ? (
        <BoardListGrid
          articles={displayArticles}
          gridClass={gridClass}
          cardSize={cardSize}
          fullWidth={isMobile || isTablet}
        />
      ) : (
        <BoardListEmpty keyword={debouncedKeyword || undefined} />
      )}

      {!isMobile && data && data.totalCount > pageSize && (
        <div className="mt-10">
          <Pagination
            currentPage={page}
            totalCount={data.totalCount}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </div>
      )}

      {isMobile && hasNextPage && (
        <div ref={observerRef} className="flex justify-center py-6">
          {isFetching && (
            <span className="text-md-r text-color-default">불러오는 중...</span>
          )}
        </div>
      )}

      {!isMobile && isFetching && !isLoading && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-white/30" />
      )}
    </section>
  );
}
