import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('DISASTER DHOST Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100">
          <div className="max-w-md w-full bg-slate-900 rounded-3xl border border-red-500/40 p-8 shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-white">DISASTER DHOST System</h2>
            <p className="text-xs text-slate-400">
              A temporary initialization issue occurred. Tap below to reload your emergency session.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Emergency Engine</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
