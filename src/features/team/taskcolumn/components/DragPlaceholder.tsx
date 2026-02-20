export default function DragPlaceholder() {
  return (
    // onDragEnter stopPropagation: 플레이스홀더 진입 시 컬럼 핸들러로 버블링 차단
    <div
      className="mt-[12px] lg:mt-[20px]"
      onDragEnter={(e) => e.stopPropagation()}
    >
      <div className="border-brand-primary bg-brand-primary/5 h-[72px] rounded-[12px] border-2 border-dashed" />
    </div>
  );
}
