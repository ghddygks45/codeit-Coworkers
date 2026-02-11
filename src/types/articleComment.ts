// ========================================
// ArticleComment Types (게시글 댓글)
// Swagger: ArticleComment
// ========================================

// 댓글 작성자
export interface CommentWriter {
  image: string | null;
  nickname: string;
  id: number;
}

// 댓글 아이템
export interface ArticleComment {
  writer: CommentWriter;
  updatedAt: string;
  createdAt: string;
  content: string;
  id: number;
}

// 댓글 목록 응답 (커서 기반 페이지네이션)
export interface ArticleCommentListResponse {
  nextCursor: number | null;
  list: ArticleComment[];
}

// 댓글 목록 조회 파라미터
export interface ArticleCommentListParams {
  articleId: number;
  limit: number;
  cursor?: number;
}
