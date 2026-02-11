// ========================================
// Article API
// Swagger: Article
// 게시글 CRUD + 좋아요 API & React Query 훅
// ========================================

import { BASE_URL } from "./config";
import { fetchClient } from "@/lib/fetchClient";
import {
  useQuery,
  useInfiniteQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type {
  ArticleListResponse,
  ArticleListParams,
  ArticleDetail,
  ArticleCreateRequest,
  ArticleUpdateRequest,
  ArticleCreateResponse,
  ArticleDeleteResponse,
} from "@/types/article";

// ─── API 함수 ───────────────────────────────────────────────

/** 게시글 목록 조회 */
export async function getArticles(
  params: ArticleListParams = {},
): Promise<ArticleListResponse> {
  const { page = 1, pageSize = 10, orderBy = "recent", keyword } = params;

  const url = new URL(`${BASE_URL}/articles`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(pageSize));
  url.searchParams.set("orderBy", orderBy);
  if (keyword) {
    url.searchParams.set("keyword", keyword);
  }

  return fetchClient(url.toString(), {
    method: "GET",
  });
}

/** 게시글 상세 조회 */
export async function getArticle(articleId: number): Promise<ArticleDetail> {
  return fetchClient(`${BASE_URL}/articles/${articleId}`, {
    method: "GET",
  });
}

/** 게시글 생성 */
export async function createArticle(
  body: ArticleCreateRequest,
): Promise<ArticleCreateResponse> {
  return fetchClient(`${BASE_URL}/articles`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** 게시글 수정 */
export async function updateArticle(
  articleId: number,
  body: ArticleUpdateRequest,
): Promise<ArticleDetail> {
  return fetchClient(`${BASE_URL}/articles/${articleId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

/** 게시글 삭제 */
export async function deleteArticle(
  articleId: number,
): Promise<ArticleDeleteResponse> {
  return fetchClient(`${BASE_URL}/articles/${articleId}`, {
    method: "DELETE",
  });
}

/** 게시글 좋아요 */
export async function likeArticle(articleId: number): Promise<ArticleDetail> {
  return fetchClient(`${BASE_URL}/articles/${articleId}/like`, {
    method: "POST",
  });
}

/** 게시글 좋아요 취소 */
export async function unlikeArticle(articleId: number): Promise<ArticleDetail> {
  return fetchClient(`${BASE_URL}/articles/${articleId}/like`, {
    method: "DELETE",
  });
}

// ─── React Query 훅 ────────────────────────────────────────

export function useArticles(params: ArticleListParams = {}) {
  return useQuery<ArticleListResponse>({
    queryKey: ["articles", params],
    queryFn: () => getArticles(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // 1분
    enabled: options?.enabled,
  });
}

/**
 * 게시글 목록 무한 스크롤 훅 (모바일용)
 *
 * - useArticles와 동일 API, 페이지 누적
 * - effect 내 setState 없이 데이터 사용
 */
export function useInfiniteArticles(
  params: {
    pageSize: number;
    orderBy: ArticleListParams["orderBy"];
    keyword?: string;
  },
  options?: { enabled?: boolean },
) {
  const { pageSize, orderBy, keyword } = params;
  return useInfiniteQuery({
    queryKey: ["articles", "infinite", { pageSize, orderBy, keyword }],
    queryFn: ({ pageParam }) =>
      getArticles({ page: pageParam as number, pageSize, orderBy, keyword }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.length * pageSize;
      return loaded < lastPage.totalCount ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 60,
    enabled: options?.enabled,
  });
}

export function useBestArticles(pageSize: number = 5) {
  return useSuspenseQuery<ArticleListResponse>({
    queryKey: ["articles", "best", pageSize],
    queryFn: () => getArticles({ page: 1, pageSize, orderBy: "like" }),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

export function useArticle(articleId: number) {
  return useSuspenseQuery<ArticleDetail>({
    queryKey: ["article", articleId],
    queryFn: () => getArticle(articleId),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useUpdateArticle(articleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ArticleUpdateRequest) => updateArticle(articleId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useToggleLike(articleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isCurrentlyLiked: boolean) =>
      isCurrentlyLiked ? unlikeArticle(articleId) : likeArticle(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}
