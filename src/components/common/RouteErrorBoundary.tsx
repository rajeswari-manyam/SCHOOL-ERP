import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

// ── Diagnostic boundary ──────────────────────────────────────────────────
// Wraps the parent portal's <Outlet>. If a route transition is silently
// failing (URL changes, screen doesn't), it's almost always because the
// newly-mounted page threw during render/commit and something upstream
// swallowed it. Without a boundary, React just bails out of that commit —
// which can *look* like "nothing happened" instead of a visible crash.
// This makes any such error impossible to miss.
export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    // Loud on purpose — this is a temporary diagnostic, not permanent UX.
    console.error("🔴 RouteErrorBoundary caught:", error, info?.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-lg w-full bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-red-700 font-bold text-lg mb-2">
              A page failed to render
            </h2>
            <p className="text-red-600 text-sm mb-3">
              {this.state.error.message}
            </p>
            <pre className="text-[11px] text-red-500 whitespace-pre-wrap overflow-auto max-h-64 bg-red-100 rounded-md p-3">
              {this.state.error.stack}
            </pre>
            <button
              className="mt-4 text-sm text-red-700 underline"
              onClick={() => this.setState({ error: null })}
            >
              Dismiss
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}