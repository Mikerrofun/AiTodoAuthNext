"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onReset?: () => void;
};

type ErrorBoundaryState = { error: Error | null };

/**
 * React Error Boundary — ловит ошибки рендера и throw'ы (включая
 * ошибки из useSuspenseQuery). Для хуков error boundary в React нет,
 * поэтому class-компонент.
 *
 * `fallback` может быть ReactNode или render-prop с (error, reset).
 * `reset()` сбрасывает внутренний state — следующий рендер снова
 * пойдёт в Suspense / выполнит query.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      const { fallback } = this.props;
      return typeof fallback === "function"
        ? fallback(this.state.error, this.reset)
        : fallback;
    }
    return this.props.children;
  }
}
