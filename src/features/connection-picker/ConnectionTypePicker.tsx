import { useState, useCallback } from 'react';
import { CONNECTION_LABELS, CONNECTION_COLORS, type ConnectionType } from '@/shared/types/constants';

/**
 * Connection Type Picker — appears when user completes a two-click connection.
 * Renders as a floating popup at the specified screen coordinates.
 */
export function ConnectionTypePicker({
  x, y, onSelect, onCancel,
}: {
  x: number; y: number;
  onSelect: (type: ConnectionType) => void;
  onCancel: () => void;
}) {
  const types: ConnectionType[] = ['network', 'av', 'control', 'power'];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'transparent',
        }}
      />
      {/* Popup */}
      <div style={{
        position: 'fixed',
        left: Math.min(x, window.innerWidth - 200),
        top: Math.min(y, window.innerHeight - 220),
        zIndex: 9999,
        background: 'var(--color-bg-panel)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 8,
        minWidth: 180,
        boxShadow: 'var(--shadow-xl)',
        animation: 'fadeInUp 0.15s ease-out',
      }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)',
          padding: '4px 8px', marginBottom: 4,
        }}>
          选择连接类型
        </div>
        {types.map(type => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '8px 10px', border: 'none',
              background: 'transparent', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', color: 'var(--color-text-primary)',
              fontSize: 13, textAlign: 'left',
              transition: 'background 0.1s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{
              width: 24, height: 4, borderRadius: 2,
              background: CONNECTION_COLORS[type],
            }} />
            <span style={{ fontWeight: 500 }}>{CONNECTION_LABELS[type]}</span>
            <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginLeft: 'auto' }}>
              {type === 'network' ? 'RJ45' : type === 'av' ? 'HDMI/SDI' : type === 'control' ? 'RS232' : '220V'}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
