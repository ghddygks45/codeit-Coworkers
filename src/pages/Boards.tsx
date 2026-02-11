import BoardListHeader from "@/features/boards/components/BoardListHeader";
import BoardListSection from "@/features/boards/components/BoardListSection";
import BestPostSection from "@/features/boards/components/BestPostSection";
import FloatingWriteButton from "@/features/boards/components/FloatingWriteButton";
import { FetchBoundary } from "@/providers/boundary";
import { useBoardList } from "@/features/boards/hooks/useBoardList";

/**
 * 자유게시판 페이지
 *
 * - 데스크톱/태블릿: 페이지네이션
 * - 모바일: 무한 스크롤
 */
export default function Boards() {
  const isMobile = useIsMobile(); // < 768px
  const isTabletOrSmaller = useIsMobile("lg"); // < 1024px
  const isTablet = !isMobile && isTabletOrSmaller;

  // 검색 & 정렬 상태
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [orderBy, setOrderBy] = useState<"recent" | "like">("recent");

  // 페이지네이션 상태 (데스크톱/태블릿)
  const [page, setPage] = useState(1);

  // 무한 스크롤 상태 (모바일)
  const [mobileArticles, setMobileArticles] = useState<ArticleSummary[]>([]);
  const [mobilePage, setMobilePage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  const pageSize = isMobile ? PAGE_SIZE_MOBILE : PAGE_SIZE_DESKTOP;

  // 검색어 디바운스 (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
      setMobilePage(1);
      setMobileArticles([]);
      setHasMore(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // API 호출
  const currentPage = isMobile ? mobilePage : page;
  const { data, isLoading, isFetching } = useArticles({
    page: currentPage,
    pageSize,
    orderBy,
    keyword: debouncedKeyword || undefined,
  });

  // 모바일: 데이터 도착 시 누적
  useEffect(() => {
    if (!isMobile || !data) return;

    const timer = setTimeout(() => {
      // 데이터 중복 추가 방지 (이미 있는 데이터인지 확인)
      const lastIncomingId = data.list[data.list.length - 1]?.id;
      const isAlreadyLoaded = mobileArticles.some(
        (article) => article.id === lastIncomingId,
      );

      if (mobilePage === 1) {
        setMobileArticles(data.list);
      } else if (!isAlreadyLoaded) {
        setMobileArticles((prev) => [...prev, ...data.list]);
      }

      // 더 불러올 데이터가 있는지 확인
      const totalPages = Math.ceil(data.totalCount / pageSize);
      setHasMore(mobilePage < totalPages);
    }, 0);

    return () => clearTimeout(timer);
  }, [data, isMobile, mobilePage, pageSize, mobileArticles]);

  // 모바일: 무한 스크롤 IntersectionObserver
  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setMobilePage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    if (!isMobile || !observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [isMobile, loadMore]);

  // 정렬 변경 핸들러
  const handleSortChange = (item: { label: string; value: string }) => {
    const mapped = SORT_MAP[item.value as SortLabel];
    if (mapped) {
      setOrderBy(mapped);
      setPage(1);
      setMobilePage(1);
      setMobileArticles([]);
      setHasMore(true);
    }
  };

  // 표시할 게시글 목록
  const displayArticles = isMobile ? mobileArticles : (data?.list ?? []);

  // ─── 반응형 스타일 ────────────────────────────────────────

  const headerMarginClass = isMobile
    ? "mt-[25px] mb-[20px]"
    : "mt-[77px] mb-[29px] lg:mt-[87px] lg:mb-[30px]";

  const titleClass = isMobile ? "text-xl-b" : "text-2xl-b";

  const sectionGapClass = isTablet ? "mt-[28px]" : "mt-[45px]";

  const cardSize = isMobile ? "small" : "large";

  const gridClass =
    isMobile || isTablet
      ? "flex flex-col gap-4"
      : "grid grid-cols-2 gap-x-4 gap-y-5";

  return (
    <div className="!bg-background-primary min-h-screen pb-20">
      <div className="mx-auto max-w-[1120px] px-4 md:px-6">
        <BoardListHeader
          keyword={boardList.keyword}
          onKeywordChange={boardList.setKeyword}
          headerMarginClass={boardList.headerMarginClass}
          titleClass={boardList.titleClass}
          isMobile={boardList.isMobile}
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
          sectionGapClass={boardList.sectionGapClass}
          handleSortChange={boardList.handleSortChange}
          isMobile={boardList.isMobile}
          isTablet={boardList.isTablet}
          isLoading={boardList.isLoading}
          displayArticles={boardList.displayArticles}
          debouncedKeyword={boardList.debouncedKeyword}
          gridClass={boardList.gridClass}
          cardSize={boardList.cardSize}
          data={boardList.data}
          pageSize={boardList.pageSize}
          page={boardList.page}
          setPage={boardList.setPage}
          observerRef={boardList.observerRef}
          hasNextPage={boardList.hasNextPage}
          isFetching={boardList.isFetching}
        />
      </div>

      {!boardList.isMobile && !boardList.isTablet && <FloatingWriteButton />}
    </div>
  );
}
