import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

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
                <div className="min-h-screen bg-ground flex items-center justify-center px-6">
                    <div className="max-w-md w-full bg-surface border border-rule-soft rounded p-8 text-center">
                        <h1 className="text-2xl font-bold text-ink mb-3">
                            Something went wrong
                        </h1>
                        <p className="text-ink-soft text-sm mb-6">
                            {this.state.error?.message ?? "An unexpected error occurred."}
                        </p>
                        <Button onClick={this.handleReset}>Try again</Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
