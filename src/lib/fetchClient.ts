// HTTP 에러를 담는 커스텀 에러 페이지

// → fetch는 4xx, 5xx 응답을 자동으로 throw 하지 않기 때문에,
//    React Query나 ErrorBoundary가 에러를 인식하도록 직접 throw 하기 위해 사용한다.
export class HttpError extends Error {
  status: number;
  statusText: string;
  data: { code?: number; message?: string } | null;

  constructor(
    status: number,
    statusText: string,
    data: { code?: number; message?: string } | null = null,
  ) {
    super(`HTTP Error ${status}: ${statusText}`);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

// fetch 래퍼 함수
// → 모든 fetch 요청에서 공통 헤더 처리
// → HTTP 에러 발생 시 HttpError로 변환해 throw
// → 204 No Content 같은 특수 응답 처리
// → React Query에서 일관된 방식으로 에러를 처리할 수 있게 만든 공통 fetch 함수
export async function fetchClient<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  // 1. 로컬 스토리지에서 토큰 가져오기
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // 2. 토큰이 있으면 Authorization 헤더 자동 추가
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  // HTTP 에러 (4xx, 5xx) 처리
  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // JSON 파싱 실패 시 무시
    }
    throw new HttpError(response.status, response.statusText, errorData);
  }

  // 204 No Content 처리
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}
