import { useState } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useUser } from "@/api/user";
import {
  useArticleComments,
  useCreateArticleComment,
} from "@/api/articleComment";
import ProfileIcon from "@/assets/icon.svg";
import EnterIcon from "@/features/boards/assets/enter.svg";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  articleId: number;
  commentCount: number;
}

/**
 * 게시글 상세 페이지 댓글 섹션 (입력 + 목록 + 더보기)
 */
export default function CommentSection({
  articleId,
  commentCount,
}: CommentSectionProps) {
  const isMobile = useIsMobile();
  const metaSize = isMobile ? "text-xs" : "text-sm";
  const commentLabelSize = isMobile ? "text-sm" : "text-lg";
  const commentTextSize = isMobile ? "text-[13px]" : "text-sm";
  const commentGap = isMobile ? "py-3" : "py-5";

  const [commentInput, setCommentInput] = useState("");
  const { data: currentUser } = useUser();
  const {
    data: commentData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useArticleComments(articleId);
  const allComments = commentData?.pages.flatMap((page) => page.list) ?? [];
  const createComment = useCreateArticleComment(articleId);

  const handleAddComment = () => {
    if (!commentInput.trim() || createComment.isPending) return;
    createComment.mutate(commentInput.trim(), {
      onSuccess: () => setCommentInput(""),
    });
  };

  return (
    <section className="mt-10">
      <h2 className={`${commentLabelSize} font-bold`}>
        <span className="text-slate-800">댓글 </span>
        <span className="text-brand-primary">{commentCount}</span>
      </h2>

      <div className="mt-4 flex items-center gap-4 border-y border-slate-200 py-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-200">
          {currentUser?.image ? (
            <img
              src={currentUser.image}
              alt={currentUser.nickname}
              className="h-8 w-8 object-cover"
            />
          ) : (
            <ProfileIcon className="h-5 w-5" />
          )}
        </div>
        <div className="flex flex-1 items-center">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            placeholder="댓글을 달아주세요"
            className={`${metaSize} flex-1 bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none`}
          />
          <button
            type="button"
            onClick={handleAddComment}
            disabled={createComment.isPending}
            className="flex-shrink-0 disabled:opacity-50"
          >
            <EnterIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {allComments.length === 0 ? (
        <div className="mt-5 border-t border-slate-200 pt-9">
          <div className="flex h-[120px] items-center justify-center rounded-lg bg-slate-50">
            <p className={`${metaSize} text-slate-400`}>
              아직 작성된 댓글이 없습니다.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          {allComments.map((comment, index) => (
            <div key={comment.id}>
              {index > 0 && <div className="border-t border-slate-200" />}
              <CommentItem
                comment={comment}
                articleId={articleId}
                metaSize={metaSize}
                commentTextSize={commentTextSize}
                commentGap={commentGap}
              />
            </div>
          ))}
          {hasNextPage && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="text-md-m text-brand-primary hover:text-interaction-hover transition-colors"
              >
                {isFetchingNextPage ? "불러오는 중..." : "댓글 더보기"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
