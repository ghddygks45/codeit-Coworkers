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
//
// FormData일 때 Content-Type을 붙이지 않는 이유:
// - 이미지 업로드(POST /images/upload) 등은 body가 FormData(multipart/form-data)여야 함.
// - Content-Type을 application/json으로 고정하면 서버가 multipart로 인식하지 못해 413/500 발생.
// - FormData인 경우엔 Content-Type을 생략하면 브라우저가 boundary를 포함한 multipart/form-data를 자동 설정함.
// - JSON 요청(article, user, auth 등)은 기존처럼 application/json 유지되므로 다른 API에는 영향 없음.
export async function fetchClient<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  // 1. 로컬 스토리지에서 토큰 가져오기
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const isFormData = options?.body instanceof FormData;
  const response = await fetch(url, {
    ...options,
    headers: {
      // FormData일 때는 Content-Type 생략 (브라우저가 multipart/form-data; boundary=... 설정)
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  // HTTP 에러 (4xx, 5xx) 처리
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiry");
      alert("로그인 세션이 만료되었습니다.");
      window.location.href = "/login";
    }
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
