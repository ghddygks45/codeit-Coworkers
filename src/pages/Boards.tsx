import { FetchBoundary } from "@/providers/boundary";
import { useBoardList } from "@/features/Boards/hooks/useBoardList";
import BestPostSection from "@/features/Boards/components/BestPostSection/BestPostSection";
import BoardListHeader from "@/features/Boards/components/BoardListHeader/BoardListHeader";
import BoardListSection from "@/features/Boards/components/BoardListSection/BoardListSection";
import FloatingWriteButton from "@/features/Boards/components/FloatingWriteButton/FloatingWriteButton";

/**
 * 자유게시판 페이지
 *
 * - 데스크톱/태블릿: 페이지네이션
 * - 모바일: 무한 스크롤
 */
export default function Boards() {
  const {
    keyword,
    setKeyword,
    debouncedKeyword,
    isMobile,
    isTablet,
    isLoading,
    displayArticles,
    data,
    page,
    setPage,
    pageSize,
    observerRef,
    hasNextPage,
    isFetching,
    headerMarginClass,
    titleClass,
    sectionGapClass,
    gridClass,
    cardSize,
    handleSortChange,
  } = useBoardList();

  return (
    <div className="!bg-background-primary min-h-screen pb-20">
      <div className="mx-auto max-w-[1120px] px-4 md:px-6">
        <BoardListHeader
          keyword={keyword}
          onKeywordChange={setKeyword}
          headerMarginClass={headerMarginClass}
          titleClass={titleClass}
          isMobile={isMobile}
        />

        <FetchBoundary
          loadingFallback={
            <div className="bg-background-secondary flex h-[280px] animate-pulse items-center justify-center rounded-xl">
              <span className="text-color-default text-md-r">
                베스트 게시글 로딩 중...
              </span>
            </div>
          }
        >
          <BestPostSection />
        </FetchBoundary>

        <BoardListSection
          sectionGapClass={sectionGapClass}
          handleSortChange={handleSortChange}
          isMobile={isMobile}
          isTablet={isTablet}
          isLoading={isLoading}
          displayArticles={displayArticles}
          debouncedKeyword={debouncedKeyword}
          gridClass={gridClass}
          cardSize={cardSize}
          data={data}
          pageSize={pageSize}
          page={page}
          setPage={setPage}
          observerRef={observerRef}
          hasNextPage={hasNextPage}
          isFetching={isFetching}
        />
      </div>

      {!isMobile && !isTablet && <FloatingWriteButton />}
    </div>
  );
}
