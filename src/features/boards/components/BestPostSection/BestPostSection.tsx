import { useBestArticles } from "@/api/article";
import type { ArticleSummary } from "@/types/article";
import { formatDate } from "@/utils/format";
import BestPostCarousel from "../BestPostCarousel";

function toBestPost(article: ArticleSummary) {
  return {
    id: article.id,
    title: article.title,
    content: "",
    author: article.writer.nickname,
    date: formatDate(article.createdAt),
    likeCount: article.likeCount,
    imageUrl: article.image ?? undefined,
  };
}

/**
 * 베스트 게시글 캐러셀 섹션 (Suspense 내부에서 사용)
 */
export default function BestPostSection() {
  const { data } = useBestArticles(15);
  const bestPosts = data.list.map(toBestPost);
  return <BestPostCarousel posts={bestPosts} />;
}
