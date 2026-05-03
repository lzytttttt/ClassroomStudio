import React from 'react';

interface Props {
  children: React.ReactNode;
  fallbackLabel?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Generic Error Boundary that catches render errors and shows a recovery UI
 * instead of a blank white screen.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', this.props.fallbackLabel ?? 'Component', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: 200,
            padding: 32,
            background: '#F8FAFC',
            borderRadius: 8,
            border: '1px solid #E2E8F0',
            fontFamily: "'Inter', 'Noto Sans SC', system-ui, sans-serif",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              fontSize: 24,
            }}
          >
            !
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#0F172A',
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            {this.props.fallbackLabel ? `${this.props.fallbackLabel} 出现错误` : '组件渲染出错'}
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#64748B',
              marginBottom: 20,
              textAlign: 'center',
              maxWidth: 400,
              lineHeight: 1.6,
            }}
          >
            {this.state.error?.message || '发生了一个意外错误，您可以尝试恢复或刷新页面。'}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                color: '#2563EB',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#DBEAFE';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#EFF6FF';
              }}
            >
              重试
            </button>
            <button
              onClick={this.handleReload}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#E2E8F0';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#F1F5F9';
              }}
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
