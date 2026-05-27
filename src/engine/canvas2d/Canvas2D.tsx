import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { Stage, Layer, Rect, Group, Line, Text, Circle, Transformer } from 'react-konva';
import type Konva from 'konva';
import { useSceneStore } from '@/store/sceneStore';
import { useUIStore } from '@/store/uiStore';
import { getAssetById } from '@/features/component-library/assets-data';
import type { InteractionVisualEffect } from '@/shared/types/interaction';
import { CONNECTION_COLORS, type ConnectionType } from '@/shared/types/constants';
import { generateId } from '@/shared/utils/id';
import { ConnectionTypePicker } from '@/features/connection-picker/ConnectionTypePicker';
import { useInteractionStore } from '@/store/interactionStore';
import ComponentNode from './ComponentNode';
import { MM_TO_PX, WALL_COLOR, WALL_WIDTH } from './constants';

// Expose screenshot capability via a global ref
export const canvas2dScreenshotRef: { current: (() => void) | null } = { current: null };

export default function Canvas2D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [alignmentLines, setAlignmentLines] = useState<{ id: string; points: [number, number, number, number]; color: string; }[]>([]);
  const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const isSelecting = useRef(false);

  const {
    scene, addComponent, updateComponent, selectComponents,
    addToSelection, clearSelection, setZoom, setPan, addConnection, updateRoom
  } = useSceneStore();
  const { activeTool, connectionSource, setConnectionSource, showConnections2D } = useUIStore();
  const [connectTarget, setConnectTarget] = useState<{ id: string; screenX: number; screenY: number } | null>(null);
  const [connectPreview, setConnectPreview] = useState<{ x: number; y: number } | null>(null);

  const { room, components, viewState } = scene;
  const { canvas2d, selectedIds } = viewState;
  const scale = canvas2d.zoom;

  // Interaction effects from the interaction framework
  const { activeEffects, setActiveComponent } = useInteractionStore();

  // Sync selection → interaction store
  useEffect(() => {
    setActiveComponent(selectedIds.length === 1 ? selectedIds[0] : null, scene);
  }, [selectedIds, scene, setActiveComponent]);

  // Build effect map: componentId → highlight effect
  const effectMap = useMemo(() => {
    const map = new Map<string, InteractionVisualEffect>();
    for (const effect of activeEffects) {
      if (effect.type === 'highlight_components') {
        for (const cid of effect.targetComponentIds) {
          map.set(cid, effect);
        }
      }
    }
    return map;
  }, [activeEffects]);

  // Coverage effects for the selected component
  const coverageEffects = useMemo(() => {
    return activeEffects.filter(e => e.type === 'show_coverage_area');
  }, [activeEffects]);

  // Room dimensions in pixels
  const roomW = room.width * MM_TO_PX;
  const roomH = room.height * MM_TO_PX;

  // Center offset so room is centered in canvas
  const offsetX = (stageSize.width / scale - roomW) / 2 + canvas2d.panX / scale;
  const offsetY = (stageSize.height / scale - roomH) / 2 + canvas2d.panY / scale;

  // ============================================
  // Screenshot function (exposed via ref)
  // ============================================
  useEffect(() => {
    canvas2dScreenshotRef.current = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const dataUrl = stage.toDataURL({ pixelRatio: 2, mimeType: 'image/png' });
      const link = document.createElement('a');
      link.download = `classroom-2d-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    };
    return () => { canvas2dScreenshotRef.current = null; };
  }, []);

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
    // Click on empty area → deselect (only if not finishing a selection box)
    if (!isSelecting.current && (e.target === e.target.getStage() || e.target.name() === 'background' || e.target.name() === 'grid-line' || e.target.name() === 'wall')) {
      if (activeTool === 'connect') {
        // Cancel connect mode on empty click
        setConnectionSource(null);
        setConnectPreview(null);
      } else {
        clearSelection();
      }
    }
  }, [clearSelection, activeTool, setConnectionSource]);

  // ============================================
  // Box Selection (marquee select)
  // ============================================
  const handleStageMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (activeTool !== 'select') return;
    // Only start selection on empty area click
    if (e.target !== e.target.getStage() && e.target.name() !== 'background' && e.target.name() !== 'grid-line' && e.target.name() !== 'wall') return;

    const stage = stageRef.current;
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    // Convert screen pos to scene coordinates
    const sceneX = pos.x / scale - offsetX;
    const sceneY = pos.y / scale - offsetY;

    isSelecting.current = true;
    setSelectionBox({ startX: sceneX, startY: sceneY, endX: sceneX, endY: sceneY });
  }, [activeTool, scale, offsetX, offsetY]);

  const handleStageMouseMove = useCallback((_e: Konva.KonvaEventObject<MouseEvent>) => {
    // Connect tool preview
    if (activeTool === 'connect' && connectionSource) {
      const stage = stageRef.current;
      if (!stage) return;
      const pos = stage.getPointerPosition();
      if (!pos) return;
      const sceneX = pos.x / scale - offsetX;
      const sceneY = pos.y / scale - offsetY;
      setConnectPreview({ x: sceneX, y: sceneY });
    }

    if (!isSelecting.current) return;
    const stage = stageRef.current;
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    const sceneX = pos.x / scale - offsetX;
    const sceneY = pos.y / scale - offsetY;

    setSelectionBox(prev => prev ? { ...prev, endX: sceneX, endY: sceneY } : null);
  }, [scale, offsetX, offsetY, activeTool, connectionSource]);

  const handleStageMouseUp = useCallback(() => {
    if (!isSelecting.current || !selectionBox) {
      isSelecting.current = false;
      setSelectionBox(null);
      return;
    }
    isSelecting.current = false;

    // Calculate selection rect in scene space (px)
    const x1 = Math.min(selectionBox.startX, selectionBox.endX);
    const y1 = Math.min(selectionBox.startY, selectionBox.endY);
    const x2 = Math.max(selectionBox.startX, selectionBox.endX);
    const y2 = Math.max(selectionBox.startY, selectionBox.endY);

    // Only select if box is large enough (avoid click-like micro drags)
    if (Math.abs(x2 - x1) < 5 && Math.abs(y2 - y1) < 5) {
      setSelectionBox(null);
      return;
    }

    // Find components intersecting with this box
    const selectedIds: string[] = [];
    components.forEach(comp => {
      const asset = getAssetById(comp.assetId);
      if (!asset) return;
      const cw = asset.defaultSize.width * MM_TO_PX * comp.scale.x;
      const ch = asset.defaultSize.height * MM_TO_PX * comp.scale.y;
      const cx = comp.position.x * MM_TO_PX;
      const cy = comp.position.y * MM_TO_PX;

      // Check intersection (component rect vs selection rect)
      if (cx + cw > x1 && cx < x2 && cy + ch > y1 && cy < y2) {
        selectedIds.push(comp.id);
      }
    });

    if (selectedIds.length > 0) {
      selectComponents(selectedIds);
    }
    setSelectionBox(null);
  }, [selectionBox, components, selectComponents]);

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
  // Handle Drag End with Auto-Elevation Snap
  // ============================================
  const handleDragEnd = useCallback((id: string, x: number, y: number) => {
    setAlignmentLines([]);
    
    // Auto-elevation placement interaction
    const comp = components.find(c => c.id === id);
    if (!comp) return;
    const compAsset = getAssetById(comp.assetId);
    
    let newElevation = 0; // Default to floor
    let newZIndex = comp.zIndex;
    
    // If it's a piece of equipment being dropped
    if (compAsset && !['asset-desk-student', 'asset-chair-student', 'asset-desk-teacher', 'asset-lab-table'].includes(compAsset.id)) {
      const cw = compAsset.defaultSize.width * comp.scale.x;
      const ch = compAsset.defaultSize.height * comp.scale.y;
      
      const cx = x + cw / 2;
      const cy = y + ch / 2;
      
      // Find if it intersects with any surface (desk, table)
      const surfaces = components.filter(c => c.id !== id);
      for (const surface of surfaces) {
        const sAsset = getAssetById(surface.assetId);
        if (sAsset && (sAsset.id.includes('desk') || sAsset.id.includes('table'))) {
          const sw = sAsset.defaultSize.width * surface.scale.x;
          const sh = sAsset.defaultSize.height * surface.scale.y;
          const sx1 = surface.position.x;
          const sy1 = surface.position.y;
          const sx2 = sx1 + sw;
          const sy2 = sy1 + sh;
          
          if (cx >= sx1 && cx <= sx2 && cy >= sy1 && cy <= sy2) {
             // Place on top of table
             newElevation = surface.elevation + 750; // common table height
             newZIndex = surface.zIndex + 10;
             break;
          }
        }
      }
    }
    
    updateComponent(id, { 
      position: { x, y },
      elevation: newElevation > 0 ? newElevation : comp.elevation,
      zIndex: newElevation > 0 ? newZIndex : comp.zIndex
    });
  }, [components, updateComponent]);

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
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onWheel={handleWheel}
        draggable={activeTool === 'pan'}
        onDragEnd={(e) => {
          if (e.target === stageRef.current) {
            setPan(e.target.x(), e.target.y());
          }
        }}
        style={{ cursor: activeTool === 'pan' ? 'grab' : activeTool === 'connect' ? 'crosshair' : 'default' }}
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
              fill={room.floorColor || '#F8FAFC'}
              shadowColor="rgba(0,0,0,0.15)"
              shadowBlur={30}
              shadowOffsetY={8}
              cornerRadius={4}
            />

            {/* Grid */}
            {gridLines}

            {/* Walls */}
            <Line name="wall" points={[0, 0, roomW, 0, roomW, roomH, 0, roomH, 0, 0]} stroke={room.wallColor || WALL_COLOR} strokeWidth={WALL_WIDTH} closed listening={false} fill="transparent" />

            {/* Door/Window rendering */}
            {[...room.doors, ...room.windows].map(item => {
              const isDoor = item.type === 'door';
              const posPx = item.position * MM_TO_PX;
              const widPx = item.width * MM_TO_PX;
              const itemColor = isDoor ? '#8B4513' : '#87CEEB';
              const bgColor = room.floorColor || '#F8FAFC';

              // Determine axis config based on wall direction
              const isHorizontal = item.wall === 'north' || item.wall === 'south';
              const wallConfig = {
                north: { gx: posPx, gy: 0, constrainAxis: 'y' as const, constrainVal: 0, maxDim: room.width, doorDir: 1 },
                south: { gx: posPx, gy: roomH, constrainAxis: 'y' as const, constrainVal: roomH, maxDim: room.width, doorDir: -1 },
                east:  { gx: roomW, gy: posPx, constrainAxis: 'x' as const, constrainVal: roomW, maxDim: room.height, doorDir: -1 },
                west:  { gx: 0, gy: posPx, constrainAxis: 'x' as const, constrainVal: 0, maxDim: room.height, doorDir: 1 },
              }[item.wall];
              if (!wallConfig) return null;

              const { gx, gy, constrainAxis, constrainVal, maxDim, doorDir } = wallConfig;

              // Wall clearing line + door/window shapes differ by orientation
              const clearPoints: number[] = isHorizontal ? [0, 0, widPx, 0] : [0, 0, 0, widPx];

              return (
                <Group
                  key={item.id}
                  x={gx} y={gy}
                  draggable
                  onDragMove={(e) => {
                    if (constrainAxis === 'y') e.target.y(constrainVal);
                    else e.target.x(constrainVal);
                  }}
                  onDragEnd={(e) => {
                    const rawPos = constrainAxis === 'y' ? e.target.x() : e.target.y();
                    let newPos = rawPos / MM_TO_PX;
                    newPos = Math.max(0, Math.min(newPos, maxDim - item.width));
                    const items = isDoor ? room.doors : room.windows;
                    updateRoom({
                      [isDoor ? 'doors' : 'windows']: items.map(d => d.id === item.id ? { ...d, position: newPos } : d),
                    });
                    if (constrainAxis === 'y') e.target.x(newPos * MM_TO_PX);
                    else e.target.y(newPos * MM_TO_PX);
                  }}
                  onMouseEnter={(e) => { const stage = e.target.getStage(); if (stage) stage.container().style.cursor = 'grab'; }}
                  onMouseLeave={(e) => { const stage = e.target.getStage(); if (stage) stage.container().style.cursor = 'default'; }}
                >
                  {/* Clear wall segment */}
                  <Line points={clearPoints} stroke={bgColor} strokeWidth={WALL_WIDTH + 2} listening={false} />
                  {isDoor ? (
                    <Group>
                      {isHorizontal ? (
                        <Line points={[0, 0, 0, widPx * 0.6 * doorDir]} stroke={itemColor} strokeWidth={1.5} opacity={0.5} dash={[3, 3]} listening={false} />
                      ) : (
                        <Line points={[0, 0, widPx * 0.6 * doorDir, 0]} stroke={itemColor} strokeWidth={1.5} opacity={0.5} dash={[3, 3]} listening={false} />
                      )}
                      {isHorizontal ? (
                        <>
                          <Line points={[widPx, 0, widPx, 0]} stroke={itemColor} strokeWidth={3} listening={false} />
                          <Line points={[0, 0, 0, 0]} stroke={itemColor} strokeWidth={3} listening={false} />
                        </>
                      ) : (
                        <>
                          <Line points={[0, widPx, 0, widPx]} stroke={itemColor} strokeWidth={3} listening={false} />
                          <Line points={[0, 0, 0, 0]} stroke={itemColor} strokeWidth={3} listening={false} />
                        </>
                      )}
                    </Group>
                  ) : (
                    <Group>
                      {isHorizontal ? (
                        <>
                          <Line points={[0, -2, widPx, -2]} stroke={itemColor} strokeWidth={2} listening={false} />
                          <Line points={[0, 2, widPx, 2]} stroke={itemColor} strokeWidth={2} listening={false} />
                          <Line points={[0, -2, 0, 2]} stroke={itemColor} strokeWidth={1} listening={false} />
                          <Line points={[widPx, -2, widPx, 2]} stroke={itemColor} strokeWidth={1} listening={false} />
                        </>
                      ) : (
                        <>
                          <Line points={[-2, 0, -2, widPx]} stroke={itemColor} strokeWidth={2} listening={false} />
                          <Line points={[2, 0, 2, widPx]} stroke={itemColor} strokeWidth={2} listening={false} />
                          <Line points={[-2, 0, 2, 0]} stroke={itemColor} strokeWidth={1} listening={false} />
                          <Line points={[-2, widPx, 2, widPx]} stroke={itemColor} strokeWidth={1} listening={false} />
                        </>
                      )}
                    </Group>
                  )}
                  {/* Invisible Hitbox for dragging */}
                  {isHorizontal
                    ? <Rect x={0} y={-10} width={widPx} height={20} fill="transparent" />
                    : <Rect x={-10} y={0} width={20} height={widPx} fill="transparent" />
                  }
                </Group>
              );
            })}

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
            {/* Coverage area circles */}
            {coverageEffects.map(effect => {
              const payload = effect.payload as { shape?: string; radius?: number } | undefined;
              if (payload?.shape !== 'circle' || !payload.radius) return null;
              const targetComp = components.find(c => effect.targetComponentIds.includes(c.id));
              if (!targetComp) return null;
              const asset = getAssetById(targetComp.assetId);
              const cx = targetComp.position.x * MM_TO_PX + ((asset?.defaultSize.width ?? 0) * MM_TO_PX * targetComp.scale.x) / 2;
              const cy = targetComp.position.y * MM_TO_PX + ((asset?.defaultSize.height ?? 0) * MM_TO_PX * targetComp.scale.y) / 2;
              const radiusPx = payload.radius * MM_TO_PX;
              return (
                <Circle
                  key={effect.id}
                  x={cx} y={cy}
                  radius={radiusPx}
                  fill={effect.style?.color ?? '#3B82F6'}
                  opacity={effect.style?.opacity ?? 0.08}
                  listening={false}
                />
              );
            })}

            {components.map(comp => (
              <ComponentNode
                key={comp.id}
                component={comp}
                isSelected={selectedIds.includes(comp.id)}
                effectHighlight={effectMap.get(comp.id)}
                isConnectSource={activeTool === 'connect' && connectionSource === comp.id}
                onSelect={(id, multi) => {
                  if (activeTool === 'connect') {
                    if (!connectionSource) {
                      // First click: set source
                      setConnectionSource(id);
                    } else if (connectionSource !== id) {
                      // Second click: open type picker
                      const stage = stageRef.current;
                      const container = containerRef.current;
                      if (stage && container) {
                        const rect = container.getBoundingClientRect();
                        const pos = stage.getPointerPosition();
                        setConnectTarget({
                          id,
                          screenX: (pos?.x || 0) + rect.left,
                          screenY: (pos?.y || 0) + rect.top,
                        });
                      }
                    }
                    return;
                  }
                  if (multi) {
                    addToSelection(id);
                  } else {
                    selectComponents([id]);
                  }
                }}
                onDragMove={(id, x, y, w, h, e) => handleDragMove(id, x, y, w, h, e)}
                onDragEnd={handleDragEnd}
                snapToGrid={false}
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

          {/* Selection Box */}
          {selectionBox && (
            <Group x={offsetX} y={offsetY}>
              <Rect
                x={Math.min(selectionBox.startX, selectionBox.endX)}
                y={Math.min(selectionBox.startY, selectionBox.endY)}
                width={Math.abs(selectionBox.endX - selectionBox.startX)}
                height={Math.abs(selectionBox.endY - selectionBox.startY)}
                fill="rgba(59, 130, 246, 0.08)"
                stroke="#3B82F6"
                strokeWidth={1 / scale}
                dash={[6 / scale, 4 / scale]}
                listening={false}
              />
            </Group>
          )}

          {/* Connection Lines Layer */}
          {(showConnections2D || activeTool === 'connect') ? (
            <Group x={offsetX} y={offsetY}>
              {scene.connections.map(conn => {
              const sourceComp = components.find(c => c.id === conn.sourceId);
              const targetComp = components.find(c => c.id === conn.targetId);
              if (!sourceComp || !targetComp) return null;

              const sAsset = getAssetById(sourceComp.assetId);
              const tAsset = getAssetById(targetComp.assetId);
              if (!sAsset || !tAsset) return null;

              const sx = sourceComp.position.x * MM_TO_PX + (sAsset.defaultSize.width * MM_TO_PX * sourceComp.scale.x) / 2;
              const sy = sourceComp.position.y * MM_TO_PX + (sAsset.defaultSize.height * MM_TO_PX * sourceComp.scale.y) / 2;
              const tx = targetComp.position.x * MM_TO_PX + (tAsset.defaultSize.width * MM_TO_PX * targetComp.scale.x) / 2;
              const ty = targetComp.position.y * MM_TO_PX + (tAsset.defaultSize.height * MM_TO_PX * targetComp.scale.y) / 2;

              const color = CONNECTION_COLORS[conn.type as ConnectionType] || '#6B7280';
              // Quadratic bezier control point (offset for curve)
              const mx = (sx + tx) / 2;
              const my = (sy + ty) / 2;
              const dx = tx - sx;
              const dy = ty - sy;
              const _offset = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.15, 40);
              const cx = mx - dy * 0.2;
              const cy = my + dx * 0.2;

              return (
                <Group key={conn.id}>
                  {/* Connection curve */}
                  <Line
                    points={[sx, sy, cx, cy, tx, ty]}
                    stroke={color}
                    strokeWidth={2 / scale}
                    tension={0.5}
                    lineCap="round"
                    opacity={0.7}
                    listening={false}
                  />
                  {/* Animated dash overlay */}
                  <Line
                    points={[sx, sy, cx, cy, tx, ty]}
                    stroke={color}
                    strokeWidth={2 / scale}
                    tension={0.5}
                    dash={[6 / scale, 4 / scale]}
                    lineCap="round"
                    opacity={0.4}
                    listening={false}
                  />
                  {/* Line endpoint dots */}
                  <Circle x={sx} y={sy} radius={3 / scale} fill={color} listening={false} />
                  <Circle x={tx} y={ty} radius={3 / scale} fill={color} listening={false} />
                  {/* Connection label */}
                  <Group x={mx} y={my - 8 / scale}>
                    <Rect
                      x={-20 / scale} y={-6 / scale}
                      width={40 / scale} height={12 / scale}
                      fill="rgba(255,255,255,0.9)"
                      cornerRadius={3 / scale}
                      listening={false}
                    />
                    <Text
                      x={-18 / scale} y={-4 / scale}
                      width={36 / scale}
                      text={conn.label || conn.type}
                      fontSize={8 / scale}
                      fontFamily="Inter, sans-serif"
                      fill={color}
                      align="center"
                      listening={false}
                    />
                  </Group>
                </Group>
              );
            })}
          </Group>
          ) : null}

          {/* Connect tool preview line */}
          {(activeTool === 'connect' && connectionSource && connectPreview) ? (() => {
            const srcComp = components.find(c => c.id === connectionSource);
            if (!srcComp) return null;
            const srcAsset = getAssetById(srcComp.assetId);
            if (!srcAsset) return null;
            const sx = srcComp.position.x * MM_TO_PX + (srcAsset.defaultSize.width * MM_TO_PX * srcComp.scale.x) / 2;
            const sy = srcComp.position.y * MM_TO_PX + (srcAsset.defaultSize.height * MM_TO_PX * srcComp.scale.y) / 2;
            return (
              <Group x={offsetX} y={offsetY}>
                <Line
                  points={[sx, sy, connectPreview.x, connectPreview.y]}
                  stroke="#7C3AED"
                  strokeWidth={2 / scale}
                  dash={[8 / scale, 4 / scale]}
                  opacity={0.6}
                  listening={false}
                />
                <Circle x={sx} y={sy} radius={4 / scale} fill="#7C3AED" listening={false} />
                <Circle x={connectPreview.x} y={connectPreview.y} radius={3 / scale} fill="#7C3AED" opacity={0.5} listening={false} />
              </Group>
            );
          })() : null}

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

      {/* Connection Type Picker Popup */}
      {connectTarget && connectionSource && (
        <ConnectionTypePicker
          x={connectTarget.screenX}
          y={connectTarget.screenY}
          onSelect={(type) => {
            addConnection({
              id: generateId(),
              sourceId: connectionSource,
              targetId: connectTarget.id,
              type,
              label: type.toUpperCase(),
              bandwidth: '',
              protocol: '',
              style: { color: '', dashArray: '', lineWidth: 2, animated: true },
            });
            setConnectTarget(null);
            setConnectionSource(null);
            setConnectPreview(null);
          }}
          onCancel={() => {
            setConnectTarget(null);
            setConnectionSource(null);
            setConnectPreview(null);
          }}
        />
      )}

      {/* Connect mode status bar */}
      {activeTool === 'connect' && (
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          padding: '6px 16px', borderRadius: 20,
          background: 'rgba(124, 58, 237, 0.9)', color: 'white',
          fontSize: 12, fontWeight: 500, pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
        }}>
          {connectionSource ? '🔌 点击目标设备完成连线' : '🔌 点击源设备开始连线'}
        </div>
      )}
    </div>
  );
}

