import { Component } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class TimetableErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center py-20 gap-4"
        >
          <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle size={28} className="text-red-500" strokeWidth={1.5} />
          </div>
          <div className="text-center max-w-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Something went wrong
            </h2>
            <p className="text-sm text-gray-500">
              {this.state.error?.message ?? "An unexpected error occurred"}
            </p>
          </div>
          <Button
            onClick={this.handleRetry}
            className="gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm"
          >
            <RefreshCw size={15} strokeWidth={2} />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
