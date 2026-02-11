import HeartIcon from "@/assets/heart.svg";
import BestIcon from "@/assets/best.svg";
import { formatLikeCount } from "@/utils/format";

export interface PostCardProps {
  /**
   * 카드 상태
   * - 'best': 베스트 게시글 (인기 칩 표시)
   * - 'default': 일반 게시글
   */
  state: "best" | "default";

  /**
   * 카드 크기
   * - 'large': 큰 카드
   * - 'small': 작은 카드
   */
  size: "large" | "small";

  /**
   * 게시글 제목
   */
  title: string;

  /**
   * 게시글 본문 (미리보기)
   */
  content: string;

  /**
   * 작성자 이름
   */
  author: string;

  /**
   * 작성 날짜 (예: "2024. 07. 25")
   */
  date: string;

  /**
   * 좋아요 수
   */
  likeCount: number;

  /**
   * 이미지 URL (있으면 이미지 표시)
   */
  imageUrl?: string;

  /**
   * 전체 너비 사용 여부 (기본: false)
   * - true: w-full (부모 컨테이너 너비에 맞춤)
   * - false: 고정 크기 사용
   */
  fullWidth?: boolean;
}

// 카드 크기 스타일 맵 (베스트 large는 컨테이너에 3장이 들어가도록 330px)
const SIZE_MAP = {
  best: {
    large: "w-[330px] h-[198px] pt-6 pb-7 px-5",
    small: "w-[304px] h-[177px] p-5",
  },
  default: {
    large: "w-[523px] h-[156px] py-5 px-6",
    small: "w-[340px] h-[140px] p-4",
  },
} as const;

/**
 * PostCard 컴포넌트
 *
 * @description
 * 자유게시판 게시글 카드 컴포넌트입니다.
 * state(best/default)와 size(large/small) 조합으로 사용합니다.
 * imageUrl이 있으면 이미지를 표시합니다.
 */
export default function PostCard({
  state,
  size,
  title,
  content,
  author,
  date,
  likeCount,
  imageUrl,
  fullWidth = false,
}: PostCardProps) {
  // 카드 크기 스타일
  const cardSizeStyles = SIZE_MAP[state][size];

  // fullWidth가 true면 w-full 사용, false면 고정 크기 유지
  const widthClass = fullWidth
    ? cardSizeStyles.replace(/w-\[\d+px\]/, "w-full")
    : cardSizeStyles;

  // 이미지 크기
  const imageSize =
    state === "best"
      ? size === "large"
        ? 60
        : 48
      : size === "large"
        ? 88
        : 80;

  // 제목 스타일
  const titleClass = size === "large" ? "text-2lg-b" : "text-lg-b";

  // 본문 스타일
  const contentStyle =
    size === "large"
      ? { fontSize: "14px", lineHeight: "20px" }
      : { fontSize: "13px", lineHeight: "18px" };

  // 작성자 스타일
  const authorClass =
    state === "best" && size === "large" ? "text-md-m" : "text-sm-m";

  // 하트 개수 스타일
  const likeCountClass =
    state === "best" && size === "large" ? "text-md-r" : "text-sm-m";

  // 칩과 콘텐츠 사이 간격
  const chipGap = size === "large" ? "gap-4" : "gap-3";

  // 콘텐츠와 이름행 사이 간격
  const contentAuthorGap = state === "best" ? "" : "gap-3";

  // Best 카드 레이아웃
  if (state === "best") {
    return (
      <article
        className={`bg-background-inverse flex flex-col ${chipGap} rounded-[20px] ${widthClass}`}
      >
        {/* 인기 칩 */}
        <div className="bg-background-secondary flex h-[30px] w-[72px] items-center justify-center gap-1 rounded-xl">
          <BestIcon className="text-brand-primary h-[18px] w-[18px]" />
          <span className="text-md-b text-brand-primary">인기</span>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex flex-1 flex-col justify-between">
          {/* 제목 + 본문 + 이미지 */}
          <div className="flex items-start gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <h3 className={`${titleClass} text-color-primary truncate`}>
                {title}
              </h3>
              <p
                className="text-color-default line-clamp-2"
                style={contentStyle}
              >
                {content}
              </p>
            </div>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="게시글 이미지"
                className="flex-shrink-0 rounded-lg object-cover"
                style={{ width: imageSize, height: imageSize }}
              />
            )}
          </div>

          {/* 작성자 행 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`${authorClass} text-color-primary`}>
                {author}
              </span>
              <div className="bg-color-secondary h-3 w-px" />
              <span className={`${authorClass} text-interaction-inactive`}>
                {date}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <HeartIcon className="text-interaction-inactive h-4 w-[18px]" />
              <span className={`${likeCountClass} text-interaction-inactive`}>
                {formatLikeCount(likeCount)}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Default 카드 레이아웃
  return (
    <article
      className={`bg-background-inverse flex flex-col rounded-[20px] ${widthClass} ${contentAuthorGap}`}
    >
      {/* 제목 + 본문 + 이미지 */}
      <div className="flex flex-1 items-start gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h3 className={`${titleClass} text-color-primary truncate`}>
            {title}
          </h3>
          <p className="text-color-default line-clamp-2" style={contentStyle}>
            {content}
          </p>
        </div>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="게시글 이미지"
            className="flex-shrink-0 rounded-lg object-cover"
            style={{ width: imageSize, height: imageSize }}
          />
        )}
      </div>

      {/* 작성자 행 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`${authorClass} text-color-primary`}>{author}</span>
          <div className="bg-color-secondary h-3 w-px" />
          <span className={`${authorClass} text-interaction-inactive`}>
            {date}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <HeartIcon className="text-interaction-inactive h-4 w-[18px]" />
          <span className={`${likeCountClass} text-interaction-inactive`}>
            {formatLikeCount(likeCount)}
          </span>
        </div>
      </div>
    </article>
  );
}
