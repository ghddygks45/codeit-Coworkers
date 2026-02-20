import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/useMediaQuery";
import PostCard from "../PostCard/PostCard";
import CarouselDots from "./CarouselDots";
import CarouselArrows from "./CarouselArrows";

// 베스트 게시글 데이터 타입
interface BestPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  likeCount: number;
  imageUrl?: string;
}

interface BestPostCarouselProps {
  /** 베스트 게시글 목록 */
  posts: BestPost[];
}

// Breakpoint별 설정 (태블릿/데스크톱용)
type Breakpoint = "tablet" | "desktop";

const CAROUSEL_CONFIG: Record<
  Breakpoint,
  { cardsPerPage: number; cardSize: "small" | "large"; titleClass: string }
> = {
  tablet: { cardsPerPage: 2, cardSize: "small", titleClass: "text-xl-b" },
  desktop: { cardsPerPage: 3, cardSize: "large", titleClass: "text-xl-b" },
};

/**
 * 베스트 게시글 캐러셀 컴포넌트
 *
 * @description
 * 데스크톱: 3개 카드 (large) — 페이지네이션 캐러셀
 * 태블릿: 2개 카드 (small) — 페이지네이션 캐러셀
 * 모바일: 가로 스크롤 + snap (좁으면 1개, 넓으면 2개) + 점 표시
 */
export default function BestPostCarousel({ posts }: BestPostCarouselProps) {
  const isMobile = useIsMobile(); // < 768px
  const isTablet = useIsMobile("lg"); // < 1024px

  if (isMobile) {
    return <MobileBestPostScroll posts={posts} />;
  }

  const breakpoint: Breakpoint = isTablet ? "tablet" : "desktop";

  return (
    <DesktopBestPostCarousel
      key={breakpoint}
      posts={posts}
      breakpoint={breakpoint}
    />
  );
}

// ─── 모바일: 가로 스크롤 + snap + 점 표시 ────────────────────

/** 480px 이상이면 2개, 미만이면 1개 */
function useCardsPerView() {
  const [cardsPerView, setCardsPerView] = useState(() =>
    typeof window !== "undefined" && window.innerWidth >= 480 ? 2 : 1,
  );

  useEffect(() => {
    const check = () => setCardsPerView(window.innerWidth >= 480 ? 2 : 1);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return cardsPerView;
}

function MobileBestPostScroll({ posts }: { posts: BestPost[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardsPerView = useCardsPerView();
  const totalPages = Math.ceil(posts.length / cardsPerView);
  const [currentPage, setCurrentPage] = useState(0);

  // 스크롤 위치로 현재 페이지 계산
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return;
    const page = Math.round(el.scrollLeft / el.clientWidth);
    setCurrentPage(Math.min(page, totalPages - 1));
  }, [totalPages]);

  // 점 클릭 시 해당 페이지로 스크롤
  const scrollToPage = useCallback((page: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: page * el.clientWidth, behavior: "smooth" });
  }, []);

  // 카드 너비: 2개일 때 50%-gap/2, 1개일 때 100%
  const cardWidth = cardsPerView === 2 ? "calc((100% - 12px) / 2)" : "100%";

  return (
    <section className="bg-background-secondary min-w-0 rounded-xl p-6">
      {/* 헤더 */}
      <h2 className="text-2lg-b text-color-primary mb-6">베스트 게시글</h2>

      {/* 가로 스크롤 영역: w-full min-w-0으로 부모 너비 고정 → 2개일 때도 overflow 발생 */}
      <style>{`[data-best-scroll]::-webkit-scrollbar { display: none; }`}</style>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        data-best-scroll=""
        className="flex w-full min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/boards/${post.id}`}
            className="flex-shrink-0 snap-start"
            style={{ width: cardWidth }}
          >
            <PostCard
              state="best"
              size="small"
              title={post.title}
              content={post.content}
              author={post.author}
              date={post.date}
              likeCount={post.likeCount}
              imageUrl={post.imageUrl}
              fullWidth
            />
          </Link>
        ))}
      </div>

      {/* 캐러셀 점 */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <CarouselDots
            total={totalPages}
            current={currentPage}
            onPageChange={scrollToPage}
          />
        </div>
      )}
    </section>
  );
}

// ─── 태블릿/데스크톱: 페이지네이션 캐러셀 ───────────────────

function DesktopBestPostCarousel({
  posts,
  breakpoint,
}: {
  posts: BestPost[];
  breakpoint: Breakpoint;
}) {
  const { cardsPerPage, cardSize, titleClass } = CAROUSEL_CONFIG[breakpoint];

  const totalPages = Math.ceil(posts.length / cardsPerPage);
  const maxPage = Math.max(0, totalPages - 1);

  const [currentPage, setCurrentPage] = useState(0);

  const startIndex = currentPage * cardsPerPage;
  const visiblePosts = posts.slice(startIndex, startIndex + cardsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(maxPage, prev + 1));

  return (
    <section className="bg-background-secondary rounded-xl p-6">
      {/* 헤더 */}
      <h2 className={`${titleClass} text-color-primary mb-6`}>베스트 게시글</h2>

      {/* 카드 영역 */}
      <div className="flex justify-center gap-3">
        {visiblePosts.map((post) => (
          <Link key={post.id} to={`/boards/${post.id}`} className="flex-none">
            <PostCard
              state="best"
              size={cardSize}
              title={post.title}
              content={post.content}
              author={post.author}
              date={post.date}
              likeCount={post.likeCount}
              imageUrl={post.imageUrl}
            />
          </Link>
        ))}
      </div>

      {/* 컨트롤 영역 */}
      {totalPages > 1 && (
        <div className="relative mt-6 flex items-center justify-center">
          <CarouselDots
            total={totalPages}
            current={currentPage}
            onPageChange={setCurrentPage}
          />
          <div className="absolute right-0">
            <CarouselArrows
              onPrev={handlePrev}
              onNext={handleNext}
              disablePrev={currentPage === 0}
              disableNext={currentPage === maxPage}
            />
          </div>
        </div>
      )}
    </section>
  );
}
