import { useRef, useCallback, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Group, Line, Text, Circle, Transformer } from 'react-konva';
import type Konva from 'konva';
import { useSceneStore } from '@/store/sceneStore';
import { useUIStore } from '@/store/uiStore';
import { getAssetById } from '@/features/component-library/assets-data';
import type { SceneComponent } from '@/shared/types';

// ============================================
// Constants
// ============================================
const MM_TO_PX = 0.08;   // 1mm = 0.08px at zoom=1 (so 12000mm = 960px)
const WALL_COLOR = '#94A3B8';
const WALL_WIDTH = 6;

export default function Canvas2D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [alignmentLines, setAlignmentLines] = useState<{ id: string; points: [number, number, number, number]; color: string; }[]>([]);

  const {
    scene, addComponent, updateComponent, selectComponents,
    addToSelection, clearSelection, setZoom, setPan,
  } = useSceneStore();
  const { activeTool } = useUIStore();

  const { room, components, viewState } = scene;
  const { canvas2d, selectedIds } = viewState;
  const scale = canvas2d.zoom;

  // Room dimensions in pixels
  const roomW = room.width * MM_TO_PX;
  const roomH = room.height * MM_TO_PX;

  // Center offset so room is centered in canvas
  const offsetX = (stageSize.width / scale - roomW) / 2 + canvas2d.panX / scale;
  const offsetY = (stageSize.height / scale - roomH) / 2 + canvas2d.panY / scale;

  // ============================================
  // Resize observer
  // ============================================
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setStageSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // ============================================
  // Update transformer on selection change
  // ============================================
  useEffect(() => {
    const tr = transformerRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;

    const nodes = selectedIds
      .map(id => stage.findOne(`#comp-${id}`))
      .filter(Boolean) as Konva.Node[];

    tr.nodes(nodes);
    tr.getLayer()?.batchDraw();
  }, [selectedIds, components]);

  // ============================================
  // Drop handler (from component library)
  // ============================================
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const assetId = e.dataTransfer.getData('application/asset-id');
    if (!assetId) return;

    const stage = stageRef.current;
    if (!stage) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const stagePos = {
      x: (e.clientX - rect.left) / scale - offsetX,
      y: (e.clientY - rect.top) / scale - offsetY,
    };

    // Convert px back to mm
    const mmX = stagePos.x / MM_TO_PX;
    const mmY = stagePos.y / MM_TO_PX;

    // Snap to grid if enabled
    const gridMm = canvas2d.gridSize;
    const finalX = canvas2d.snapToGrid ? Math.round(mmX / gridMm) * gridMm : mmX;
    const finalY = canvas2d.snapToGrid ? Math.round(mmY / gridMm) * gridMm : mmY;

    addComponent(assetId, finalX, finalY);
  }, [addComponent, scale, offsetX, offsetY, canvas2d.gridSize, canvas2d.snapToGrid]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // ============================================
  // Stage events
  // ============================================
  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    // Click on empty area → deselect
    if (e.target === e.target.getStage() || e.target.name() === 'background' || e.target.name() === 'grid-line' || e.target.name() === 'wall') {
      clearSelection();
    }
  }, [clearSelection]);

  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const delta = e.evt.deltaY;
    const newZoom = delta > 0
      ? Math.max(0.1, canvas2d.zoom - 0.05)
      : Math.min(3, canvas2d.zoom + 0.05);
    setZoom(newZoom);
  }, [canvas2d.zoom, setZoom]);

  // ============================================
  // Smart Alignment Snapping
  // ============================================
  const handleDragMove = useCallback((id: string, xPx: number, yPx: number, wPx: number, hPx: number, e: Konva.KonvaEventObject<DragEvent>) => {
    const SNAP_TOLERANCE = 8 / scale;
    let snX = xPx;
    let snY = yPx;

    const lines: { id: string; points: [number, number, number, number]; color: string; }[] = [];

    components.forEach((c) => {
      if (c.id === id || selectedIds.includes(c.id)) return;
      const asset = getAssetById(c.assetId);
      if (!asset) return;

      const cw = asset.defaultSize.width * MM_TO_PX * c.scale.x;
      const ch = asset.defaultSize.height * MM_TO_PX * c.scale.y;
      const cx = c.position.x * MM_TO_PX;
      const cy = c.position.y * MM_TO_PX;

      // Target bounding box points
      const rx = cx + cw;
      const by = cy + ch;
      const mx = cx + cw / 2;
      const my = cy + ch / 2;

      // Moving bounding box points
      const mrx = xPx + wPx;
      const mby = yPx + hPx;
      const mmx = xPx + wPx / 2;
      const mmy = yPx + hPx / 2;

      // Check X axis
      if (Math.abs(xPx - cx) < SNAP_TOLERANCE) { snX = cx; lines.push({ id: `v-${c.id}-l`, points: [cx, 0, cx, roomH], color: '#3B82F6' }); }
      else if (Math.abs(xPx - rx) < SNAP_TOLERANCE) { snX = rx; lines.push({ id: `v-${c.id}-lr`, points: [rx, 0, rx, roomH], color: '#3B82F6' }); }
      else if (Math.abs(mrx - cx) < SNAP_TOLERANCE) { snX = cx - wPx; lines.push({ id: `v-${c.id}-rl`, points: [cx, 0, cx, roomH], color: '#3B82F6' }); }
      else if (Math.abs(mrx - rx) < SNAP_TOLERANCE) { snX = rx - wPx; lines.push({ id: `v-${c.id}-rr`, points: [rx, 0, rx, roomH], color: '#3B82F6' }); }
      else if (Math.abs(mmx - mx) < SNAP_TOLERANCE) { snX = mx - wPx / 2; lines.push({ id: `v-${c.id}-c`, points: [mx, 0, mx, roomH], color: '#EF4444' }); }

      // Check Y axis
      if (Math.abs(yPx - cy) < SNAP_TOLERANCE) { snY = cy; lines.push({ id: `h-${c.id}-t`, points: [0, cy, roomW, cy], color: '#3B82F6' }); }
      else if (Math.abs(yPx - by) < SNAP_TOLERANCE) { snY = by; lines.push({ id: `h-${c.id}-tb`, points: [0, by, roomW, by], color: '#3B82F6' }); }
      else if (Math.abs(mby - cy) < SNAP_TOLERANCE) { snY = cy - hPx; lines.push({ id: `h-${c.id}-bt`, points: [0, cy, roomW, cy], color: '#3B82F6' }); }
      else if (Math.abs(mby - by) < SNAP_TOLERANCE) { snY = by - hPx; lines.push({ id: `h-${c.id}-bb`, points: [0, by, roomW, by], color: '#3B82F6' }); }
      else if (Math.abs(mmy - my) < SNAP_TOLERANCE) { snY = my - hPx / 2; lines.push({ id: `h-${c.id}-m`, points: [0, my, roomW, my], color: '#EF4444' }); }
    });

    if (lines.length > 0) {
      e.target.x(snX);
      e.target.y(snY);
      setAlignmentLines(lines);
    } else {
      setAlignmentLines([]);
      // fallback to Grid snap during drag if enabled
      if (canvas2d.snapToGrid) {
        const gridPx = canvas2d.gridSize * MM_TO_PX;
        const sX = Math.round(xPx / gridPx) * gridPx;
        const sY = Math.round(yPx / gridPx) * gridPx;
        // only snap if we are very close to grid to maintain smooth dragging otherwise
        if (Math.abs(xPx - sX) < SNAP_TOLERANCE) e.target.x(sX);
        if (Math.abs(yPx - sY) < SNAP_TOLERANCE) e.target.y(sY);
      }
    }
  }, [components, selectedIds, scale, roomW, roomH, canvas2d.snapToGrid, canvas2d.gridSize]);

  // ============================================
  // Grid lines
  // ============================================
  const gridLines: React.ReactNode[] = [];
  if (canvas2d.showGrid) {
    const gridPx = canvas2d.gridSize * MM_TO_PX;
    const majorEvery = 5;

    for (let i = 0; i <= Math.ceil(roomW / gridPx); i++) {
      const x = i * gridPx;
      const isMajor = i % majorEvery === 0;
      gridLines.push(
        <Line
          key={`gv-${i}`}
          name="grid-line"
          points={[x, 0, x, roomH]}
          stroke={isMajor ? 'var(--color-grid-strong)' : 'var(--color-grid)'}
          strokeWidth={isMajor ? 0.5 : 0.3}
          opacity={isMajor ? 0.6 : 0.35}
          listening={false}
        />
      );
    }
    for (let j = 0; j <= Math.ceil(roomH / gridPx); j++) {
      const y = j * gridPx;
      const isMajor = j % majorEvery === 0;
      gridLines.push(
        <Line
          key={`gh-${j}`}
          name="grid-line"
          points={[0, y, roomW, y]}
          stroke={isMajor ? '#B0BEC5' : '#CFD8DC'}
          strokeWidth={isMajor ? 0.5 : 0.3}
          opacity={isMajor ? 0.6 : 0.35}
          listening={false}
        />
      );
    }
  }

  // ============================================
  // Render
  // ============================================
  return (
    <div
      ref={containerRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={scale}
        scaleY={scale}
        onClick={handleStageClick}
        onWheel={handleWheel}
        draggable={activeTool === 'pan'}
        onDragEnd={(e) => {
          if (e.target === stageRef.current) {
            setPan(e.target.x(), e.target.y());
          }
        }}
        style={{ cursor: activeTool === 'pan' ? 'grab' : 'default' }}
      >
        {/* Background */}
        <Layer listening={false}>
          <Rect
            name="background"
            x={0} y={0}
            width={stageSize.width / scale}
            height={stageSize.height / scale}
            fill="#F1F5F9"
          />
        </Layer>

        {/* Room + Grid layer */}
        <Layer>
          <Group x={offsetX} y={offsetY}>
            {/* Room floor */}
            <Rect
              name="background"
              x={0} y={0}
              width={roomW} height={roomH}
              fill="#F8FAFC"
              shadowColor="rgba(0,0,0,0.15)"
              shadowBlur={30}
              shadowOffsetY={8}
              cornerRadius={4}
            />

            {/* Grid */}
            {gridLines}

            {/* Walls */}
            <Line name="wall" points={[0, 0, roomW, 0, roomW, roomH, 0, roomH, 0, 0]} stroke={WALL_COLOR} strokeWidth={WALL_WIDTH} closed listening={false} fill="transparent" />

            {/* Room dimensions labels */}
            <Text
              text={`${room.width / 1000}m`}
              x={roomW / 2 - 20} y={-18}
              fontSize={11} fontFamily="Inter, sans-serif"
              fill="#94A3B8" listening={false}
            />
            <Text
              text={`${room.height / 1000}m`}
              x={-30} y={roomH / 2 - 6}
              fontSize={11} fontFamily="Inter, sans-serif"
              fill="#94A3B8" listening={false}
              rotation={-90}
            />
          </Group>
        </Layer>

        {/* Components layer */}
        <Layer>
          <Group x={offsetX} y={offsetY}>
            {components.map(comp => (
              <ComponentNode
                key={comp.id}
                component={comp}
                isSelected={selectedIds.includes(comp.id)}
                onSelect={(id, multi) => {
                  if (multi) {
                    addToSelection(id);
                  } else {
                    selectComponents([id]);
                  }
                }}
                onDragMove={(id, x, y, w, h, e) => handleDragMove(id, x, y, w, h, e)}
                onDragEnd={(id, x, y) => {
                  setAlignmentLines([]);
                  // Simply use the snapped position set by handleDragMove
                  updateComponent(id, { position: { x, y } });
                }}
                snapToGrid={false} // snapping handled dynamically now
                gridSize={canvas2d.gridSize}
              />
            ))}
          </Group>

          {/* Alignment Guides Layer (on top of components) */}
          <Group x={offsetX} y={offsetY}>
             {alignmentLines.map(line => (
               <Line
                 key={line.id}
                 points={line.points}
                 stroke={line.color}
                 strokeWidth={1 / scale}
                 dash={[4 / scale, 4 / scale]}
                 listening={false}
               />
             ))}
          </Group>

          {/* Transformer */}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 10 || newBox.height < 10) return oldBox;
              return newBox;
            }}
            rotateEnabled={true}
            rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
            anchorSize={7}
            anchorCornerRadius={2}
            borderStroke="#38BDF8"
            borderStrokeWidth={1.5}
            anchorStroke="#38BDF8"
            anchorFill="#0F172A"
          />
        </Layer>
      </Stage>
    </div>
  );
}

// ============================================
// Component Node (individual device on canvas)
// ============================================
interface ComponentNodeProps {
  component: SceneComponent;
  isSelected: boolean;
  onSelect: (id: string, multi: boolean) => void;
  onDragMove: (id: string, x: number, y: number, w: number, h: number, e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  snapToGrid: boolean;
  gridSize: number;
}

function ComponentNode({ component, isSelected, onSelect, onDragMove, onDragEnd, snapToGrid, gridSize }: ComponentNodeProps) {
  const asset = getAssetById(component.assetId);
  if (!asset) return null;

  const w = asset.defaultSize.width * MM_TO_PX * component.scale.x;
  const h = asset.defaultSize.height * MM_TO_PX * component.scale.y;
  const px = component.position.x * MM_TO_PX;
  const py = component.position.y * MM_TO_PX;

  // Determine visual style based on category
  const color = asset.color;
  const labelFontSize = Math.max(8, Math.min(11, w / 6));

  return (
    <Group
      id={`comp-${component.id}`}
      x={px}
      y={py}
      rotation={component.rotation}
      draggable={!component.locked}
      onClick={(e) => {
        e.cancelBubble = true;
        onSelect(component.id, e.evt.shiftKey);
      }}
      onDragMove={(e) => {
        onDragMove(component.id, e.target.x(), e.target.y(), w, h, e);
      }}
      onDragEnd={(e) => {
        // use the exact x,y from the node after potential snapping manipulation
        const newX = e.target.x() / MM_TO_PX;
        const newY = e.target.y() / MM_TO_PX;
        onDragEnd(component.id, newX, newY);
      }}
      opacity={component.opacity}
    >
      {/* Shadow */}
      <Rect
        x={2} y={2}
        width={w} height={h}
        fill="rgba(0,0,0,0.06)"
        cornerRadius={3}
        listening={false}
      />

      {/* Main body (Glass effect) */}
      <Rect
        x={0} y={0}
        width={w} height={h}
        fill={`${color}15`}
        stroke={isSelected ? '#38BDF8' : `${color}80`}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={4}
        shadowColor={color}
        shadowBlur={isSelected ? 10 : 0}
        shadowOpacity={0.3}
      />

      {/* Inner Highlight for depth */}
      <Rect
        x={1} y={1}
        width={w - 2} height={h - 2}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1}
        cornerRadius={3}
        listening={false}
      />

      {/* Color indicator bar */}
      <Rect
        x={0} y={0}
        width={w} height={4}
        fill={color}
        cornerRadius={[4, 4, 0, 0]}
        opacity={0.9}
        listening={false}
      />

      {/* Glowing Icon dot */}
      <Circle
        x={w / 2} y={h / 2 - (labelFontSize > 9 ? 4 : 0)}
        radius={Math.min(w, h) * 0.15}
        fill={color}
        opacity={0.7}
        shadowColor={color}
        shadowBlur={4}
        shadowOpacity={0.5}
        listening={false}
      />

      {/* Label */}
      {w > 20 && h > 16 && (
        <Text
          x={2}
          y={h - labelFontSize - 3}
          width={w - 4}
          text={component.name}
          fontSize={labelFontSize}
          fontFamily="Inter, Noto Sans SC, sans-serif"
          fill={`${color}`}
          align="center"
          ellipsis={true}
          wrap="none"
          listening={false}
        />
      )}

      {/* Selected Box Outline Glow */}
      {isSelected && (
        <Rect
          x={-4} y={-4}
          width={w + 8} height={h + 8}
          stroke="#38BDF8"
          strokeWidth={2}
          dash={[6, 4]}
          cornerRadius={6}
          listening={false}
          opacity={0.6}
        />
      )}
    </Group>
  );
}
