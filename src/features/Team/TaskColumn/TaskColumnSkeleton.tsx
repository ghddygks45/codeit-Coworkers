/**
 * TaskColumn 로딩 스켈레톤
 * - 헤더 + 3개 컬럼(할 일 / 진행중 / 완료) 플레이스홀더
 */
export default function TaskColumnSkeleton() {
  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <div className="bg-background-tertiary h-5 w-20 animate-pulse rounded" />
          <div className="bg-background-tertiary h-5 w-10 animate-pulse rounded" />
        </div>
        <div className="bg-background-tertiary h-8 w-24 animate-pulse rounded-lg" />
      </div>

      {/* 3개 컬럼 */}
      <div className="mt-[16px] justify-between md:mt-[30px] md:flex md:gap-[16px]">
        {["할 일", "진행중", "완료"].map((label) => (
          <div key={label} className="mt-[16px] flex-1 first:mt-0 md:mt-0">
            <div className="bg-background-tertiary flex items-center rounded-[12px] py-[10px] pl-[20px]">
              <div className="bg-background-secondary h-4 w-12 animate-pulse rounded" />
            </div>
            <div className="mt-[20px] space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-background-primary h-[80px] animate-pulse rounded-[12px]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
