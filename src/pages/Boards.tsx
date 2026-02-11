import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import BestPostCarousel from "@/features/boards/components/BestPostCarousel";
import PostCard from "@/features/boards/components/PostCard";
import Pagination from "@/components/common/Pagination/Pagination";
import { Input } from "@/components/common/Input/Input";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import { FetchBoundary } from "@/providers/boundary";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useArticles, useBestArticles } from "@/api/article";
import type { ArticleSummary } from "@/types/article";
import PlusIcon from "@/assets/plus.svg";

// ─── 정렬 타입 매핑 ─────────────────────────────────────────

type SortLabel = "최신순" | "좋아요 많은순";
const SORT_MAP: Record<SortLabel, "recent" | "like"> = {
  최신순: "recent",
  "좋아요 많은순": "like",
};

// ─── 베스트 게시글 섹션 (Suspense 내부) ─────────────────────

function BestPostSection() {
  const { data } = useBestArticles(5);

  // API 응답 → BestPostCarousel 형식으로 변환
  const bestPosts = data.list.map(toBestPost);

  return <BestPostCarousel posts={bestPosts} />;
}

// ─── 메인 페이지 컴포넌트 ───────────────────────────────────

const PAGE_SIZE_DESKTOP = 10;
const PAGE_SIZE_MOBILE = 5;

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
        {/* 헤더: 자유게시판 + 검색창 */}
        <header
          className={`${headerMarginClass} ${
            isMobile
              ? "flex flex-col gap-5"
              : "flex items-center justify-between"
          }`}
        >
          <h1 className={`${titleClass} text-color-primary`}>자유게시판</h1>

          {/* 검색창 */}
          <div className={isMobile ? "w-full" : "w-[420px]"}>
            <Input
              variant="search"
              withSearchIcon
              placeholder="검색어를 입력해주세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className={`focus:!border-brand-primary !rounded-[1000px] !border-2 focus:!outline-none ${
                isMobile ? "!h-[48px]" : "!h-[56px]"
              }`}
            />
          </div>
        </header>

        {/* 베스트 게시글 캐러셀 (Suspense로 감싸기) */}
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

        {/* 전체 게시글 섹션 */}
        <section className={sectionGapClass}>
          {/* 헤더: 전체 + 글쓰기 버튼(모바일/태블릿) + 드롭다운 */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl-b text-color-primary">전체</h2>
            <div className="flex items-center gap-3">
              {/* 글쓰기 버튼 (모바일/태블릿만) */}
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
                onSelect={handleSortChange}
              />
            </div>
          </div>

          {/* 게시글 목록 */}
          {isLoading && displayArticles.length === 0 ? (
            /* 초기 로딩 */
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-background-secondary h-[140px] animate-pulse rounded-[20px] md:h-[156px]"
                />
              ))}
            </div>
          ) : displayArticles.length > 0 ? (
            <div className={gridClass}>
              {displayArticles.map((article) => (
                <Link key={article.id} to={`/boards/${article.id}`}>
                  <PostCard
                    state="default"
                    size={cardSize}
                    title={article.title}
                    content=""
                    author={article.writer.nickname}
                    date={formatDate(article.createdAt)}
                    likeCount={article.likeCount}
                    imageUrl={article.image ?? undefined}
                    fullWidth={isMobile || isTablet}
                  />
                </Link>
              ))}
            </div>
          ) : (
            /* 게시글이 없을 때 */
            <div className="border-border-primary bg-background-secondary mt-4 rounded-lg border p-8 text-center">
              <p className="text-color-secondary">
                {debouncedKeyword
                  ? `"${debouncedKeyword}"에 대한 검색 결과가 없습니다.`
                  : "아직 게시글이 없습니다."}
              </p>
            </div>
          )}

          {/* 페이지네이션 (데스크톱/태블릿) */}
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

          {/* 무한 스크롤 감지 영역 (모바일) */}
          {isMobile && hasMore && (
            <div ref={observerRef} className="flex justify-center py-6">
              {isFetching && (
                <span className="text-md-r text-color-default">
                  불러오는 중...
                </span>
              )}
            </div>
          )}

          {/* 페이지 전환 중 오버레이 (데스크톱) */}
          {!isMobile && isFetching && !isLoading && (
            <div className="pointer-events-none fixed inset-0 z-40 bg-white/30" />
          )}
        </section>
      </div>

      {/* 플로팅 글쓰기 버튼 (데스크톱만) */}
      {!isMobile && !isTablet && (
        <Link
          to="/boards/write"
          className="bg-brand-primary hover:bg-interaction-hover fixed right-[120px] bottom-[76px] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors"
        >
          <PlusIcon className="h-6 w-6 text-white" />
        </Link>
      )}
    </div>
  );
}

// ─── 유틸 함수 ──────────────────────────────────────────────

/** API 날짜를 "YYYY. MM. DD" 형식으로 변환 */
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}. ${month}. ${day}`;
}

/** ArticleSummary → BestPostCarousel 형식으로 변환 */
function toBestPost(article: ArticleSummary) {
  return {
    id: article.id,
    title: article.title,
    content: "", // 목록 API는 content를 반환하지 않음
    author: article.writer.nickname,
    date: formatDate(article.createdAt),
    likeCount: article.likeCount,
    imageUrl: article.image ?? undefined,
  };
}
