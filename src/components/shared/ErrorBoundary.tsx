import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallbackTitle: string;
  resetKey?: string;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Render error caught by ErrorBoundary', error, errorInfo);
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (this.state.error && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <section
        className="grid min-h-64 place-items-center rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-950"
        role="alert"
      >
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold">{this.props.fallbackTitle}</h1>
          <p className="mt-3 text-sm text-red-800">
            Сбросьте состояние и повторите действие. Подробности доступны
            разработчику в консоли.
          </p>
          {import.meta.env.DEV ? (
            <pre className="mt-5 overflow-auto rounded-lg bg-red-950 p-4 text-left text-xs text-red-50">
              {error.message}
            </pre>
          ) : null}
          <button
            className="control-button mx-auto mt-5"
            onClick={() => this.setState({ error: null })}
            type="button"
          >
            Повторить
          </button>
        </div>
      </section>
    );
  }
}
