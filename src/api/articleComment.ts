// ========================================
// ArticleComment API
// Swagger: ArticleComment
// 게시글 댓글 CRUD & React Query 훅
// ========================================

import { BASE_URL } from "./config";
import { fetchClient } from "@/lib/fetchClient";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  ArticleComment,
  ArticleCommentListResponse,
} from "@/types/articleComment";

// ─── API 함수 ───────────────────────────────────────────────

/** 게시글 댓글 목록 조회 (커서 기반 페이지네이션) */
export async function getArticleComments(
  articleId: number,
  limit: number = 10,
  cursor?: number,
): Promise<ArticleCommentListResponse> {
  const url = new URL(`${BASE_URL}/articles/${articleId}/comments`);
  url.searchParams.set("limit", String(limit));
  if (cursor) {
    url.searchParams.set("cursor", String(cursor));
  }

  return fetchClient(url.toString(), {
    method: "GET",
  });
}

/** 게시글 댓글 작성 */
export async function createArticleComment(
  articleId: number,
  content: string,
): Promise<ArticleComment> {
  return fetchClient(`${BASE_URL}/articles/${articleId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

/** 댓글 수정 */
export async function updateArticleComment(
  commentId: number,
  content: string,
): Promise<ArticleComment> {
  return fetchClient(`${BASE_URL}/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify({ content }),
  });
}

/** 댓글 삭제 */
export async function deleteArticleComment(commentId: number): Promise<void> {
  return fetchClient(`${BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
  });
}

// ─── React Query 훅 ────────────────────────────────────────

/**
 * 게시글 댓글 목록 조회 훅 (무한 스크롤 / 더보기)
 *
 * - 커서 기반 페이지네이션 (useInfiniteQuery)
 * - getNextPageParam으로 다음 커서 자동 추출
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useArticleComments(articleId);
 * const allComments = data?.pages.flatMap(page => page.list) ?? [];
 */
export function useArticleComments(articleId: number, limit: number = 10) {
  return useInfiniteQuery<ArticleCommentListResponse>({
    queryKey: ["articleComments", articleId],
    queryFn: ({ pageParam }) =>
      getArticleComments(articleId, limit, pageParam as number | undefined),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 30, // 30초
  });
}

/**
 * 게시글 댓글 작성 mutation
 */
export function useCreateArticleComment(articleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createArticleComment(articleId, content),
    onSuccess: () => {
      // 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["articleComments", articleId],
      });
      // 게시글 상세의 commentCount도 갱신
      queryClient.invalidateQueries({
        queryKey: ["article", articleId],
      });
    },
  });
}

/**
 * 댓글 수정 mutation
 */
export function useUpdateArticleComment(articleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => updateArticleComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["articleComments", articleId],
      });
    },
  });
}

/**
 * 댓글 삭제 mutation
 */
export function useDeleteArticleComment(articleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteArticleComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["articleComments", articleId],
      });
      queryClient.invalidateQueries({
        queryKey: ["article", articleId],
      });
    },
  });
}
