import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import { Asset2DView } from '@/graphics';
import { getAssetById } from '@/features/component-library/assets-data';
import type { SceneComponent } from '@/shared/types';

export type DeviceNodeData = { component: SceneComponent };
export type DeviceNodeType = Node<DeviceNodeData, 'device'>;

export function DeviceNode({ data, selected }: NodeProps<DeviceNodeType>) {
  const { component } = data;
  const asset = getAssetById(component.assetId);

  if (!asset) return null;

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
      {/* Power Handle (Top) */}
      <Handle
        type="target"
        position={Position.Top}
        id="power"
        style={{ background: '#DC2626', width: 10, height: 10 }}
      />
      
      {/* Network Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        id="network"
        style={{ background: '#2563EB', width: 10, height: 10 }}
      />

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

      {/* AV Handle (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        id="av"
        style={{ background: '#7C3AED', width: 10, height: 10 }}
      />

      {/* Control Handle (Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="control"
        style={{ background: '#0891B2', width: 10, height: 10 }}
      />
    </div>
  );
}
