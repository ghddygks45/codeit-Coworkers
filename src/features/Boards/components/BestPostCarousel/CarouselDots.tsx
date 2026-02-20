interface CarouselDotsProps {
  /** 전체 페이지 수 */
  total: number;
  /** 현재 활성 페이지 (0부터 시작) */
  current: number;
  /** 페이지 변경 핸들러 */
  onPageChange: (index: number) => void;
}

/**
 * 캐러셀 페이지네이션 점 컴포넌트
 */
export default function CarouselDots({
  total,
  current,
  onPageChange,
}: CarouselDotsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onPageChange(index)}
          aria-label={`${index + 1}페이지로 이동`}
          className={`transition-all ${
            index === current
              ? "bg-interaction-inactive h-2 w-4 rounded-[80px]"
              : "bg-border-secondary h-2 w-2 rounded-full"
          }`}
        />
      ))}
    </div>
  );
}
