export function DefaultLoadingFallback() {
  return (
    <div className="text-color-secondary flex items-center justify-center gap-2 p-8 text-sm">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      로딩 중...
    </div>
  );
}
