// ========================================
// Article Types (게시글)
// Swagger: Article
// ========================================

// 게시글 작성자
export interface ArticleWriter {
  nickname: string;
  id: number;
}

// 게시글 목록 아이템 (GET /articles 응답의 list 항목)
export interface ArticleSummary {
  updatedAt: string;
  createdAt: string;
  likeCount: number;
  writer: ArticleWriter;
  image: string | null;
  title: string;
  id: number;
}

// 게시글 상세 (GET /articles/:articleId 응답)
export interface ArticleDetail extends ArticleSummary {
  commentCount: number;
  isLiked: boolean;
  content: string;
}

// 게시글 목록 응답 (GET /articles)
export interface ArticleListResponse {
  totalCount: number;
  list: ArticleSummary[];
}

// 게시글 생성/수정 요청 바디
export interface ArticleCreateRequest {
  image?: string;
  content: string;
  title: string;
}

/** 게시글 수정 시 이미지 삭제는 image: null 로 전달 */
export type ArticleUpdateRequest = Partial<
  Omit<ArticleCreateRequest, "image">
> & { image?: string | null };

// 게시글 생성 응답
export interface ArticleCreateResponse {
  updatedAt: string;
  createdAt: string;
  likeCount: number;
  writer: ArticleWriter;
  image: string | null;
  title: string;
  id: number;
}

// 게시글 삭제 응답
export interface ArticleDeleteResponse {
  id: number;
}

// 게시글 목록 조회 파라미터
export interface ArticleListParams {
  page?: number;
  pageSize?: number;
  orderBy?: "recent" | "like";
  keyword?: string;
}
