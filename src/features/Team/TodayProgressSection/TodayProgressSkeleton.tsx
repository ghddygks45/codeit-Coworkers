/**
 * TodayProgressSection 로딩 스켈레톤
 * - 그룹 헤더 + 진행도 통계 + 프로그레스 바 플레이스홀더
 */
export default function TodayProgressSkeleton() {
  return (
    <div className="bg-background-inverse rounded-[20px] p-6 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.05)]">
      {/* 그룹 헤더 */}
      <div className="flex items-center justify-between">
        <div className="bg-background-tertiary h-6 w-40 animate-pulse rounded" />
        <div className="bg-background-tertiary h-8 w-20 animate-pulse rounded-lg" />
      </div>

      {/* 진행도 통계 */}
      <div className="mt-4 flex gap-6">
        <div className="bg-background-tertiary h-10 w-24 animate-pulse rounded" />
        <div className="bg-background-tertiary h-10 w-24 animate-pulse rounded" />
        <div className="bg-background-tertiary h-10 w-24 animate-pulse rounded" />
      </div>

      {/* 프로그레스 바 */}
      <div className="bg-background-tertiary mt-4 h-2 w-full animate-pulse rounded-full" />
    </div>
  );
}
