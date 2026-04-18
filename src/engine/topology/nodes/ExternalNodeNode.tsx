import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import type { ExternalNode } from '@/shared/types';

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

export function ExternalNodeNode({ data, selected }: NodeProps<ExternalNodeType>) {
  const { node } = data;

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
      <Handle type="target" position={Position.Left} id="in" style={{ background: '#94A3B8' }} />
      <Handle type="source" position={Position.Right} id="out" style={{ background: '#94A3B8' }} />
      
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
