type ProgressBarProps = {
  percentage: number;
};

export default function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="relative mt-3 flex px-[26px] pb-[30px] md:mt-4 md:pb-[34px] lg:mt-4 lg:pr-[84px] lg:pb-[34px]">
      <div
        className="relative h-[20px] w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-label="진행률"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="animate-marqueeAnimation absolute left-0 flex h-full w-full rounded-full bg-[#F1F5F9]">
          <div className="animate-progress-stripes absolute left-full h-full w-full rounded-r-full bg-[repeating-linear-gradient(135deg,#EBEFF5_0px,#EBEFF5_12px,#F1F5F9_12px,#F1F5F9_24px)]"></div>
          <div className="animate-progress-stripes h-full w-full rounded-l-full bg-[repeating-linear-gradient(135deg,#EBEFF5_0px,#EBEFF5_12px,#F1F5F9_12px,#F1F5F9_24px)]"></div>
        </div>
        <div
          className="bg-brand-primary animate-progress-pulse absolute left-0 h-full rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
