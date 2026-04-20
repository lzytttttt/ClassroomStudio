import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import { Asset2DView } from '@/graphics';
import { getAssetById } from '@/features/component-library/assets-data';
import type { SceneComponent } from '@/shared/types';
import { CONNECTION_COLORS } from '@/shared/types/constants';

export type DeviceNodeData = { component: SceneComponent };
export type DeviceNodeType = Node<DeviceNodeData, 'device'>;

/**
 * DeviceNode — Topology node representing a classroom device.
 * 
 * Each connection type has BOTH source and target handles positioned on
 * specific edges of the node card. This ensures ReactFlow can draw edges
 * regardless of the drag direction (A→B or B→A) for any connection type.
 *
 * Layout:
 *   Top    — power   (red)
 *   Left   — network (blue)
 *   Right  — av      (purple)
 *   Bottom — control (cyan)
 */
export function DeviceNode({ data, selected }: NodeProps<DeviceNodeType>) {
  const { component } = data;
  const asset = getAssetById(component.assetId);

  if (!asset) return null;

  const handleStyle = (color: string, offset?: number): React.CSSProperties => ({
    background: color,
    width: 8,
    height: 8,
    border: `2px solid ${color}`,
    ...(offset !== undefined ? { left: `${offset}%` } : {}),
  });

  return (
    <div
      style={{
        background: 'var(--color-bg-panel)',
        borderRadius: 8,
        border: `2px solid ${selected ? '#38BDF8' : 'var(--color-border)'}`,
        boxShadow: selected ? '0 0 0 2px rgba(56, 189, 248, 0.4)' : '0 2px 4px rgba(0,0,0,0.05)',
        padding: 12,
        minWidth: 160,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* ═══ Power Handles (Top) — Red ═══ */}
      <Handle type="source" position={Position.Top} id="power-source" style={{ ...handleStyle(CONNECTION_COLORS.power), left: '40%' }} />
      <Handle type="target" position={Position.Top} id="power-target" style={{ ...handleStyle(CONNECTION_COLORS.power), left: '60%' }} />

      {/* ═══ Network Handles (Left) — Blue ═══ */}
      <Handle type="source" position={Position.Left} id="network-source" style={{ ...handleStyle(CONNECTION_COLORS.network), top: '35%' }} />
      <Handle type="target" position={Position.Left} id="network-target" style={{ ...handleStyle(CONNECTION_COLORS.network), top: '65%' }} />

      {/* Component info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40,
          background: 'var(--color-bg-canvas)',
          borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--color-border)',
        }}>
          <Asset2DView assetId={asset.id} width={30} height={30} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {component.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
            {component.properties.brand || asset.subcategory}
          </div>
        </div>
      </div>

      {/* ═══ AV Handles (Right) — Purple ═══ */}
      <Handle type="source" position={Position.Right} id="av-source" style={{ ...handleStyle(CONNECTION_COLORS.av), top: '35%' }} />
      <Handle type="target" position={Position.Right} id="av-target" style={{ ...handleStyle(CONNECTION_COLORS.av), top: '65%' }} />

      {/* ═══ Control Handles (Bottom) — Cyan ═══ */}
      <Handle type="source" position={Position.Bottom} id="control-source" style={{ ...handleStyle(CONNECTION_COLORS.control), left: '40%' }} />
      <Handle type="target" position={Position.Bottom} id="control-target" style={{ ...handleStyle(CONNECTION_COLORS.control), left: '60%' }} />
    </div>
  );
}
