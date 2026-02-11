import { HttpError } from "@/lib/fetchClient";

export type ErrorData = {
  code: string;
  message: string;
  requireLogin?: boolean;
};

type ErrorCodeType = {
  [key: string]: ErrorData;
};

export const ERROR_CODE: ErrorCodeType = {
  default: { code: "ERROR", message: "알 수 없는 오류가 발생했습니다." },

  // 네트워크 에러 (fetch 실패 시)
  TypeError: {
    code: "통신 에러",
    message: "서버가 응답하지 않습니다.\n네트워크 연결을 확인해주세요.",
  },

  // HTTP 상태 코드
  400: { code: "400", message: "잘못된 요청입니다." },
  401: { code: "401", message: "인증이 필요합니다.", requireLogin: true },
  403: { code: "403", message: "권한이 없습니다." },
  404: { code: "404", message: "요청한 리소스를 찾을 수 없습니다." },
  500: { code: "500", message: "서버 오류가 발생했습니다." },

  // 서버에서 정의한 에러 코드 (백엔드와 협의 후 추가)
  // 4001: { code: '4001', message: '요청에 대한 Validation 에러입니다.' },
  // 4011: { code: '4011', message: '인증이 만료되었습니다.', requireLogin: true },
} as const;

export function getErrorDataByCode(error: unknown) {
  // HttpError인 경우 (fetch 래퍼에서 throw한 에러)
  if (error instanceof HttpError) {
    // 1순위: 서버에서 보낸 에러 코드
    const serverCode = error.data?.code?.toString() ?? "";
    if (serverCode in ERROR_CODE) {
      return ERROR_CODE[serverCode];
    }

    // 2순위: HTTP 상태 코드
    const httpCode = error.status.toString();
    if (httpCode in ERROR_CODE) {
      return ERROR_CODE[httpCode];
    }
  }

  // 네트워크 에러 (TypeError)
  if (error instanceof TypeError) {
    return ERROR_CODE.TypeError;
  }

  // 그 외 에러 - 실제 에러 메시지 표시
  const errorMessage = error instanceof Error ? error.message : String(error);
  return {
    code: "ERROR",
    message: `알 수 없는 오류가 발생했습니다.\n${errorMessage}`,
  };
}
