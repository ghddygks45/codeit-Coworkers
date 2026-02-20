import type { RefObject } from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useArticles, useInfiniteArticles } from "@/api/article";
import type { ArticleSummary } from "@/types/article";
import { useBoardListStore } from "@/stores/useBoardListStore";

export interface UseBoardListReturn {
  keyword: string;
  setKeyword: (v: string) => void;
  debouncedKeyword: string;
  orderBy: "recent" | "like";
  page: number;
  setPage: (v: number) => void;
  data: { list: ArticleSummary[]; totalCount: number } | undefined;
  isLoading: boolean;
  isFetching: boolean;
  displayArticles: ArticleSummary[];
  observerRef: RefObject<HTMLDivElement | null>;
  hasNextPage: boolean | undefined;
  isMobile: boolean;
  isTablet: boolean;
  pageSize: number;
  gridClass: string;
  headerMarginClass: string;
  titleClass: string;
  sectionGapClass: string;
  cardSize: "small" | "large";
  handleSortChange: (item: { label: string; value: string }) => void;
}

export const PAGE_SIZE_DESKTOP = 10;
export const PAGE_SIZE_MOBILE = 5;

export type SortLabel = "최신순" | "좋아요 많은순";
export const SORT_MAP: Record<SortLabel, "recent" | "like"> = {
  최신순: "recent",
  "좋아요 많은순": "like",
};

export const BOARD_LIST_PAGE_SIZE = {
  desktop: PAGE_SIZE_DESKTOP,
  mobile: PAGE_SIZE_MOBILE,
} as const;

/**
 * 자유게시판 목록 상태/API 훅
 * - 데스크톱/태블릿: 페이지네이션 (useArticles)
 * - 모바일: 무한 스크롤 (useInfiniteArticles)
 */
export function useBoardList(): UseBoardListReturn {
  const isMobile = useIsMobile();
  const isTabletOrSmaller = useIsMobile("lg");
  const isTablet = !isMobile && isTabletOrSmaller;

  const { keyword, setKeyword, orderBy, setOrderBy } = useBoardListStore();
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement>(null);

  const pageSize = isMobile ? PAGE_SIZE_MOBILE : PAGE_SIZE_DESKTOP;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  const articlesQuery = useArticles(
    {
      page,
      pageSize: PAGE_SIZE_DESKTOP,
      orderBy,
      keyword: debouncedKeyword || undefined,
    },
    { enabled: !isMobile },
  );
  const infiniteQuery = useInfiniteArticles(
    {
      pageSize: PAGE_SIZE_MOBILE,
      orderBy,
      keyword: debouncedKeyword || undefined,
    },
    { enabled: isMobile },
  );

  const { data, isLoading, isFetching } = isMobile
    ? {
        data: infiniteQuery.data
          ? {
              list: infiniteQuery.data.pages.flatMap((p) => p.list),
              totalCount: infiniteQuery.data.pages[0]?.totalCount ?? 0,
            }
          : undefined,
        isLoading: infiniteQuery.isLoading,
        isFetching: infiniteQuery.isFetching,
      }
    : {
        data: articlesQuery.data,
        isLoading: articlesQuery.isLoading,
        isFetching: articlesQuery.isFetching,
      };

  const loadMore = useCallback(() => {
    if (!infiniteQuery.isFetching && infiniteQuery.hasNextPage) {
      infiniteQuery.fetchNextPage();
    }
  }, [infiniteQuery]);

  useEffect(() => {
    if (!isMobile || !observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [isMobile, loadMore]);

  const handleSortChange = useCallback(
    (item: { label: string; value: string }) => {
      const mapped = SORT_MAP[item.value as SortLabel];
      if (mapped) {
        setOrderBy(mapped);
        setPage(1);
      }
    },
    [setOrderBy],
  );

  const displayArticles: ArticleSummary[] = data?.list ?? [];

  const gridClass =
    isMobile || isTablet
      ? "flex flex-col gap-4"
      : "grid grid-cols-2 gap-x-4 gap-y-5";

  const headerMarginClass = isMobile
    ? "mt-[25px] mb-[20px]"
    : "mt-[77px] mb-[29px] lg:mt-[87px] lg:mb-[30px]";

  const titleClass = isMobile ? "text-xl-b" : "text-2xl-b";

  const sectionGapClass = isTablet ? "mt-[28px]" : "mt-[45px]";

  const cardSize: "small" | "large" = isMobile ? "small" : "large";

  return {
    keyword,
    setKeyword,
    debouncedKeyword,
    orderBy,
    page,
    setPage,
    data,
    isLoading,
    isFetching,
    displayArticles,
    observerRef,
    hasNextPage: infiniteQuery.hasNextPage,
    isMobile,
    isTablet,
    pageSize,
    gridClass,
    headerMarginClass,
    titleClass,
    sectionGapClass,
    cardSize,
    handleSortChange,
  };
}
