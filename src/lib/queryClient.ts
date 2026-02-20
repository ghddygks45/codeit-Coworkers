// 리엑트 쿼리 설정 파일

import { QueryClient } from "@tanstack/react-query";
import { getErrorDataByCode } from "@/utils/errorCode";
import { useToastStore } from "@/stores/useToastStore";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
      retry: 1,
    },
    mutations: {
      // mutation 에러는 전파하지 않음 (toast로 처리)
      throwOnError: false,
      onError: (error) => {
        const errorData = getErrorDataByCode(error);
        // zustand store의 getState()로 React 외부에서 접근
        useToastStore.getState().show(errorData.message);
      },
    },
  },
});
