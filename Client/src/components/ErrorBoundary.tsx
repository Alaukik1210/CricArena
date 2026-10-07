import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("[ErrorBoundary]", error, info.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="min-h-screen bg-black flex items-center justify-center px-6">
                    <div className="max-w-md w-full bg-[#1d1d1d] border border-white/10 rounded-2xl p-8 text-center">
                        <h1 className="text-2xl font-bold text-[#FFD070] mb-3">
                            Something went wrong
                        </h1>
                        <p className="text-white/70 text-sm mb-6">
                            {this.state.error?.message ?? "An unexpected error occurred."}
                        </p>
                        <button
                            onClick={this.handleReset}
                            className="px-5 py-2 rounded-lg bg-[#FFD070] text-black font-semibold"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
