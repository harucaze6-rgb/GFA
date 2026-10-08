import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
    console.error('AurumIntel ErrorBoundary caught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090d14] text-slate-100 flex items-center justify-center p-6 font-mono">
          <div className="max-w-md w-full bg-[#121722] border border-amber-500/40 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-lg font-bold">Terminal Operational Exception</h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              A runtime exception was intercepted by the institutional safety layer:
            </p>
            <div className="p-3 rounded bg-slate-900 border border-slate-800 text-[11px] text-rose-400 break-words">
              {this.state.error?.message || 'Unknown operational error'}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset & Reload Terminal</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
