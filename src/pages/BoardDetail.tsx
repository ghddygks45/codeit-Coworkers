import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { FetchBoundary } from "@/providers/boundary";
import { useArticle, useDeleteArticle, useToggleLike } from "@/api/article";
import { useUser } from "@/api/user";
import BoardDetailSkeleton from "@/features/boards/components/BoardDetailSkeleton";
import BoardDetailArticle from "@/features/boards/components/BoardDetailArticle";
import BoardDetailFloatingLike from "@/features/boards/components/BoardDetailFloatingLike";
import ArticleDeleteModal from "@/features/boards/components/ArticleDeleteModal";

/**
 * 게시글 상세 페이지
 */
export default function BoardDetail() {
  const { articleId } = useParams<{ articleId: string }>();

  if (!articleId) return null;

  return (
    <FetchBoundary loadingFallback={<BoardDetailSkeleton />}>
      <BoardDetailContent articleId={Number(articleId)} />
    </FetchBoundary>
  );
}

// ─── 상세 콘텐츠 (Suspense 내부) ────────────────────────────

function BoardDetailContent({ articleId }: { articleId: number }) {
  const isMobile = useIsMobile();
  const isTabletOrSmaller = useIsMobile("lg");
  const isTablet = !isMobile && isTabletOrSmaller;
  const navigate = useNavigate();

  const { data: article } = useArticle(articleId);
  const { data: currentUser } = useUser();
  const deleteMutation = useDeleteArticle();
  const likeMutation = useToggleLike(articleId);

  // 삭제 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 작성자 프로필 이미지 (현재 유저 = 작성자이면 유저 이미지 사용)
  const writerImage =
    currentUser && currentUser.id === article.writer.id
      ? currentUser.image
      : null;

  // 좋아요 토글
  const handleToggleLike = () => {
    likeMutation.mutate(article.isLiked);
  };

  // 삭제 확인
  const handleDeleteConfirm = () => {
    deleteMutation.mutate(articleId, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        navigate("/boards");
      },
    });
  };

  // 케밥 메뉴 옵션
  const kebabOptions = [
    {
      label: "수정하기",
      value: "edit",
      action: () => navigate(`/boards/write?edit=${articleId}`),
    },
    {
      label: "삭제하기",
      value: "delete",
      action: () => setIsDeleteModalOpen(true),
    },
  ];

  // 반응형 스타일
  const cardWidth = isMobile ? "w-full" : isTablet ? "w-[620px]" : "w-[900px]";
  const cardPadding = isMobile
    ? "px-4 pt-10 pb-6"
    : isTablet
      ? "px-10 pt-16 pb-8"
      : "px-[60px] pt-[84px] pb-10";

  const titleSize = isMobile ? "text-lg" : "text-xl";
  const bodySize = isMobile ? "text-sm" : "text-base";
  const metaSize = isMobile ? "text-xs" : "text-sm";

  return (
    <div className="bg-background-secondary min-h-screen pb-20">
      <div
        className={`${isMobile ? "px-4 pt-6" : isTablet ? "mx-auto pt-10" : "ml-[184px] pt-14"}`}
      >
        <div className={`relative ${isMobile || isTablet ? "" : "w-fit"}`}>
          <BoardDetailArticle
            article={article}
            articleId={articleId}
            writerImage={writerImage}
            isMobile={isMobile}
            isTablet={isTablet}
            cardWidth={cardWidth}
            cardPadding={cardPadding}
            titleSize={titleSize}
            bodySize={bodySize}
            metaSize={metaSize}
            kebabOptions={kebabOptions}
            onToggleLike={handleToggleLike}
            isLikePending={likeMutation.isPending}
          />

          {!isMobile && !isTablet && (
            <BoardDetailFloatingLike
              isLiked={article.isLiked}
              likeCount={article.likeCount}
              onToggleLike={handleToggleLike}
              isPending={likeMutation.isPending}
            />
          )}
        </div>
      </div>

      <ArticleDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
