import { Link } from "react-router-dom";
import PostCard from "../PostCard/PostCard";
import type { ArticleSummary } from "@/types/article";
import { formatDate } from "@/utils/format";

interface BoardListGridProps {
  articles: ArticleSummary[];
  gridClass: string;
  cardSize: "small" | "large";
  fullWidth: boolean;
}

/**
 * 게시글 목록 그리드 (PostCard 링크 목록)
 */
export default function BoardListGrid({
  articles,
  gridClass,
  cardSize,
  fullWidth,
}: BoardListGridProps) {
  return (
    <div className={gridClass}>
      {articles.map((article) => (
        <Link key={article.id} to={`/boards/${article.id}`}>
          <PostCard
            state="default"
            size={cardSize}
            title={article.title}
            content={article.content ?? ""}
            author={article.writer.nickname}
            date={formatDate(article.createdAt)}
            likeCount={article.likeCount}
            imageUrl={article.image ?? undefined}
            fullWidth={fullWidth}
          />
        </Link>
      ))}
    </div>
  );
}
