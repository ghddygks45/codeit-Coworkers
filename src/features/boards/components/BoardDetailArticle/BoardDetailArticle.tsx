import Dropdown from "@/components/common/Dropdown/Dropdown";
import ProfileIcon from "@/assets/icon.svg";
import HeartIcon from "@/assets/heart.svg";
import HeartFillIcon from "@/assets/heart-fill.svg";
import { formatDate, formatLikeCount } from "@/utils/format";
import CommentSection from "../CommentSection";
import type { ArticleDetail } from "@/types/article";

interface BoardDetailArticleProps {
  article: ArticleDetail;
  articleId: number;
  writerImage: string | null;
  isMobile: boolean;
  isTablet: boolean;
  cardWidth: string;
  cardPadding: string;
  titleSize: string;
  bodySize: string;
  metaSize: string;
  kebabOptions: { label: string; value: string; action: () => void }[];
  onToggleLike: () => void;
  isLikePending: boolean;
}

/**
 * 게시글 상세 메인 카드 (제목, 프로필, 본문, 이미지, 좋아요, 댓글 섹션)
 */
export default function BoardDetailArticle({
  article,
  articleId,
  writerImage,
  isMobile,
  isTablet,
  cardWidth,
  cardPadding,
  titleSize,
  bodySize,
  metaSize,
  kebabOptions,
  onToggleLike,
  isLikePending,
}: BoardDetailArticleProps) {
  return (
    <article
      className={`bg-background-primary rounded-[20px] ${cardWidth} ${cardPadding} ${isTablet ? "mx-auto" : ""}`}
    >
      <div className="flex items-start justify-between">
        <h1 className={`${titleSize} font-bold text-slate-800`}>
          {article.title}
        </h1>
        <Dropdown
          trigger="kebab"
          options={kebabOptions}
          keepSelected={false}
          listAlign="center"
        />
      </div>

      <div className="mt-4 flex items-center gap-2 border-b border-slate-200 pb-6">
        <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded bg-slate-200">
          {writerImage ? (
            <img
              src={writerImage}
              alt={article.writer.nickname}
              className="h-6 w-6 object-cover"
            />
          ) : (
            <ProfileIcon className="h-4 w-4" />
          )}
        </div>
        <span className={`${metaSize} font-medium text-slate-800`}>
          {article.writer.nickname}
        </span>
        <div className="h-3 w-px bg-slate-700" />
        <span className={`${metaSize} font-medium text-slate-400`}>
          {formatDate(article.createdAt)}
        </span>
      </div>

      <div className="mt-6">
        <p
          className={`${bodySize} leading-6 whitespace-pre-line text-slate-800`}
        >
          {article.content}
        </p>
      </div>

      {article.image && (
        <div className="mt-6">
          <img
            src={article.image}
            alt="게시글 이미지"
            className="h-[200px] w-[200px] rounded-xl object-cover"
          />
        </div>
      )}

      {(isMobile || isTablet) && (
        <div className="mt-10 flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={onToggleLike}
            className="flex items-center gap-1"
            disabled={isLikePending}
          >
            {article.isLiked ? (
              <HeartFillIcon className="text-status-danger h-4 w-[18px]" />
            ) : (
              <HeartIcon className="h-4 w-[18px] text-slate-400" />
            )}
            <span className={`${metaSize} text-slate-400`}>
              {formatLikeCount(article.likeCount)}
            </span>
          </button>
        </div>
      )}

      <CommentSection
        articleId={articleId}
        commentCount={article.commentCount}
      />
    </article>
  );
}
