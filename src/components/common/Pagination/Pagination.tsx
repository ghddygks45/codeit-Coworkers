import ArrowLeftSmall from "@/assets/arrow-left-small.svg";
import ArrowRightSmall from "@/assets/arrow-right-small.svg";

interface PaginationProps {
  /** 현재 페이지 (1부터 시작) */
  currentPage: number;
  /** 전체 아이템 수 */
  totalCount: number;
  /** 페이지 당 아이템 수 */
  pageSize: number;
  /** 페이지 변경 핸들러 */
  onPageChange: (page: number) => void;
}

/**
 * 공통 Pagination 컴포넌트
 *
 * @description
 * 데스크톱/태블릿용 페이지네이션 UI.
 * 프로젝트 디자인 토큰(brand-primary, interaction 등)을 활용합니다.
 *
 * @example
 * <Pagination
 *   currentPage={1}
 *   totalCount={50}
 *   pageSize={10}
 *   onPageChange={(page) => setPage(page)}
 * />
 */
export default function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // 표시할 페이지 번호 범위 계산 (최대 5개)
  const getPageNumbers = (): number[] => {
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 현재 페이지를 중앙에 배치
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    // 끝에 닿으면 시작을 조정
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="페이지 네비게이션"
    >
      {/* 이전 버튼 */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:opacity-30"
        aria-label="이전 페이지"
      >
        <ArrowLeftSmall className="text-color-default h-4 w-4" />
      </button>

      {/* 첫 페이지 + 말줄임 */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            type="button"
            onClick={() => onPageChange(1)}
            className="text-md-m text-color-default hover:bg-background-secondary flex h-9 w-9 items-center justify-center rounded-lg"
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="text-md-r text-interaction-inactive flex h-9 w-9 items-center justify-center">
              ...
            </span>
          )}
        </>
      )}

      {/* 페이지 번호 */}
      {pageNumbers.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`text-md-m flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              isActive
                ? "bg-brand-primary text-color-inverse"
                : "text-color-default hover:bg-background-secondary"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* 말줄임 + 마지막 페이지 */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="text-md-r text-interaction-inactive flex h-9 w-9 items-center justify-center">
              ...
            </span>
          )}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className="text-md-m text-color-default hover:bg-background-secondary flex h-9 w-9 items-center justify-center rounded-lg"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 버튼 */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:opacity-30"
        aria-label="다음 페이지"
      >
        <ArrowRightSmall className="text-color-default h-4 w-4" />
      </button>
    </nav>
  );
}
