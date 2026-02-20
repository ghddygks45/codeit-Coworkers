/**
 * TeamMemberSection 로딩 스켈레톤
 * - 멤버 카드 레이아웃 (240px 카드 + 헤더 + 멤버 목록 플레이스홀더)
 */
export default function TeamMemberSkeleton() {
  return (
    <div className="bg-background-primary border-border-primary w-[240px] rounded-[12px] border-1 px-[20px] py-[24px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <div className="bg-background-tertiary h-5 w-10 animate-pulse rounded" />
          <div className="bg-background-tertiary h-5 w-12 animate-pulse rounded" />
        </div>
        <div className="bg-background-tertiary h-5 w-16 animate-pulse rounded" />
      </div>

      {/* 멤버 리스트 */}
      <div className="mt-[24px] space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="bg-background-tertiary h-8 w-8 animate-pulse rounded-full" />
            <div className="bg-background-tertiary h-4 w-28 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
