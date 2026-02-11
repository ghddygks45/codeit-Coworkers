import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { DefaultErrorFallback } from "./DefaultErrorFallback";
import { DefaultLoadingFallback } from "./DefaultLoadingFallback";

interface FetchBoundaryProps {
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export function FetchBoundary({
  children,
  loadingFallback,
  errorFallback,
}: FetchBoundaryProps) {
  if (errorFallback) {
    return (
      <ErrorBoundary fallback={<>{errorFallback}</>}>
        <Suspense fallback={loadingFallback ?? <DefaultLoadingFallback />}>
          {children}
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={DefaultErrorFallback}>
      <Suspense fallback={loadingFallback ?? <DefaultLoadingFallback />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
