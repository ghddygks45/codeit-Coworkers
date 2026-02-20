/**
 * 게시글 목록 초기 로딩 스켈레톤 (4개 카드 플레이스홀더)
 */
export default function BoardListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-background-secondary h-[140px] animate-pulse rounded-[20px] md:h-[156px]"
        />
      ))}
    </div>
  );
}
