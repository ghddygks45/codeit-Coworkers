import HeartIcon from "@/assets/heart.svg";
import HeartFillIcon from "@/assets/heart-fill.svg";
import { formatLikeCount } from "@/utils/format";

interface BoardDetailFloatingLikeProps {
  isLiked: boolean;
  likeCount: number;
  onToggleLike: () => void;
  isPending: boolean;
}

/**
 * 게시글 상세 - 데스크톱용 플로팅 좋아요 버튼 (카드 오른쪽)
 */
export default function BoardDetailFloatingLike({
  isLiked,
  likeCount,
  onToggleLike,
  isPending,
}: BoardDetailFloatingLikeProps) {
  return (
    <div className="absolute top-[251px] left-[calc(900px+26px)]">
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onToggleLike}
          disabled={isPending}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-200 bg-white transition-colors"
        >
          {isLiked ? (
            <HeartFillIcon className="text-status-danger h-6 w-6" />
          ) : (
            <HeartIcon className="h-6 w-6 text-slate-400" />
          )}
        </button>
        <span className="text-sm text-slate-500">
          {formatLikeCount(likeCount)}
        </span>
      </div>
    </div>
  );
}
