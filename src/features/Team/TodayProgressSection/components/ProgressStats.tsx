type ProgressStatsProps = {
  progressPercentage: number;
  totalCount: number;
  doneCount: number;
};

export default function ProgressStats({
  progressPercentage,
  totalCount,
  doneCount,
}: ProgressStatsProps) {
  return (
    <div className="flex items-center justify-between px-[26px] lg:pr-[84px]">
      <div>
        <h3 className="text-xs-m text-color-disabled md:text-md-m">
          오늘의 진행 상황
        </h3>
        <strong className="text-brand-primary text-3xl-b md:text-4xl-b">
          {progressPercentage}%
        </strong>
      </div>
      <div className="flex gap-[32px]">
        <div className="before:bg-border-primary relative text-center before:absolute before:top-0 before:right-[-16px] before:h-full before:w-px">
          <p className="text-xs-m text-color-disabled">오늘의 할 일</p>
          <p className="text-2xl-b text-color-default md:text-3xl-b mt-1">
            {totalCount}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs-m text-color-disabled">완료🙌</p>
          <p className="text-2xl-b text-brand-primary md:text-3xl-b mt-1">
            {doneCount}
          </p>
        </div>
      </div>
    </div>
  );
}
