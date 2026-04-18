import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useSceneStore } from '@/store/sceneStore';
import { Asset25DNodeGroup, RoomGraphics25DGroup, toIsoPoint } from '@/graphics';
import { getAssetById } from '@/features/component-library/assets-data';

// ============================================
// Constants
// ============================================
// Using 1 unit = 1 meter, which matches the scale in graphics engine.
// Base pixel visual size: 1 meter = 100px.
const METER_TO_PX = 100;

export default function Canvas25D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  
  const { scene, selectComponents, addToSelection, clearSelection } = useSceneStore();
  const { room, components, viewState } = scene;
  const { selectedIds } = viewState;

  // Track resizing
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

  // Center room logic (once on mount or when room base size changes drastically)
  // The room dimensions in meters:
  const roomW = room.width / 1000;
  const roomD = room.height / 1000;
  const roomH = room.ceilingHeight / 1000;

  // The Isometric bounding width natively calculated:
  // Since it's diamond-shaped, the width is generally (w + d) * cos(30).
  // A simplistic centering approach is to place the room's (0,0) (back-top corner)
  // roughly in the middle top.
  const cx = stageSize.width / 2;
  const cy = stageSize.height / 4; // Start near top

  // Event Handlers for Native Pan and Zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    setZoom((prevZoom) => Math.min(Math.max(0.1, prevZoom + delta * prevZoom * 10), 5));
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button === 1 || e.button === 0) {
      // Middle or left click to pan on background
      // If clicking on an empty area
      if ((e.target as SVGElement).tagName.toLowerCase() === 'svg') {
         clearSelection();
      }
      setIsDragging(true);
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    }
  }, [clearSelection]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isDragging) {
      setPan((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
  }, [isDragging]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
  }, []);

  // Prepare Depth-Sorted Components
  // Isometric depth sorting: back to front, bottom to top.
  // Weight = x + y (since x and y origin distances grow towards us).
  const sortedComponents = [...components].sort((a, b) => {
    const depthA = a.position.x + a.position.y;
    const depthB = b.position.x + b.position.y;
    if (Math.abs(depthA - depthB) < 1) {
       return a.elevation - b.elevation;
    }
    return depthA - depthB;
  });

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#F1F5F9', // light background
        cursor: isDragging ? 'grabbing' : 'grab',
        position: 'relative'
      }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          transformOrigin: '0 0',
          // Note setting overflow visible ensures we don't clip inside the SVG canvas
        }}
      >
        {/* Main Transform Group */}
        <g transform={`translate(${cx + pan.x}, ${cy + pan.y}) scale(${zoom * METER_TO_PX})`}>
          
          {/* Room Base Rendering */}
          <RoomGraphics25DGroup 
            widthMm={room.width} 
            heightMm={room.height} 
            wallHeight={room.ceilingHeight}
            wallThickness={room.wallThickness}
            floorColor={room.floorColor}
            wallColor={room.wallColor}
          />

          {/* Components Rendering */}
          {sortedComponents.map((comp) => {
            const isSelected = selectedIds.includes(comp.id);
            // Project 2D physical coordinates to Iso coordinate space translations
            // x, y in mm -> meters
            const originX = comp.position.x / 1000;
            const originY = comp.position.y / 1000;
            const originZ = comp.elevation / 1000;

            const proj = toIsoPoint(originX, originY, originZ);

            // Compute Physical Scaling:
            const asset = getAssetById(comp.assetId);
            const scaleX = (asset ? asset.defaultSize.width / 1000 : 1) * comp.scale.x;
            const scaleY = (asset ? asset.defaultSize.height / 1000 : 1) * comp.scale.y;
            const scaleZ = asset ? asset.defaultSize.depth / 1000 : 1;

            return (
              <g 
                key={comp.id}
                transform={`translate(${proj.x}, ${proj.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.shiftKey) {
                    addToSelection(comp.id);
                  } else {
                    selectComponents([comp.id]);
                  }
                }}
                style={{ cursor: 'pointer' }}
                opacity={comp.visible ? comp.opacity : 0}
              >
                {/* Node inner rendering */}
                <Asset25DNodeGroup 
                  assetId={comp.assetId} 
                  scaleX={scaleX}
                  scaleY={scaleY}
                  scaleZ={scaleZ}
                  rotationZ={comp.rotation}
                />
                
                {/* Selection Highlight (drawn slightly offset or as a stroke) */}
                {isSelected && (
                  <circle cx="0" cy="0" r="0.1" fill="none" stroke="#2563EB" strokeWidth="0.02" strokeDasharray="0.05, 0.05" />
                )}
              </g>
            );
          })}
        </g>
      </svg>
      
      {/* HUD Info */}
      <div style={{ position: 'absolute', bottom: 16, right: 16, color: '#94A3B8', fontSize: 12, fontFamily: 'monospace' }}>
        Zoom: {(zoom * 100).toFixed(0)}%
      </div>
    </div>
  );
}
