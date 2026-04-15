import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, getSmoothStepPath, getStraightPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import { CONNECTION_COLORS } from '@/shared/types/constants';

export function SignalEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
  markerEnd,
}: EdgeProps) {
  // data contains connection info: type, label, etc. and global lineStyle
  const connectionType = data?.type as string || 'network';
  const label = data?.label as string || '';
  const bandwidth = data?.bandwidth as string;
  const lineStyle = data?.lineStyle as 'bezier' | 'step' | 'straight' || 'bezier';

  let pathParams = {
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  };

  let edgePath;
  let labelX, labelY;

  if (lineStyle === 'step') {
    const res = getSmoothStepPath({ ...pathParams, borderRadius: 12 });
    edgePath = res[0];
    labelX = res[1]; labelY = res[2];
  } else if (lineStyle === 'straight') {
    const res = getStraightPath(pathParams);
    edgePath = res[0];
    labelX = res[1]; labelY = res[2];
  } else {
    const res = getBezierPath(pathParams);
    edgePath = res[0];
    labelX = res[1]; labelY = res[2];
  }

  const baseColor = CONNECTION_COLORS[connectionType as keyof typeof CONNECTION_COLORS] || '#94A3B8';

  // Animation style based on type
  const isAnimated = connectionType === 'network' || connectionType === 'av';
  const dashArray = connectionType === 'network' ? '4 4' : connectionType === 'av' ? '12 6' : undefined;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: connectionType === 'power' ? 3 : 2,
          stroke: baseColor,
          strokeDasharray: dashArray,
        }}
        className={isAnimated ? 'react-flow__edge-path-animated' : ''}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: 'var(--color-bg-panel)',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 600,
              color: baseColor,
              border: `1px solid ${baseColor}40`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            {label}
            {bandwidth && <span style={{ marginLeft: 4, opacity: 0.7 }}>{bandwidth}</span>}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
