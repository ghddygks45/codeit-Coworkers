import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { FetchBoundary } from "@/providers/boundary";
import { HttpError } from "@/lib/fetchClient";
import { useState } from "react";

// Mutation 에러 테스트 컴포넌트
function MutationErrorTest() {
  const mutation = useMutation({
    mutationFn: async () => {
      throw new HttpError(400, "Bad Request", {
        code: 400,
        message: "테스트 mutation 에러입니다",
      });
    },
  });

  return (
    <section className="bg-background-primary rounded-lg p-4">
      <h2 className="text-color-primary mb-2 text-lg font-semibold">
        5. Mutation 에러 (Toast로 표시)
      </h2>
      <p className="text-color-secondary mb-2 text-sm">
        클릭 시 하단에 Toast가 나타납니다
      </p>
      <button
        onClick={() => mutation.mutate()}
        className="bg-brand-primary text-color-inverse rounded-lg px-4 py-2"
      >
        Mutation 에러 테스트
      </button>
    </section>
  );
}

// 특정 에러를 throw하는 테스트 컴포넌트
function ErrorThrower({ errorCode }: { errorCode: number }) {
  useSuspenseQuery({
    queryKey: ["test-error", errorCode],
    queryFn: async () => {
      throw new HttpError(errorCode, `Test Error ${errorCode}`, null);
    },
    retry: false,
  });

  return null;
}

// 성공 컴포넌트
function SuccessComponent() {
  useSuspenseQuery({
    queryKey: ["test-success"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { message: "데이터 로딩 성공!" };
    },
  });

  return (
    <div className="bg-status-success/10 rounded-lg p-4">
      <p className="text-status-success">
        성공! 데이터가 정상적으로 로딩되었습니다.
      </p>
    </div>
  );
}

export default function TestErrorBoundary() {
  const [show401, setShow401] = useState(false);

  return (
    <div className="bg-background-secondary min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-color-primary mb-6 text-2xl font-bold">
          ErrorBoundary 테스트
        </h1>

        <div className="space-y-6">
          {/* 1. 성공 케이스 - 선언적 로딩 fallback */}
          <section className="bg-background-primary rounded-lg p-4">
            <h2 className="text-color-primary mb-2 text-lg font-semibold">
              1. 성공 (커스텀 로딩 UI)
            </h2>
            <FetchBoundary
              loadingFallback={
                <div className="text-brand-primary animate-pulse p-4">
                  데이터를 불러오는 중...
                </div>
              }
            >
              <SuccessComponent />
            </FetchBoundary>
          </section>

          {/* 2. 400 에러 - 선언적 에러 fallback */}
          <section className="bg-background-primary rounded-lg p-4">
            <h2 className="text-color-primary mb-2 text-lg font-semibold">
              2. 400 Bad Request (커스텀 에러 UI)
            </h2>
            <FetchBoundary
              errorFallback={
                <div className="bg-status-danger/10 rounded-lg p-4">
                  <p className="text-status-danger">400 에러가 발생했습니다!</p>
                </div>
              }
            >
              <ErrorThrower errorCode={400} />
            </FetchBoundary>
          </section>

          {/* 3. 500 에러 - 기본 DefaultErrorFallback 사용 */}
          <section className="bg-background-primary rounded-lg p-4">
            <h2 className="text-color-primary mb-2 text-lg font-semibold">
              3. 500 Error (기본 Fallback + 재시도 버튼)
            </h2>
            <FetchBoundary>
              <ErrorThrower errorCode={500} />
            </FetchBoundary>
          </section>

          {/* 4. 401 에러 - GlobalBoundary로 전파 */}
          <section className="bg-background-primary rounded-lg p-4">
            <h2 className="text-color-primary mb-2 text-lg font-semibold">
              4. 401 Unauthorized (GlobalBoundary로 전파)
            </h2>
            <p className="text-color-secondary mb-2 text-sm">
              클릭 시 전체 화면이 GlobalErrorFallback으로 전환됩니다
            </p>
            {!show401 ? (
              <button
                onClick={() => setShow401(true)}
                className="bg-status-danger text-color-inverse rounded-lg px-4 py-2"
              >
                401 에러 테스트
              </button>
            ) : (
              <FetchBoundary>
                <ErrorThrower errorCode={401} />
              </FetchBoundary>
            )}
          </section>

          {/* 5. Mutation 에러 - Toast로 표시 */}
          <MutationErrorTest />
        </div>
      </div>
    </div>
  );
}
