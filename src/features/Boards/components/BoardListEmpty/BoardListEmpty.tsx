interface BoardListEmptyProps {
  /** 검색어가 있으면 검색 결과 없음 메시지, 없으면 기본 빈 목록 메시지 */
  keyword?: string;
}

/**
 * 게시글 목록이 비었을 때 표시
 */
export default function BoardListEmpty({ keyword }: BoardListEmptyProps) {
  return (
    <div className="border-border-primary bg-background-secondary mt-4 rounded-lg border p-8 text-center">
      <p className="text-color-secondary">
        {keyword
          ? `"${keyword}"에 대한 검색 결과가 없습니다.`
          : "아직 게시글이 없습니다."}
      </p>
    </div>
  );
}
