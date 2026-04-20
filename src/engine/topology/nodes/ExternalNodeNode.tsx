import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import type { ExternalNode } from '@/shared/types';
import { CONNECTION_COLORS } from '@/shared/types/constants';

export type ExternalNodeData = { node: ExternalNode };
export type ExternalNodeType = Node<ExternalNodeData, 'external'>;

const icons: Record<string, string> = {
  'department': '🏢',
  'platform': '🌐',
  'server': '💾',
  'external': '🔌',
  'internet': '🌍',
  'campus-network': '🏫',
  'cloud-server': '☁️',
  'broadcast-center': '📻',
  'power-grid': '⚡',
};

/**
 * ExternalNodeNode — Topology node for external infrastructure (internet, campus network, etc.).
 * 
 * Provides handles for all four connection types (network, av, control, power)
 * so it can be wired to any DeviceNode handle.
 */
export function ExternalNodeNode({ data, selected }: NodeProps<ExternalNodeType>) {
  const { node } = data;

  const handleStyle = (color: string): React.CSSProperties => ({
    background: color,
    width: 8,
    height: 8,
    border: `2px solid ${color}`,
  });

  return (
    <div
      style={{
        background: '#0F172A',
        borderRadius: 12,
        border: `2px solid ${selected ? '#0EA5E9' : '#334155'}`,
        boxShadow: selected ? '0 0 16px rgba(14, 165, 233, 0.4)' : '0 4px 6px rgba(0,0,0,0.2)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        color: '#F8FAFC',
      }}
    >
      {/* Network handles — left */}
      <Handle type="source" position={Position.Left} id="network-source" style={{ ...handleStyle(CONNECTION_COLORS.network), top: '35%' }} />
      <Handle type="target" position={Position.Left} id="network-target" style={{ ...handleStyle(CONNECTION_COLORS.network), top: '65%' }} />

      {/* Power handles — top */}
      <Handle type="source" position={Position.Top} id="power-source" style={{ ...handleStyle(CONNECTION_COLORS.power), left: '40%' }} />
      <Handle type="target" position={Position.Top} id="power-target" style={{ ...handleStyle(CONNECTION_COLORS.power), left: '60%' }} />

      {/* AV handles — right */}
      <Handle type="source" position={Position.Right} id="av-source" style={{ ...handleStyle(CONNECTION_COLORS.av), top: '35%' }} />
      <Handle type="target" position={Position.Right} id="av-target" style={{ ...handleStyle(CONNECTION_COLORS.av), top: '65%' }} />

      {/* Control handles — bottom */}
      <Handle type="source" position={Position.Bottom} id="control-source" style={{ ...handleStyle(CONNECTION_COLORS.control), left: '40%' }} />
      <Handle type="target" position={Position.Bottom} id="control-target" style={{ ...handleStyle(CONNECTION_COLORS.control), left: '60%' }} />

      <div style={{ fontSize: 24 }}>
        {icons[node.type] || '🌀'}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{node.name}</div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>{node.description}</div>
      </div>
    </div>
  );
}
