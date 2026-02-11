import { useState } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/useMediaQuery";
import PostCard from "../PostCard";
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
  /** 더보기 클릭 핸들러 */
  onMoreClick?: () => void;
}

// Breakpoint별 설정
type Breakpoint = "mobile" | "tablet" | "desktop";

const CAROUSEL_CONFIG: Record<
  Breakpoint,
  { cardsPerPage: number; cardSize: "small" | "large"; titleClass: string }
> = {
  mobile: { cardsPerPage: 1, cardSize: "small", titleClass: "text-2lg-b" },
  tablet: { cardsPerPage: 2, cardSize: "small", titleClass: "text-xl-b" },
  desktop: { cardsPerPage: 3, cardSize: "large", titleClass: "text-xl-b" },
};

/**
 * 베스트 게시글 캐러셀 컴포넌트
 *
 * @description
 * 데스크톱: 3개 카드 (large)
 * 태블릿: 2개 카드 (small)
 * 모바일: 1개 카드 (small)
 *
 * breakpoint 변경 시 key가 바뀌어 컴포넌트가 리마운트되며,
 * 이를 통해 currentPage가 자동으로 0으로 초기화됩니다.
 */
export default function BestPostCarousel({
  posts,
  onMoreClick,
}: BestPostCarouselProps) {
  const isMobile = useIsMobile(); // < 768px
  const isTablet = useIsMobile("lg"); // < 1024px

  // breakpoint 식별 - 변경 시 컴포넌트 리마운트
  const breakpoint: Breakpoint = isMobile
    ? "mobile"
    : isTablet
      ? "tablet"
      : "desktop";

  return (
    <BestPostCarouselInner
      key={breakpoint}
      posts={posts}
      onMoreClick={onMoreClick}
      breakpoint={breakpoint}
    />
  );
}

/** 실제 캐러셀 로직을 담은 내부 컴포넌트 */
function BestPostCarouselInner({
  posts,
  onMoreClick,
  breakpoint,
}: BestPostCarouselProps & { breakpoint: Breakpoint }) {
  const { cardsPerPage, cardSize, titleClass } = CAROUSEL_CONFIG[breakpoint];

  // 총 페이지 수
  const totalPages = Math.ceil(posts.length / cardsPerPage);
  const maxPage = Math.max(0, totalPages - 1);

  // 현재 페이지 상태 (breakpoint 변경 시 리마운트되어 0으로 초기화됨)
  const [currentPage, setCurrentPage] = useState(0);

  // 현재 페이지에 표시할 카드들
  const startIndex = currentPage * cardsPerPage;
  const visiblePosts = posts.slice(startIndex, startIndex + cardsPerPage);

  // 페이지 이동
  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(maxPage, prev + 1));
  };

  return (
    <section className="bg-background-secondary rounded-xl p-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className={`${titleClass} text-color-primary`}>베스트 게시글</h2>
        <button
          type="button"
          onClick={onMoreClick}
          className="text-md-r flex items-center gap-1 text-[#94A3B8] transition-colors hover:text-[#64748B]"
        >
          더보기
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="#475569"
              strokeWidth="1.54"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* 카드 영역 - 클릭 시 해당 게시글 상세로 이동 (데스크 3장/태블릿 2장 세트 가운데 정렬) */}
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

      {/* 컨트롤 영역 (점: 가운데, 화살표: 오른쪽 끝) */}
      {totalPages > 1 && (
        <div className="relative mt-6 flex items-center justify-center">
          {/* 점 (가운데) */}
          <CarouselDots
            total={totalPages}
            current={currentPage}
            onPageChange={setCurrentPage}
          />

          {/* 화살표 (오른쪽 끝) */}
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
