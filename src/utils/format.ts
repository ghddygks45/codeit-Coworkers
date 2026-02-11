/**
 * 화면 표시용 포맷 유틸
 */

/** API 날짜 문자열을 "YYYY. MM. DD" 형식으로 변환 */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}. ${month}. ${day}`;
}

/** 좋아요 수 표시 (999 초과 시 "999+") */
export function formatLikeCount(count: number): string {
  if (count > 999) return "999+";
  return count.toString();
}
