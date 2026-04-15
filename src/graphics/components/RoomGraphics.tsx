import React from 'react';
import { generateIsoBox, getIsoColors } from '../core/isometric';

interface Props {
  widthMm: number;
  heightMm: number;
  floorColor?: string;
  wallColor?: string;
  wallThickness?: number;
  wallHeight?: number;
}

export function RoomGraphics25DGroup({ 
  widthMm, 
  heightMm, 
  floorColor = '#F1F5F9', // light gray
  wallColor = '#E2E8F0', 
  wallThickness = 240,
  wallHeight = 3200 
}: Props) {
  // We use scale to keep SVG coordinates manageable. 
  // e.g. 1 unit = 1 meter
  const w = widthMm / 1000;
  const d = heightMm / 1000;
  const h = wallHeight / 1000;
  const t = wallThickness / 1000;

  // The floor is a thin box
  const floor = generateIsoBox(0, 0, 0, w, d, 0.05);
  // Instead of simple hex shading, use a sleek slate/glass base
  const premiumFloorColor = '#0F172A'; 
  const floorShading = getIsoColors(premiumFloorColor);

  return (
    <g>
      {/* Floor */}
      <path d={floor.top} fill={floorShading.top} stroke="rgba(255,255,255,0.05)" strokeWidth={0.02} />
      <path d={floor.left} fill={floorShading.left} />
      <path d={floor.right} fill={floorShading.right} />
      
      {/* Subtle Wall Glow / Glassmorphism */}
      <g opacity={0.35}>
        <path d={generateIsoBox(0, 0, 0.05, t, d, h).right} fill={getIsoColors('#334155').right} stroke="rgba(255,255,255,0.1)" strokeWidth={0.01} />
        <path d={generateIsoBox(0, 0, 0.05, t, d, h).top} fill={getIsoColors('#334155').top} stroke="rgba(255,255,255,0.1)" strokeWidth={0.01} />
      </g>
      
      <g opacity={0.35}>
        <path d={generateIsoBox(0, 0, 0.05, w, t, h).left} fill={getIsoColors('#334155').left} stroke="rgba(255,255,255,0.1)" strokeWidth={0.01} />
        <path d={generateIsoBox(0, 0, 0.05, w, t, h).top} fill={getIsoColors('#334155').top} stroke="rgba(255,255,255,0.1)" strokeWidth={0.01} />
      </g>

      {/* Grid Lines on Floor - High-tech blueprint style */}
      <g opacity={0.15}>
        {Array.from({ length: Math.ceil(w) }).map((_, i) => {
          const p1 = generateIsoBox(i, 0, 0.051, 0, d, 0).top;
          return <path key={`gx-${i}`} d={p1} stroke="#38BDF8" strokeWidth={i % 5 === 0 ? 0.04 : 0.015} />;
        })}
        {Array.from({ length: Math.ceil(d) }).map((_, j) => {
          const p1 = generateIsoBox(0, j, 0.051, w, 0, 0).top;
          return <path key={`gy-${j}`} d={p1} stroke="#38BDF8" strokeWidth={j % 5 === 0 ? 0.04 : 0.015} />;
        })}
      </g>
    </g>
  );
}

export function RoomGraphics25D(props: Props) {
  const w = props.widthMm / 1000;
  const d = props.heightMm / 1000;
  const h = (props.wallHeight || 3200) / 1000;

  return (
    <svg 
      viewBox={`-${Math.max(w, d)} -${h + 2} ${Math.max(w, d) * 2} ${(Math.max(w, d) + h) * 1.5}`} 
      width="100%" height="100%" 
      style={{ overflow: 'visible' }}
    >
      <RoomGraphics25DGroup {...props} />
    </svg>
  );
}
