import React from 'react';
import { Group, Rect, Circle, Text } from 'react-konva';
import type Konva from 'konva';
import type { SceneComponent } from '@/shared/types';
import type { InteractionVisualEffect } from '@/shared/types/interaction';
import { getAssetById } from '@/features/component-library/assets-data';
import { getComponentRenderer } from './component-renderers';
import { MM_TO_PX } from './constants';

// ============================================
// Component Node (individual device on canvas)
// ============================================
export interface ComponentNodeProps {
  component: SceneComponent;
  isSelected: boolean;
  effectHighlight?: InteractionVisualEffect;
  isConnectSource?: boolean;
  onSelect: (id: string, multi: boolean) => void;
  onDragMove: (id: string, x: number, y: number, w: number, h: number, e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  snapToGrid: boolean;
  gridSize: number;
}

const ComponentNode = React.memo(function ComponentNode({ component, isSelected, effectHighlight, isConnectSource, onSelect, onDragMove, onDragEnd, snapToGrid: _snapToGrid, gridSize: _gridSize }: ComponentNodeProps) {
  const asset = getAssetById(component.assetId);
  if (!asset) return null;

  const w = asset.defaultSize.width * MM_TO_PX * component.scale.x;
  const h = asset.defaultSize.height * MM_TO_PX * component.scale.y;
  const px = component.position.x * MM_TO_PX;
  const py = component.position.y * MM_TO_PX;

  const color = asset.color;
  const labelFontSize = Math.max(7, Math.min(10, w / 7));
  const renderer = getComponentRenderer(asset.icon2d);

  return (
    <Group
      id={`comp-${component.id}`}
      x={px + w / 2}
      y={py + h / 2}
      offsetX={w / 2}
      offsetY={h / 2}
      rotation={component.rotation}
      draggable={!component.locked}
      onClick={(e) => {
        e.cancelBubble = true;
        onSelect(component.id, e.evt.shiftKey);
      }}
      onDragMove={(e) => {
        // e.target.x() is the true coordinate of the anchor point (center due to offsetX/Y)
        // pass adjusted x, y (top-left) to the upper layer so snapping works reliably with top-left paradigm
        onDragMove(component.id, e.target.x() - w / 2, e.target.y() - h / 2, w, h, e);
      }}
      onDragEnd={(e) => {
        const newX = (e.target.x() - w / 2) / MM_TO_PX;
        const newY = (e.target.y() - h / 2) / MM_TO_PX;
        onDragEnd(component.id, newX, newY);
      }}
      opacity={component.opacity}
    >
      {/* Shadow */}
      <Rect
        x={1.5} y={1.5}
        width={w} height={h}
        fill="rgba(0,0,0,0.08)"
        cornerRadius={3}
        listening={false}
      />

      {/* Device body — use detailed renderer if available, otherwise fallback */}
      {renderer ? (
        renderer(w, h, color)
      ) : (
        <Group>
          <Rect
            x={0} y={0}
            width={w} height={h}
            fill={`${color}20`}
            stroke={`${color}80`}
            strokeWidth={1}
            cornerRadius={3}
          />
          <Rect
            x={0} y={0}
            width={w} height={3}
            fill={color}
            cornerRadius={[3, 3, 0, 0]}
            opacity={0.8}
            listening={false}
          />
          <Circle
            x={w / 2} y={h / 2}
            radius={Math.min(w, h) * 0.12}
            fill={color}
            opacity={0.5}
            listening={false}
          />
        </Group>
      )}

      {/* Label (below device body) */}
      {w > 15 && h > 12 && (
        <Group>
          {/* Label background */}
          <Rect
            x={0}
            y={h + 1}
            width={w}
            height={labelFontSize + 4}
            fill="rgba(255,255,255,0.85)"
            cornerRadius={2}
            listening={false}
          />
          <Text
            x={1}
            y={h + 2}
            width={w - 2}
            text={component.name}
            fontSize={labelFontSize}
            fontFamily="Inter, Noto Sans SC, sans-serif"
            fill="#334155"
            align="center"
            ellipsis={true}
            wrap="none"
            listening={false}
          />
        </Group>
      )}

      {/* Selection highlight */}
      {isSelected && (
        <Rect
          x={-3} y={-3}
          width={w + 6} height={h + 6}
          stroke="#38BDF8"
          strokeWidth={2}
          dash={[6, 3]}
          cornerRadius={5}
          listening={false}
          shadowColor="#38BDF8"
          shadowBlur={8}
          shadowOpacity={0.4}
        />
      )}

      {/* Connect source highlight */}
      {isConnectSource && (
        <Rect
          x={-4} y={-4}
          width={w + 8} height={h + 8}
          stroke="#7C3AED"
          strokeWidth={2.5}
          cornerRadius={6}
          listening={false}
          shadowColor="#7C3AED"
          shadowBlur={12}
          shadowOpacity={0.6}
        />
      )}

      {/* Interaction effect highlight */}
      {effectHighlight && !isSelected && (
        <Rect
          x={-2} y={-2}
          width={w + 4} height={h + 4}
          stroke={effectHighlight.style?.color ?? '#F59E0B'}
          strokeWidth={1.5}
          dash={effectHighlight.style?.dashed ? [4, 3] : undefined}
          cornerRadius={4}
          listening={false}
          shadowColor={effectHighlight.style?.color ?? '#F59E0B'}
          shadowBlur={4}
          shadowOpacity={0.3}
          opacity={effectHighlight.style?.opacity ?? 1}
        />
      )}
    </Group>
  );
});

export default ComponentNode;
