import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { FetchBoundary } from "@/providers/boundary";
import { useArticle, useCreateArticle, useUpdateArticle } from "@/api/article";
import TitleInput from "@/features/Boards/components/TitleInput/TitleInput";
import ContentInput from "@/features/Boards/components/ContentInput/ContentInput";
import ImageUpload from "@/features/Boards/components/ImageUpload/ImageUpload";

/**
 * 게시글 쓰기/수정 페이지
 *
 * - /boards/write → 새 글 작성
 * - /boards/write?edit=123 → 기존 글 수정 (기존 데이터 불러와서 채움)
 */
export default function BoardWrite() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  if (editId) {
    return (
      <FetchBoundary loadingFallback={<BoardWriteSkeleton />}>
        <BoardEditForm articleId={Number(editId)} />
      </FetchBoundary>
    );
  }

  return <BoardCreateForm />;
}

// ─── 공통 레이아웃 ──────────────────────────────────────────

interface BoardWriteLayoutProps {
  pageTitle: string;
  title: string;
  content: string;
  imageUrl?: string;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onImageChange: (v: string | undefined) => void;
  onSubmit: () => void;
  submitLabel: string;
  isPending: boolean;
  isValid: boolean;
}

function BoardWriteLayout({
  pageTitle,
  title,
  content,
  imageUrl,
  onTitleChange,
  onContentChange,
  onImageChange,
  onSubmit,
  submitLabel,
  isPending,
  isValid,
}: BoardWriteLayoutProps) {
  const isMobile = useIsMobile();
  const isTabletOrSmaller = useIsMobile("lg");
  const isTablet = !isMobile && isTabletOrSmaller;

  const cardWidth = isMobile ? "w-full" : isTablet ? "w-[620px]" : "w-[900px]";
  const cardPadding = isMobile
    ? "px-4 pt-10 pb-6"
    : isTablet
      ? "px-10 pt-16 pb-8"
      : "px-[60px] pt-[84px] pb-10";
  const titleBottomPadding = isMobile ? "mb-8" : "mb-10";

  return (
    <div className="bg-background-secondary min-h-screen pb-20">
      <div
        className={`${isMobile ? "px-4 pt-6" : isTablet ? "mx-auto pt-10" : "ml-[184px] pt-14"}`}
      >
        <div className={`relative ${isMobile || isTablet ? "" : "w-fit"}`}>
          <article
            className={`bg-background-primary rounded-[20px] ${cardWidth} ${cardPadding} ${isTablet ? "mx-auto" : ""}`}
          >
            <h1
              className={`text-xl-b text-color-primary ${titleBottomPadding}`}
            >
              {pageTitle}
            </h1>

            <TitleInput value={title} onChange={onTitleChange} />
            <ContentInput value={content} onChange={onContentChange} />
            <ImageUpload imageUrl={imageUrl} onImageChange={onImageChange} />

            <button
              type="button"
              onClick={onSubmit}
              disabled={!isValid || isPending}
              className={`w-full rounded-xl py-3.5 font-semibold text-white transition-colors ${
                isValid && !isPending
                  ? "bg-brand-primary hover:bg-interaction-hover"
                  : "bg-interaction-inactive cursor-not-allowed"
              }`}
            >
              {isPending
                ? `${submitLabel.replace("하기", " 중...")}`
                : submitLabel}
            </button>
          </article>
        </div>
      </div>
    </div>
  );
}

// ─── 생성 모드 ──────────────────────────────────────────────

function BoardCreateForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const createMutation = useCreateArticle();

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid || createMutation.isPending) return;
    createMutation.mutate(
      { title: title.trim(), content: content.trim(), image: imageUrl },
      { onSuccess: (data) => navigate(`/boards/${data.id}`) },
    );
  };

  return (
    <BoardWriteLayout
      pageTitle="게시글 쓰기"
      title={title}
      content={content}
      imageUrl={imageUrl}
      onTitleChange={setTitle}
      onContentChange={setContent}
      onImageChange={setImageUrl}
      onSubmit={handleSubmit}
      submitLabel="등록하기"
      isPending={createMutation.isPending}
      isValid={isValid}
    />
  );
}

// ─── 수정 모드 (Suspense 내부에서 렌더링됨) ────────────────

function BoardEditForm({ articleId }: { articleId: number }) {
  const navigate = useNavigate();

  // 기존 게시글 데이터 (useSuspenseQuery → 마운트 시점에 이미 데이터 존재)
  const { data: existingArticle } = useArticle(articleId);
  const updateMutation = useUpdateArticle(articleId);

  // 폼 상태: Suspense로 데이터가 준비된 뒤 마운트되므로 초기값을 바로 사용
  const [title, setTitle] = useState(() => existingArticle.title);
  const [content, setContent] = useState(() => existingArticle.content);
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    () => existingArticle.image ?? undefined,
  );

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid || updateMutation.isPending) return;
    // 이미지 삭제 시 undefined는 JSON에 포함되지 않으므로, null을 명시적으로 전달
    updateMutation.mutate(
      {
        title: title.trim(),
        content: content.trim(),
        image: imageUrl ?? null,
      },
      { onSuccess: () => navigate(`/boards/${articleId}`) },
    );
  };

  return (
    <BoardWriteLayout
      pageTitle="게시글 수정"
      title={title}
      content={content}
      imageUrl={imageUrl}
      onTitleChange={setTitle}
      onContentChange={setContent}
      onImageChange={setImageUrl}
      onSubmit={handleSubmit}
      submitLabel="수정하기"
      isPending={updateMutation.isPending}
      isValid={isValid}
    />
  );
}

// ─── 로딩 스켈레톤 ──────────────────────────────────────────

function BoardWriteSkeleton() {
  return (
    <div className="bg-background-secondary min-h-screen pb-20">
      <div className="ml-[184px] pt-14">
        <div className="bg-background-primary h-[600px] w-[900px] animate-pulse rounded-[20px]" />
      </div>
    </div>
  );
}
